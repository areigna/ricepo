Ext.define('ricepo.store.Orders', {
	extend: 'Ext.data.Store',
	requires: [
		'ricepo.model.Order','Ext.data.proxy.LocalStorage',
	],

	config: {
		model: 'ricepo.model.Order',
		storeId: 'ordersStore',
        autoLoad: true,
        autoSync: true,
		sorters: {property:'update_time', direction: 'DESC'},
		proxy: {
			type: 'localstorage',
            id  : 'order',
		},
		listeners: {
			//beforeload: function(){ricepo.app.mask();},
			//load: function(){ricepo.app.unmask();},
			addrecords: function(store, record){
				ricepo.app.refreshOrder();
			},
			removerecords: function(store, record){
				ricepo.app.refreshOrder();
			},
			updaterecord: function(store, record){
				ricepo.app.refreshOrder();
				
			},
			clear: function(){
				ricepo.app.refreshOrder();
			}
		}
	},
	//update all active orders
	refresh: function(){
		//if no network connection
		if(!ricepo.app.checkNetwork()){return false;}

		this.each(function(item,index){
			//update only when order is not done
			if(!item.get('done')) item.update();
		});
	},
	getActiveCount: function(){
		var total = 0;
		this.each(function(item,index){
			if(!item.get('done')){
				total ++;
			}
		});
		return total;
	},
	getInactiveCount: function(){
		var total = 0;
		this.each(function(item,index){
			if(item.get('done')){
				total ++;
			}
		});
		return total;
	},
	deleteHistory: function(){
		var me = this;
		me.each(function(item,index){
			if(item.get('done')){
				me.remove(item);
			}
		});
	},
});