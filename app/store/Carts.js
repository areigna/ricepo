Ext.define('ricepo.store.Carts', {
	extend: 'Ext.data.Store',
	requires: [
		'ricepo.model.Cart','Ext.data.proxy.LocalStorage','Ext.MessageBox'
	],

	config: {
		storeId: 'cartsStore',
		model: 'ricepo.model.Cart',
		sorters: {property:'time', direction: 'DESC'},
        autoLoad: true,
        autoSync: true,
		listeners: {
			beforeload: function(){ricepo.app.mask();},
			load: function(){ricepo.app.unmask();},
			addrecords: function(store, record){
				Ext.getCmp('foodlist').setQty(store.getCount());
				Ext.getCmp('cart').setTotal(store.getTotal());
				if(store.getCount() > 15){
					ricepo.app.alert('You have '+ store.getCount()+' items in cart.');
				}
			},
			removerecords: function(store, record){
				Ext.getCmp('foodlist').setQty(store.getCount());
				Ext.getCmp('cart').setTotal(store.getTotal());
			},
			clear: function(){
				Ext.getCmp('foodlist').setQty(0);
				Ext.getCmp('cart').setTotal(0);
			}
		}
	},
	getTotal: function(){
		return this.sum('price');
	},
	/*
	removeTotal: function(){
		var index ;
		while((index = this.find('name', 'Total')) >= 0){
			this.removeAt(index);
		}
	}
	*/
});