Ext.define('ricepo.store.Cities', {
	extend: 'Ext.data.Store',
	requires: [
		'ricepo.model.City',
	],

	config: {
		model: 'ricepo.model.City',
		storeId: 'citiesStore',
		data : [
			{city: "Rochester,NY", country: "us", image: 'resources/images/3.jpg'},
			{city: "Bloomington,IN", country: "us", image: 'resources/images/5.jpg'},
		]
		//autoLoad: true,
		//commented out the ajax city loading
		/*
		proxy: {
			type: 'ajax',
			url: host() + '/getCitiesByCountry',
			extraParams: {country: 'us', },
			reader: {
				type: "json",
				rootProperty: "Items",
			},
		},
		listeners: {
			beforeload: function(){
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
				//update last refresh time
				ricepo.app.lastCityRefresh = new Date().getTime();
			},
			updaterecord: function(){
				;
			},
		}
		*/
	}
});