<template>
    <form 
            id="filterEditForm" 
            class="tainacan-form" 
            @submit.prevent="saveEdition(editForm)">     
        <b-field 
                :addons="false"
                :type="formErrors['name'] != undefined ? 'is-danger' : ''" 
                :message="formErrors['name'] != undefined ? formErrors['name'] : ''">
            <label class="label is-inline">
                {{ $i18n.get('label_name') }} 
                <span 
                        class="required-field-asterisk" 
                        :class="formErrors['name'] != undefined ? 'is-danger' : ''">*</span> 
                <help-button 
                        :title="$i18n.getHelperTitle('filters', 'name')" 
                        :message="$i18n.getHelperMessage('filters', 'name')"/>
            </label>
            <b-input
                    :class="{'has-content': editForm.name != undefined && editForm.name != ''}" 
                    v-model="editForm.name" 
                    name="name" 
                    @focus="clearErrors('name')"/>
        </b-field>

        <b-field
                :addons="false" 
                :type="formErrors['description'] != undefined ? 'is-danger' : ''" 
                :message="formErrors['description'] != undefined ? formErrors['description'] : ''">
            <label class="label is-inline">
                {{ $i18n.get('label_description') }} 
                <help-button 
                        :title="$i18n.getHelperTitle('filters', 'description')" 
                        :message="$i18n.getHelperMessage('filters', 'description')"/>    
            </label>
            <b-input
                    :class="{'has-content': editForm.description != undefined && editForm.description != ''}" 
                    type="textarea" 
                    name="description" 
                    v-model="editForm.description" 
                    @focus="clearErrors('description')" />
        </b-field>

        <b-field 
                :addons="false"
                :type="formErrors['status'] != undefined ? 'is-danger' : ''" 
                :message="formErrors['status'] != undefined ? formErrors['status'] : ''">
            <label class="label is-inline">
                {{ $i18n.get('label_status') }} 
                <help-button 
                        :title="$i18n.getHelperTitle('filters', 'status')" 
                        :message="$i18n.getHelperMessage('filters', 'status')"/>
            </label>
            <div class="inline-block">
                <b-radio 
                        size="is-small"
                        @focus="clearErrors('label_status')"
                        id="tainacan-select-status-publish"
                        name="status" 
                        v-model="editForm.status"
                        native-value="publish">
                    {{ $i18n.get('publish_visibility') }}
                </b-radio>
                <br>
                <b-radio
                        size="is-small" 
                        @focus="clearErrors('label_status')"
                        id="tainacan-select-status-private"
                        name="status" 
                        v-model="editForm.status"
                        native-value="private">
                    {{ $i18n.get('private_visibility') }}
                </b-radio>
            </div>
        </b-field>

        <component
                :errors="formErrors['filter_type_options']"
                v-if="(editForm.filter_type_object && editForm.filter_type_object.form_component) || editForm.edit_form == ''"
                :is="editForm.filter_type_object.form_component"
                :filter="editForm"
                v-model="editForm.filter_type_options"/>
        <div 
                v-html="editForm.edit_form" 
                v-else/>

        <div class="field is-grouped form-submit">
            <div class="control">
                <button 
                        type="button"
                        class="button is-outlined" 
                        @click.prevent="cancelEdition()" 
                        slot="trigger">{{ $i18n.get('cancel') }}</button>
            </div>
            <div class="control">
                <button 
                        class="button is-success" 
                        type="submit">{{ $i18n.get('save') }}</button>
            </div>
        </div>
        <p class="help is-danger">{{ formErrorMessage }}</p>
    </form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'FilterEditionForm',
    data(){
        return {
            editForm: {},
            oldForm: {},
            formErrors: {},
            formErrorMessage: '',
            closedByForm: false
        }
    }, 
    props: {
        index: '',
        editedFilter: Object,
        originalFilter: Object,
    },
    created() {

        this.editForm = this.editedFilter;
        this.formErrors = this.editForm.formErrors != undefined ? this.editForm.formErrors : {};
        this.formErrorMessage = this.editForm.formErrors != undefined ? this.editForm.formErrorMessage : ''; 

        this.oldForm = JSON.parse(JSON.stringify(this.originalFilter));
    },
    beforeDestroy() {
        if (this.closedByForm) {
            this.editedFilter.saved = true;
        } else {
            this.oldForm.saved = this.editForm.saved;
            if (JSON.stringify(this.editForm) != JSON.stringify(this.oldForm)) 
                this.editedFilter.saved = false;
            else    
                this.editedFilter.saved = true;
        }
    },
    methods: {
        ...mapActions('filter', [
            'updateFilter'
        ]),
        saveEdition(filter) {

            if ((filter.filter_type_object && filter.filter_type_object.form_component) || filter.edit_form == '') {
                
                this.updateFilter({ filterId: filter.id, index: this.index, options: this.editForm})
                    .then(() => {
                        this.editForm = {};
                        this.formErrors = {};
                        this.formErrorMessage = '';
                        this.closedByForm = true;
                        this.$emit('onEditionFinished');
                    })
                    .catch((errors) => {
                        for (let error of errors.errors) {     
                            for (let attribute of Object.keys(error))
                                this.formErrors[attribute] = error[attribute];
                        }
                        this.formErrorMessage = errors.error_message;
                        this.$emit('onErrorFound');

                        this.editForm.formErrors = this.formErrors;
                        this.editForm.formErrorMessage = this.formErrorMessage;
                    });
            } else {
                let formElement = document.getElementById('filterEditForm');
                let formData = new FormData(formElement); 
                let formObj = {}

                for (let [key, value] of formData.entries())  
                    formObj[key] = value;
                
                this.updateFilter({ filterId: filter.id, index: this.index, options: formObj})
                    .then(() => {
                        this.editForm = {};
                        this.formErrors = {};
                        this.formErrorMessage = '';
                        this.closedByForm = true;
                        this.$emit('onEditionFinished');
                    })
                    .catch((errors) => {
                        for (let error of errors.errors) {     
                            for (let attribute of Object.keys(error))
                                this.formErrors[attribute] = error[attribute];
                        }
                        this.formErrorMessage = errors.error_message;
                        this.$emit('onErrorFound');

                        this.editForm.formErrors = this.formErrors;
                        this.editForm.formErrorMessage = this.formErrorMessage;
                    });
            }           
        },
        clearErrors(attribute) {
            this.formErrors[attribute] = undefined;
        },
        cancelEdition() {
            this.closedByForm = true;
            this.$emit('onEditionCanceled');
        },
    }
}
</script>

<style lang="scss" scoped>

    @import "../../scss/_variables.scss";
 
    form {
        padding: 1.0em 2.0em;
        border-top: 1px solid $draggable-border-color;
        border-bottom: 1px solid $draggable-border-color;
        margin-top: 1.0em;
    }

</style>


