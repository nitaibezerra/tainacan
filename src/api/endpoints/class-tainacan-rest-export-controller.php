<?php

namespace Tainacan\API\EndPoints;

use \Tainacan\API\REST_Controller;
use Tainacan\Entities;
use Tainacan\Repositories;
use Tainacan\Entities\Entity;

class REST_Export_Controller extends REST_Controller {
	private $item_metadata_repository;
	private $items_repository;
	private $collection_repository;
	private $field_repository;

	public function __construct() {
		$this->rest_base = 'export';
		parent::__construct();
		add_action('init', array(&$this, 'init_objects'), 11);
	}

	/**
	 * Initialize objects after post_type register
	 *
	 * @throws \Exception
	 */
	public function init_objects() {
		$this->field_repository = Repositories\Fields::get_instance();
		$this->item_metadata_repository = Repositories\Item_Metadata::get_instance();
		$this->items_repository = Repositories\Items::get_instance();
		$this->collection_repository = Repositories\Collections::get_instance();
	}

	/**
	 * If POST on field/collection/<collection_id>, then
	 * a field will be created in matched collection and all your item will receive this field
	 *
	 * If POST on field/item/<item_id>, then a value will be added in a field and field passed
	 * id body of requisition
	 *
	 * Both of GETs return the field of matched objects
	 *
	 * @throws \Exception
	 */
	public function register_routes() {
		register_rest_route($this->namespace, '/' . $this->rest_base. '/collection/(?P<collection_id>[\d]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array($this, 'get_items'),
					'permission_callback' => array($this, 'get_items_permissions_check'),
					'args'                => $this->get_endpoint_args_for_item_schema(\WP_REST_Server::READABLE),
				),
			)
		);
		register_rest_route($this->namespace, '/' . $this->rest_base. '/item/(?P<item_id>[\d]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array($this, 'get_item'),
					'permission_callback' => array($this, 'get_item_permissions_check'),
					'args'                => $this->get_endpoint_args_for_item_schema(\WP_REST_Server::READABLE),
				),
			)
		);
		register_rest_route($this->namespace, '/' . $this->rest_base,
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array($this, 'get_items'),
					'permission_callback' => array($this, 'get_items_permissions_check'),
					'args'                => $this->get_collection_params(),
				)
			)
		);
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function get_item( $request ) {
		/*$collection_id = $request['collection_id'];
		$field_id = $request['field_id'];

		if($request['fetch'] === 'all_field_values'){
			$results = $this->field_repository->fetch_all_field_values($collection_id, $field_id);

			return new \WP_REST_Response($results, 200);
		}

		$result = $this->field_repository->fetch($field_id, 'OBJECT');

		$prepared_item = $this->prepare_item_for_response($result, $request);
		return new \WP_REST_Response(apply_filters('tainacan-rest-response', $prepared_item, $request), 200);*/
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return bool|\WP_Error
	 * @throws \Exception
	 */
	public function get_item_permissions_check( $request ) {
		if(isset($request['collection_id'])) {
			$collection = $this->collection_repository->fetch($request['collection_id']);
			if($collection instanceof Entities\Collection) {
				if (! $collection->can_read()) {
					return false;
				}
				return true;
			}
		} elseif(isset($request['item_id'])) {
			$item = $this->items_repository->fetch($request['item_id']);
			if($item instanceof Entities\Item) {
				if (! $item->can_read()) {
					return false;
				}
				return true;
			}
		} else { // Exporting all
			$dummy = new Entities\Collection();
			return current_user_can($dummy->get_capabilities()->read); // Need to check Colletion by collection
		}
		return false;
	}

	/**
	 * @param \Tainacan\Entities\Item $item
	 * @param \WP_REST_Request $request
	 *
	 * @return array|\WP_Error|\WP_REST_Response
	 */
	public function prepare_item_for_response( $item, $request ) {
		$items_metadata = $item->get_fields();
		
		$prepared_item = [];
		
		foreach ($items_metadata as $item_metadata){
			$prepared_item[] =  $item_metadata->_toArray();
		}

		return $prepared_item;
	}
	
	/**
	 * 
	 * @param \WP_REST_Request $request
	 * @param \WP_Query|Entities\Item $query
	 * @param array $args
	 * @return \WP_Error|number
	 */
	public function export($request, $query, $args) {
		
		$type = \Tainacan\Exposers\Exposers::request_has_type($request);
		$path = wp_upload_dir();
		$path = $path['path'];
		$filename = $path.date('YmdHis').'-tainacan-export.'.$type->get_extension();
		$pid = -1;

		$log = \Tainacan\Entities\Log::create(
			__('Export Process', 'tainacan'),
			__('Exporting Data', 'tainacan').'\nArgs: '.print_r($args, true),
			['file' => $filename],
			[],
			'processing'
		);
		
		$body = json_decode( $request->get_body(), true );
		$background = ! (isset($body['export-background']) && $body['export-background'] == false);
		if( $background ) {
			$pid = pcntl_fork();
		} else {
			$pid = true;
		}
		if ($pid === -1) {
			$error = new \WP_Error('could not fork');
			$log = \Tainacan\Entities\Log::create(
				__('Export Process Error', 'tainacan'),
				__('Exporting Error', 'tainacan').'\\nArgs: '.print_r($args, true).'\\nError: could not fork',
				$error,
				[],
				'error'
			);
			remove_filter( 'rest_request_after_callbacks', [\Tainacan\Exposers\Exposers::get_instance(), 'rest_request_after_callbacks'], 10, 3 ); //exposer mapping
			remove_filter( 'tainacan-rest-response', [\Tainacan\Exposers\Exposers::get_instance(), 'rest_response'], 10, 2 ); // exposer types
			return $log;
		} elseif ($pid) { // we are the parent or run at foreground
			try {
				ignore_user_abort(true);
				set_time_limit(0);
				ini_set("memory_limit", "256M");
				
				if($background) { // wait for child to respond and exit and reconnect database if is forked
					$status = null;
					pcntl_wait($status);
					global $wpdb;
					$wpdb->db_connect();
				}
				
				$response = [];
				if(isset($request['collection_id'])) { // One Colletion
					$collection_id = $request['collection_id'];
					$items = $query;
					if ($items->have_posts()) {
						while ( $items->have_posts() ) { //TODO write line by line
							$items->the_post();
							
							$item = new Entities\Item($items->post);
							
							$prepared_item = $this->prepare_item_for_response($item, $request);
							
							array_push($response, $prepared_item);
							file_put_contents('/tmp/2', print_r($prepared_item, true), FILE_APPEND);
						}
						wp_reset_postdata();
					}
				} elseif (isset($request['item_id'])) { // One Item
					
					$item = new Entities\Item($request['item_id']);
					if($item->get_id() > 0) {
						$prepared_item = $this->prepare_item_for_response($item, $request);
						
						$response = [$prepared_item];
					}
				} else { // Export All
					
				}
				
				$rest_response = new \WP_REST_Response(apply_filters('tainacan-rest-response', $response, $request));
				//file_put_contents($filename, $rest_response->get_data());
				file_put_contents('/tmp/1', print_r($rest_response->get_data(), true));
				
				if($background) {
					$log->set_status('publish');
					$logs = \Tainacan\Repositories\Logs::get_instance();
					$logs->update($log);
					exit(1);
				} else {
					return $rest_response->get_data();
				}
			} catch (\Exception $e) {
				if($background) {
					exit(1);
				} else {
					throw $e;
				}
			}
		} else { // we are the child

			remove_filter( 'rest_request_after_callbacks', [\Tainacan\Exposers\Exposers::get_instance(), 'rest_request_after_callbacks'], 10, 3 ); //exposer mapping
			remove_filter( 'tainacan-rest-response', [\Tainacan\Exposers\Exposers::get_instance(), 'rest_response'], 10, 2 ); // exposer types
			return $log;
		}
		
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function get_items( $request ) {
		$args = $this->prepare_filters($request); // TODO default args
		$rest_response = new \WP_REST_Response([], 200); // TODO error, empty response
		
		if(isset($request['collection_id'])) { // One Colletion
			$collection_id = $request['collection_id'];
			$items = $this->items_repository->fetch($args, $collection_id, 'WP_Query');
			
			$response = $this->export($request, $items, $args);
			
			$total_items  = $items->found_posts;
			$ret = $response instanceof Entity ? $response->__toArray() : $response;
			$rest_response = new \WP_REST_Response($ret, 200);
			
			$rest_response->header('X-WP-Total', (int) $total_items);
		} elseif (isset($request['item_id'])) { // One Item
					
			$item = new Entities\Item($request['item_id']);
			if($item->get_id() > 0) {
				$response = $this->export($request, $item, $args);
				
				$total_items  = 1;
				$max_pages = 1;
				
				$rest_response = new \WP_REST_Response($response->__toArray(), 200);
				
				$rest_response->header('X-WP-Total', 1);
				$rest_response->header('X-WP-TotalPages', 1);
			}
		} else { // Export All
			
		}
		
		return $rest_response;
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return bool|\WP_Error
	 * @throws \Exception
	 */
	public function get_items_permissions_check( $request ) {
		return $this->get_item_permissions_check($request);
	}

}

?>