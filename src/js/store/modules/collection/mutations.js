import Vue from 'vue';

export const setItems = ( state, items ) => {
    state.items = items;
}
export const setItemsListTemplate = ( state, items ) => {
    state.itemsListTemplate = items;
}

export const cleanItems = (state) => {
    state.items = [];
}

export const deleteItem = ( state, item ) => {
    let index = state.items.findIndex(deletedItem => deletedItem.id === item.id);
    if (index >= 0) {
        state.items.splice(index, 1);
    }
}

export const deleteCollection = ( state, collection ) => {
    let index = state.collections.findIndex(deletedCollection => deletedCollection.id === collection.id);
    if (index >= 0) {
        state.collections.splice(index, 1);
    }
}

export const setCollections = (state, collections) => {
    state.collections = collections;
}

export const cleanCollections = (state) => {
    state.collections = [];
}

export const setCollection = (state, collection) => {
    state.collection = collection;
}

export const cleanCollection = (state) => {
    state.collection = [];
}

export const setCollectionName = (state, collectionName) => {
    state.collectionName = collectionName;
}

export const cleanCollectionName = (state) => {
    state.collectionName = '';
}

export const setSingleAttachment = ( state, attachment ) => {
    let index = state.attachments.findIndex(newAttachment => newAttachment.id === attachment.id);
    if ( index >= 0){
        //state.field[index] = field;
        Vue.set( state.attachments, index, attachment );
    } else {
        state.attachments.push( attachment );
    }
}

export const setAttachments = ( state, attachments ) => {
    state.attachments = attachments;
}

export const cleanAttachments = (state) => {
    state.attachments = [];
}