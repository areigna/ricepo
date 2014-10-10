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
        itemTpl: new Ext.XTemplate(
        	"<div class='container city' style=\"background-image:url('{image}')\">",
				"<div class='title'>{[this.capital(values.city)]}</div>",
			"</div>",
			{
				capital: function(city){
					var state = city.slice(-2).toUpperCase();
					return city.replace(city[0], city[0].toUpperCase()).slice(0,-3) + ' ' + state;
				}
			}
        ),
		listeners: {
			//when select restaurant
			itemtap: function(cmp, index, target, record,e){
				//if no network connection
				if(!ricepo.app.checkNetwork()){return false;}
				
	        	var home = Ext.getCmp('home');
            	ricepo.app.slideCmp(home, 'left'); 

	        	home.setCity(record.get('city'));
			},
			show: function(){
				//this.deselectAll();
			},
			initialize: function(){
				//this.getStore().load();
			},
		},
		items: [
			{
				xtype: 'titlebar',
				cls: 'r-toolbar',
				docked: 'top',
				title: 'Please Choose Your City',
				listeners: {
                    initialize: function(cmp){
                        cmp.element.on('tap', function(){
                            cmp.up('citylist').getScrollable().getScroller().scrollTo(0,0,true);
                        });
                    }
                }
			}
		],
	},
});