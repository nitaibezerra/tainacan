import axios from '../../../axios/axios';
import qs from 'qs';

export const fetchFields = ({commit}, {collectionId, isRepositoryLevel, isContextEdit}) => {
    return new Promise((resolve, reject) => {
        let endpoint = '';
        if (!isRepositoryLevel)
            endpoint = '/collection/' + collectionId + '/fields/';
        else
            endpoint = '/fields/';

        endpoint += '?nopaging=1'
        if (isContextEdit)
            endpoint += '&context=edit';

        axios.tainacan.get(endpoint)
            .then((res) => {
                let fields = res.data;
                commit('setFields', fields);
                resolve(fields);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
};

export const sendField = ({commit}, {collectionId, name, fieldType, status, isRepositoryLevel, newIndex}) => {
    return new Promise((resolve, reject) => {
        let endpoint = '';
        if (!isRepositoryLevel)
            endpoint = '/collection/' + collectionId + '/fields/';
        else
            endpoint = '/fields/';
        axios.tainacan.post(endpoint + '?context=edit', {
            name: name,
            field_type: fieldType,
            status: status
        })
            .then(res => {
                let field = res.data;
                commit('setSingleField', {field: field, index: newIndex});
                resolve(res.data);
            })
            .catch(error => {
                reject(error.response);
            });
    });
};

export const updateField = ({commit}, {collectionId, fieldId, isRepositoryLevel, index, options}) => {
    return new Promise((resolve, reject) => {
        let endpoint = '';

        if (!isRepositoryLevel)
            endpoint = '/collection/' + collectionId + '/fields/' + fieldId;
        else
            endpoint = '/fields/' + fieldId;

        axios.tainacan.put(endpoint + '?context=edit', options)
            .then(res => {
                let field = res.data;
                commit('setSingleField', {field: field, index: index});
                resolve(field);
            })
            .catch(error => {
                reject({
                    error_message: error['response']['data'].error_message,
                    errors: error['response']['data'].errors
                });
            });
    });
};

export const updateFields = ({commit}, fields) => {
    commit('setFields', fields);
};

export const deleteField = ({commit}, {collectionId, fieldId, isRepositoryLevel}) => {
    let endpoint = '';
    if (!isRepositoryLevel)
        endpoint = '/collection/' + collectionId + '/fields/' + fieldId;
    else
        endpoint = '/fields/' + fieldId;

    return new Promise((resolve, reject) => {
        axios.tainacan.delete(endpoint)
            .then(res => {
                commit('deleteField', res.data);
                resolve(res.data);
            }).catch((error) => {
            console.log(error);
            reject(error);
        });

    });
};

export const updateCollectionFieldsOrder = ({ dispatch }, {collectionId, fieldsOrder}) => {
    return new Promise((resolve, reject) => {
        axios.tainacan.patch('/collections/' + collectionId, {
            fields_order: fieldsOrder
        }).then(res => {
            //dispatch('collection/setCollection', res.data, {root: true});
            resolve(res.data);
        }).catch(error => {
            reject(error.response);
        });

    });
}

export const fetchFieldTypes = ({commit}) => {
    return new Promise((resolve, reject) => {
        axios.tainacan.get('/field-types')
            .then((res) => {
                let fieldTypes = res.data;
                commit('setFieldTypes', fieldTypes);
                resolve(fieldTypes);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const updateFieldTypes = ({commit}, fieldTypes) => {
    commit('setFieldTypes', fieldTypes);
};

export const fetchFieldMappers = ({commit}) => {
    return new Promise((resolve, reject) => {
        axios.tainacan.get('/field-mappers')
            .then((res) => {
                let fieldMappers = res.data;
                commit('setFieldMappers', fieldMappers);
                resolve(fieldMappers);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const updateFieldMappers = ({commit}, fieldMappers) => {
    commit('setFieldMappers', fieldMappers);
};
