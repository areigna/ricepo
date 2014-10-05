Ext.define('ricepo.model.Cart', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
        	'food_id', 'name', 'chn_name', 'price', 'comments',
        	{name: 'item_id', },
            {
                name: 'time',
                type: 'int',
                convert: function(value, record){
                    if(record.get('name').toLowerCase() == 'total'){
                        return 0;
                    }
                    return new Date().getTime();
                }
            }
        ],
        idProperty: 'item_id',
        identifier: 'uuid',
    },
});