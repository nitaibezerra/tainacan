<template>
        <div class="primary-page page-container">
            <tainacan-title />
            <fields-list/>    
        </div>
</template>

<script>
import FieldsList from '../../components/lists/fields-list.vue';

export default {
    name: 'FieldsPage',
    data(){
        return {
        }
    },
    components: {
        FieldsList
    }
}
</script>

<style scoped>

</style>


