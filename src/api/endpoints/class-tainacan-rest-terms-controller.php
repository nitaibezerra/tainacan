<?php

use Tainacan\Entities;
use Tainacan\Repositories;

class TAINACAN_REST_Terms_Controller extends WP_REST_Controller {
	private $term;
	private $terms_repository;
	private $taxonomy;
	private $taxonomy_repository;

	/**
	 * TAINACAN_REST_Terms_Controller constructor.
	 */
	public function __construct() {
		$this->namespace = 'tainacan/v2';
		$this->rest_base = 'terms';

		$this->term = new Entities\Term();
		$this->terms_repository = new Repositories\Terms();
		$this->taxonomy = new Entities\Taxonomy();
		$this->taxonomy_repository = new Repositories\Taxonomies();

		add_action('rest_api_init', array($this, 'register_routes'));
	}

	public function register_routes() {
		register_rest_route($this->namespace, '/' . $this->rest_base . '/taxonomy/(?P<taxonomy_id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array($this, 'create_item'),
					'permission_callback' => array($this, 'create_item_permissions_check')
				)
			)
		);
		register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<term_id>[\d]+)/taxonomy/(?P<taxonomy_id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array($this, 'delete_item'),
					'permission_callbacl' => array($this, 'delete_item_permissions_check')
				)
			)
		);
	}

	/**
	 * @param WP_REST_Request $to_prepare
	 *
	 * @return object|void|WP_Error
	 */
	public function prepare_item_for_database( $to_prepare ) {
		$attributes = $to_prepare[0];
		$taxonomy = $to_prepare[1];

		foreach ($attributes as $attribute => $value){
			$set_ = 'set_'. $attribute;

			try {
				$this->term->$set_( $value );
			} catch (\Error $error){
				// Do nothing
			}
		}

		$this->term->set_taxonomy($taxonomy);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		$taxonomy_id = $request['taxonomy_id'];
		$body = json_decode($request->get_body(), true);

		$taxonomy = $this->taxonomy_repository->fetch($taxonomy_id);
		$taxonomy_db_identifier = $taxonomy->get_db_identifier();

		if(!empty($body)){
			$to_prepare = [$body, $taxonomy_db_identifier];
			$this->prepare_item_for_database($to_prepare);

			if($this->term->validate()){
				$term_id = $this->terms_repository->insert($this->term);

				$term_inserted = $this->terms_repository->fetch($term_id, $taxonomy);

				return new WP_REST_Response($term_inserted->__toArray(), 200);
			} else {
				return new WP_REST_Response([
					'error_message' => 'One or more attributes are invalid.',
					'errors'        => $this->term->get_errors(),
				], 400);
			}
		}

		return new WP_REST_Response([
			'error_message' => 'The body couldn\'t be empty.',
			'body'          => $body,
		], 400);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return bool|WP_Error
	 */
	public function create_item_permissions_check( $request ) {
		return $this->terms_repository->can_edit($this->term);
	}

	public function delete_item( $request ) {
		$term_id = $request['term_id'];
		$taxonomy_id = $request['taxonomy_id'];

		$taxonomy_name = $this->taxonomy_repository->fetch( $taxonomy_id )->get_db_identifier();

		if(!$taxonomy_name){
			return new WP_REST_Response([
				'error_message' => 'The ID of taxonomy may be incorrect.'
			]);
		}

		$args = [$term_id, $taxonomy_name];

		$is_deleted = $this->terms_repository->delete($args);

		return new WP_REST_Response($is_deleted, 200);
	}

	public function delete_item_permissions_check( $request ) {
		$term = $this->terms_repository->fetch($request['term_id']);
		return $this->terms_repository->can_delete($term);
	}
}

?>