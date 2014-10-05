Ext.define('ricepo.model.RecentFood', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'recent_id',
            'food_id',
            {
                name: 'time',
                type: 'int',
                convert: function(){
                    return new Date().getTime();
                }
            }
        ],
        idProperty: 'recent_id',
        identifier: 'uuid',
    },
});