Ext.define('ricepo.store.Rests', {
	extend: 'Ext.data.Store',
	requires: [
		'ricepo.model.Rest',
	],

	config: {
		model: 'ricepo.model.Rest',
		storeId: 'restsStore',
		//autoLoad: true,
		sorters: {property:'score', direction: 'DESC'},
		proxy: {
			type: 'ajax',
			url: host() + '/getRestsByCity',
			extraParams: null,
			reader: {
	            type: "json",
	            rootProperty: "Items",
	        },
		},
		listeners: {
			beforeload: function(){
				if(!this.getProxy().getExtraParams()) return false;
				//if no network connection
				if(!ricepo.app.checkNetwork()){
					ricepo.app.bottomPush('Reload');
					return false;
				}
				//if connection is good, go ahead
				ricepo.app.mask();
				return true;
			},
			load: function(){
				ricepo.app.unmask();
				ricepo.app.refreshClose();
				//update last refresh time
				ricepo.app.lastRefresh = new Date().getTime();
				Ext.getCmp('home').showOhio();
			},
			updaterecord: function(){
				//refresh closed everytine rest info changes
				ricepo.app.refreshClose();
			},
		},
	},
	updateClose: function(){
		this.each(function(item){
			//set null will automatically refresh the field
			item.set('hour_closed',null);
		});
	}
});