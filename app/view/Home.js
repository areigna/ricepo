Ext.define('ricepo.view.Home', {
	extend: 'Ext.dataview.DataView',
	xtype: 'home',
	requires: [
		'Ext.Anim','Ext.TitleBar', 'ricepo.view.Settings'
	],
	config: {
		id: 'home',
		cls: 'r-dataview',
		pressedCls: 'pressed',
		selectedCls: 'pressed',
		fullscreen: true,
		scrollable: {
			direction: 'vertical',
			indicators: false,
			//initialOffset:{x:0, y: 50},
			//slotSnapSize: 50,
		},
		orderCount: 0,
		city: null,
		store: 'restsStore',
		loadingText: false,
		itemCls: 'rest',
        itemTpl: new Ext.XTemplate(
			"<div class='container ",
			"{[ values.off ? 'off' : ((values.closed || values.hour_closed)? 'closed' : '')]}",
			"' style=\"background-image:url('{image}')\">",
				"<div class='title'>",
					"<tpl if='ricepo.app.isChn()'>", "{chn_name}",
					"<tpl else>", "{name}",
					"</tpl>",
				"</div>",
				"<div class='popular'>",
					'<tpl if="values.off">',
						"Coming soon",
					'<tpl elseif="values.hour_closed">',
						"{hour_closed}",
					"<tpl else>", 
						"{chn_popular}",
					'</tpl>',
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
				
	        	var foodlist = Ext.getCmp('foodlist');
            	ricepo.app.slideCmp(foodlist, 'left');

	        	foodlist.setRest(record);//set rest for foodlist
            	
            	//update address infro from localstorage
	        	Ext.getCmp('address').changeAddress('auto');
			},
			show: function(){
				this.deselectAll();
				this.showOhio();
			},
			initialize: function(){
				ricepo.app.refreshOrder();
			},
		},
		items: [
			{
				xtype: 'titlebar',
				cls: ['r-toolbar','ricepo'],
				docked: 'top',
				title: null,
				listeners: {
                    initialize: function(cmp){
                        cmp.element.on('tap', function(){
                            cmp.up('home').getScrollable().getScroller().scrollTo(0,0,true);
                            Ext.getStore('restsStore').updateClose();
                        });
                    }
                },
				items: [
					{
			            text: 'City',
			            align: 'left',
			            cls: 'left',
			            listeners: {
				            release: function(cmp,e){
				            	e.stopEvent();
				            	var city = Ext.getCmp('citylist') || Ext.create('ricepo.view.CityList');
				            	ricepo.app.slideCmp(city, 'right');
				            },
			            }
					},
					{
						text: 'Orders',
			            align: 'right',
			            cls: 'right',
			            listeners: {
				            release:  function(cmp, e){
				            	e.stopEvent();
				            	var orderList = Ext.getCmp('orderlist');
				            	ricepo.app.slideCmp(orderList, 'left');
				            },
			            }
					},
				],
			},
		],
	},
	updateCity: function(current, old){
		if(current){
			//load the new rest list
			var store = this.getStore();
			store.removeAll();
			store.getProxy().setExtraParams({city: current.toLowerCase()});;
			store.load();
			//change title
			var capital = current.split(',')[0].toUpperCase();
			this.down('titlebar').setTitle(capital);
			//global change
			ricepo.app.city = current;
			//localstorage
			localStorage.setItem("city", current);
		}
	},
	updateOrderCount: function(current){
		var text = 'Orders';
		if(current){
			text += ' ('+current+')';
		}
		this.down('titlebar').down('[align=right]').setText(text);
	},
	showOhio: function(){
		if(!/columbus/i.test(this.getCity()) || localStorage.getItem('OhioSeen')) return;
		localStorage.setItem('OhioSeen', true);
		Ext.Viewport.add({
      xtype: 'panel',
      modal: true,
      hideOnMaskTap: true,
      showAnimation: {type: 'fadeIn', duration: 250, easing: 'ease-out'},
      hideAnimation: {type: 'fadeOut', duration: 250, easing: 'ease-out'},
      centered: true, width: '80%', height: '60%',
      styleHtmlContent: true,
      scrollable: true,
      html: '<p>亲！感谢您使用Ricepo</p>' + 
						'<p>第一次下单的客户免配送费哟！</p>' +
						'<ul>' +
						'<li>中午配送时间为12点到下午1点</li>' +
						'<li>中午请在上午11点之前下单</li>' +
						'<li>中午现已开放Mason和SEL取餐点！</li>' +
						'<li>晚上配送时间为下午6点半到7点半</li>' +
						'<li>晚上请在下午5点半之前下单</li>' +
						'<li>晚餐时段UV和OV可以送货上门哟！</li>' +
						'<li>配送费用统一$3/订单</li>' +
						'</ul>' +
						'<p>赶紧开始订餐吧！</p>',
      //items: [{docked: 'top', xtype: 'toolbar', title: 'Overlay Title'} ],
    });	
	}
});