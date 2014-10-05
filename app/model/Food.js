Ext.define('ricepo.model.Food', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'food_id','name','chn_name', 'click', 
            'available', 'price', 'info', 'icon',
            'category', 
            {
                name: 'label',
                type: 'string',
                convert: function(value, record){
                    if(value) return value;
                    else if(!record.get('price')) return 'FREE';
                    else return null;
                }
            },
            {
                name: 'score',
                type: 'string',
                convert: function(value, record){
                    if(record.get('category').toLowerCase().indexOf('最近') > -1) return '0';
                    else if(record.get('category').toLowerCase().indexOf('热门') > -1) return '1';
                    else return record.get('category');
                }
            }
        ],
    },
});