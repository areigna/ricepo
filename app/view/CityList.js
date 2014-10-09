Ext.define('ricepo.view.CityList', {
	extend: 'Ext.dataview.DataView',
	xtype: 'citylist',
	requires: [
		'Ext.TitleBar', 'ricepo.view.Home'
	],
	config: {
		id: 'citylist',
		cls: 'r-dataview',
		//pressedCls: 'pressed',
		//selectedCls: 'pressed',
		fullscreen: true,
		scrollable: {
			direction: 'vertical',
			indicators: false,
			//initialOffset:{x:0, y: 50},
			//slotSnapSize: 50,
		},
		store: 'citiesStore',
		loadingText: false,
		itemCls: 'city',
        itemTpl: new Ext.XTemplate(
			"<div class='container ",
				"<div class='title'>",
					"{city}",
				"</div>",
            "</div>",
            {
            	disableFormats: true,
		    }
        ),
		listeners: {
			//when select restaurant
			itemtap: function(cmp, index, target, record,e){
				//if no network connection
				if(!ricepo.app.checkNetwork()){return false;}
				
	        	var home = Ext.getCmp('home');
            	Ext.Viewport.animateActiveItem(home, {type: 'reveal', direction: 'down'}); 

	        	home.setCity(record.get('city'));
			},
			show: function(){
				//this.deselectAll();
			},
			initialize: function(){
				this.getStore().load();
			},
		},
		items: [
			{
				xtype: 'titlebar',
				cls: ['r-toolbar','ricepo'],
				docked: 'top',
				title: 'Please Select Your City',
				listeners: {
                    initialize: function(cmp){
                        cmp.element.on('tap', function(){
                            cmp.up('citylist').getScrollable().getScroller().scrollTo(0,0,true);
                        });
                    }
                }
			},
		],
	},
});