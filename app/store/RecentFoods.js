Ext.define('ricepo.store.RecentFoods', {
	extend: 'Ext.data.Store',
	requires: [
		'ricepo.model.RecentFood','Ext.data.proxy.LocalStorage',
	],

	config: {
		model: 'ricepo.model.RecentFood',
		sorters: {property:'time', direction: 'DESC'},
		storeId: 'recentFoodsStore',
        autoLoad: true,
        autoSync: true,
		listeners: {
			addrecords: function(store, records){
				//delete until less than 3 items
				var count ;
				while( (count = store.getCount()) > 5){
					store.removeAt(count -1);
				}
			},
		}
	},
});