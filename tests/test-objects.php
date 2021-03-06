<?php

namespace Tainacan\Tests;
use Tainacan\Repositories\Repository;
/**
 * Class TestCollections
 *
 * @package Test_Tainacan
 */

/**
 * Sample test case.
 * @group architecture
 */
class Objects extends TAINACAN_UnitTestCase {
	function test_object_transformation() {
		$x = $this->tainacan_entity_factory->create_entity(
			'collection',
			array(
				'name'          => 'testeT',
				'description'   => 'adasdasdsa',
				'default_order' => 'DESC'
			),
			true
		);
		$test = get_post($x->get_id());
		$entity = Repository::get_entity_by_post($test);
		$this->assertEquals($x->get_db_identifier(), $entity->get_db_identifier());
		
		$collection = $this->tainacan_entity_factory->create_entity(
				'collection',
				array(
					'name'   => 'teste',
					'status' => 'publish'
				),
				true
				);
		
		$collection2 = $this->tainacan_entity_factory->create_entity(
				'collection',
				array(
					'name'   => 'teste2',
					'status' => 'publish'
				),
				true
				);
		
		$field = $this->tainacan_entity_factory->create_entity(
				'field',
				array(
					'name'   => 'metadado',
					'status' => 'publish',
					'collection' => $collection,
					'field_type'  => 'Tainacan\Field_Types\Text',
				),
				true
				);
		
		$field2 = $this->tainacan_entity_factory->create_entity(
				'field',
				array(
					'name'   => 'metadado2',
					'status' => 'publish',
					'collection' => $collection,
					'field_type'  => 'Tainacan\Field_Types\Text',
				),
				true
				);
		
		$field3 = $this->tainacan_entity_factory->create_entity(
				'field',
				array(
					'name'              => 'metadado3',
					'status'            => 'publish',
					'collection'        => $collection,
					'field_type'  => 'Tainacan\Field_Types\Text',
				),
				true
				);
		
		$Tainacan_Items = \Tainacan\Repositories\Items::get_instance();
		
		$i = $this->tainacan_entity_factory->create_entity(
				'item',
				array(
					'title'      => 'orange',
					'collection' => $collection,
				),
				true
				);
		
        $this->tainacan_item_metadata_factory->create_item_metadata($i, $field, 'value_1');
        
        $test = get_post($i->get_id());
		$entity = Repository::get_entity_by_post($test);
		$this->assertEquals($i->get_db_identifier(), $entity->get_db_identifier());
		
		$test = get_post($field->get_id());
		$entity = Repository::get_entity_by_post($test);
		$this->assertEquals($field->get_db_identifier(), $entity->get_db_identifier());
		
		$test = get_post($field2->get_id());
		$entity = Repository::get_entity_by_post($test);
		$this->assertEquals($field2->get_db_identifier(), $entity->get_db_identifier());
		
		$fields = $i->get_fields();
		$item_metadata = array_pop($fields);
		$test = get_post($item_metadata->get_field()->get_id());
		$entity = Repository::get_entity_by_post($test);
		$this->assertEquals($item_metadata->get_field()->get_db_identifier(), $entity->get_db_identifier());
	}
    
    function test_delete_attributes() {
        
        $collection = $this->tainacan_entity_factory->create_entity(
				'collection',
				array(
					'name'   => 'test title',
                    'description' => 'test description',
					'status' => 'draft'
				),
				true
				);
                
        $collection->set_name('');
        $this->assertEquals('', $collection->get_name());
        
        $Tainacan_Collections = \Tainacan\Repositories\Collections::get_instance();
        $this->assertTrue($collection->validate());
        $newCol = $Tainacan_Collections->insert($collection);
        $this->assertEquals('', $newCol->get_name());
        
        
	}
	
	function test_fetch_one() {


		$collection = $this->tainacan_entity_factory->create_entity(
			'collection',
			array(
				'name'   => 'teste',
				'status' => 'publish'
			),
			true
			);

		$collection2 = $this->tainacan_entity_factory->create_entity(
			'collection',
			array(
				'name'   => 'teste2',
				'status' => 'publish'
			),
			true
			);

		$collection3 = $this->tainacan_entity_factory->create_entity(
			'collection',
			array(
				'name'   => 'teste3',
				'status' => 'publish'
			),
			true
			);


		
		$Tainacan_Collections = \Tainacan\Repositories\Collections::get_instance();

		$one = $Tainacan_Collections->fetch_one(['name' => 'teste2']);

		$this->assertTrue( $one instanceof \Tainacan\Entities\Collection );
		$this->assertEquals( 'teste2', $one->get_name() );

	}
}
