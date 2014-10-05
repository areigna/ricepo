Ext.define('ricepo.view.OrderList', {
	extend: 'Ext.dataview.List',
	xtype: 'orderlist',
	requires: [
	],
	config: {
		id: 'orderlist',
		cls: 'orderlist',
		fullscreen: true,
		scrollable: 'vertical',
		store: 'ordersStore',
        loadingText: false,
		itemCls: 'order',
        itemTpl: new Ext.XTemplate(
			"<div class='container {status}'>",
				"<div class='food'>",
					"{[ricepo.app.isChn() ? values.rest.chn_name : values.rest.name]}",
					"<span class='","{[values.status.toLowerCase()]}","'>",
						"{status}",
					"</span>",
				"</div>",
				//"<div class='food'>{food}<span class='{status}'></span></div>",
				"<div class='date'>",
					"{[ this.getFood(values.items) ]}",
					"<span>",
						"{[ this.getDate(values.update_time)]}",
					"</span>",
				"</div>",
			"</div>" ,
			{
				getFood: function(items){
					var str = items[0].chn_name;
					if(items.length == 1){
						return str;
					}
					else if(items.length == 2){
						return str + ',' + items[1].chn_name;
					}
					else{
						return str + ',' + items[1].chn_name + '...';
					}
				},
				getDate: function(time){
					return ricepo.app.getDate(time);
				},
				fix2: function(num){
					return num.toFixed(2);
				},
			}
        ),
		listeners: {
			itemtap: function(cmp, index, target, record,e){
				var order = Ext.getCmp('order');
				if(!order){order = Ext.create('ricepo.view.Order',{order: record, }); }
				else{order.setOrder(record); }

        		ricepo.app.slideCmp(order, 'left');
				//update the store here
	    		//order.getStore().removeAll();
	    		//order.getStore().add(record.get('items'));
			},
			hide: function(){
				this.deselectAll();
			},
			//refresh the enable/disable of delete all button
			initialize: function(){
				ricepo.app.refreshOrder();
			},
		},

		items: [
			{
				xtype: 'titlebar',
				cls: 'r-toolbar',
				docked: 'top',
				title: 'Orders',
				listeners: {
                    initialize: function(cmp){
                        cmp.element.on('tap', function(){
                            cmp.up('orderlist').getScrollable().getScroller().scrollTo(0,0,true);
                        });
                    }
                },
				items: [
					{
			            text: 'Home',
			            ui: 'back',
			            align: 'left',
			            cls: 'left',
			            listeners: {
				            release:  function(){
				            	ricepo.app.slideCmp(Ext.getCmp('home'), 'right');
				            },
			            }
					},
					{
						text: 'Delete All',
			            align: 'right',
			            cls: 'right',
			            listeners: {
				            release:  function(cmp, e){
				            	e.stopEvent();
				            	if(!cmp.getDisabled()){
					            	navigator.notification.confirm('Are you sure to delete all past orders?', function(buttonIndex){
							            if(buttonIndex == 2) Ext.getStore('ordersStore').deleteHistory();
							        }, 'Ricepo', ['No','Yes']);
				            	}
				            },
			            }
					},
				],
			},
		],
	},
});
