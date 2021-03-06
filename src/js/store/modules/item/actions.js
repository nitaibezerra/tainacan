import axios from '../../../axios/axios';

// Actions related to Item's field
export const sendField = ( { commit }, { item_id, field_id, values }) => {
   return new Promise( (resolve, reject) => {
        axios.tainacan.post('/item/'+item_id+'/metadata/'+field_id, {
            values: values
        })
        .then( res => {
            commit('setSingleMetadata', { item_id: item_id, field_id: field_id, values: values });
            resolve( res.data );
        })
        .catch(error => {
            reject( error);
        });
   });
};


export const updateMetadata = ({ commit }, { item_id, field_id, values }) => {
    return new Promise((resolve, reject) => {
        axios.tainacan.patch(`/item/${item_id}/metadata/${field_id}`, {
            values: values,
        })
            .then( res => {
                let field = res.data;
                commit('setSingleField', field);
                resolve(field)
            })
            .catch( error => {
                reject(error.response.data.errors);
            })
    });
};

export const fetchFields = ({ commit }, item_id) => {
    commit('cleanFields');
    return new Promise((resolve, reject) => {
        axios.tainacan.get('/item/'+item_id+'/metadata')
        .then(res => {
            let fields = res.data;
            commit('setFields', fields);
            resolve( fields );
        })
        .catch(error => {
            reject( error );
        });
    });
};

export const cleanFields = ({ commit }) => {
    commit('cleanFields');
};

// Actions directly related to Item
export const fetchItem = ({ commit }, item_id) => {
    commit('cleanItem')
    return new Promise((resolve, reject) => {
        axios.tainacan.get('/items/'+item_id)
        .then(res => {
            let item = res.data;
            commit('setItem', item);
            resolve( res.data );
        })
        .catch(error => {
            reject( error );
        });
    });
};

export const fetchItemTitle = ({ commit }, id) => {
    commit('cleanItemTitle');
    return new Promise((resolve, reject) =>{ 
        axios.tainacan.get('/items/' + id + '?fetch_only=title')
        .then(res => {
            let itemTitle = res.data;
            commit('setItemTitle', itemTitle.title);
            resolve( itemTitle.title );
        })
        .catch(error => {
            reject(error);
        })
    });
}

export const sendItem = ( { commit }, { collection_id, status }) => {
    return new Promise(( resolve, reject ) => {
        axios.tainacan.post('/collection/'+ collection_id + '/items/', {
            status: status
        })
            .then( res => {
                commit('setItem', res.data);
                resolve( res.data );
            })
            .catch(error => {
                reject({ error_message: error['response']['data'].error_message, errors: error['response']['data'].errors });
            });
    });
};
 
export const updateItem = ({ commit }, { item_id, status }) => {

    return new Promise((resolve, reject) => {
        axios.tainacan.patch('/items/' + item_id, {
            status: status 
        }).then( res => {
            commit('setItem', res.data);
            resolve( res.data );
        }).catch( error => { 
            reject({ error_message: error['response']['data'].error_message, errors: error['response']['data'].errors });
        });

    }); 
};

export const updateItemDocument = ({ commit }, { item_id, document, document_type }) => {
    return new Promise((resolve, reject) => {
        axios.tainacan.patch('/items/' + item_id, {
            document: document,
            document_type: document_type
        }).then( res => {
            let item = res.data;

            commit('setItem', item);
            resolve( res.data );
        }).catch( error => { 
            reject({ error_message: error['response']['data'].error_message, errors: error['response']['data'].errors });
        });

    }); 
};

// Attachments =======================================
export const sendAttachment = ( { commit }, { item_id, file }) => {
    commit('cleanAttachment');
    return new Promise(( resolve, reject ) => {
        axios.wp.post('/media/?post=' + item_id, file, {
            headers: { 'Content-Disposition': 'attachment; filename=' + file.name },
        })
            .then( res => {
                let attachment = res.data;
                commit('setSingleAttachment', attachment);
                resolve( attachment );
            })
            .catch(error => {
                reject( error.response );
            });
    });
};

export const fetchAttachments = ({ commit }, item_id) => {
    commit('cleanAttachments');
    return new Promise((resolve, reject) => {
        axios.wp.get('/media/?parent=' + item_id + '&per_page=100&paged=1')
        .then(res => {
            let attachments = res.data;
            commit('setAttachments', attachments);
            resolve( attachments );
        })
        .catch(error => {
            reject( error );
        });
    });
};

 
export const updateThumbnail = ({ commit }, { itemId, thumbnailId }) => {
    return new Promise((resolve, reject) => {
        axios.tainacan.patch('/items/' + itemId, {
            _thumbnail_id: thumbnailId
        }).then( res => {
            let item = res.data
            commit('setItem', item);
            resolve( item );
        }).catch( error => { 
            reject({ error_message: error['response']['data'].error_message, errors: error['response']['data'].errors });
        });

    }); 
};