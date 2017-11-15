<?php

namespace Tainacan\Field_Types;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class TainacanFieldType
 */
abstract class Field_Type  {

    var $primitive_type;

    abstract function render( $metadata );
    
    function validate($value) {
        return true;
    }
    
    function get_validation_errors() {
        return [];
    }

    function get_primitive_type(){
        return $this->primitive_type;
    }
}