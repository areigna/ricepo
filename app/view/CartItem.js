Ext.define('ricepo.view.CartItem',{
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'cartitem',
	requires: ['Ext.Anim'],
	config:{
		xtype: 'container', 
        layout: 'hbox',
        cls:'cartitem',
	    scrollable: {
	     	direction: 'horizontal',
	     	directionLock: true,
	     	indicators: false,
	     	slotSnapSize: 100,
	     	momentumEasing: {
 			    momentum: {
 			        acceleration: 0, friction:1
 			    },
 			    bounce: {
 			        acceleration: 0.0001, springTension: 0.9999
 			    }
 			},
	     	outOfBoundRestrictFactor: 0,
	     	initialOffset: 0,
	    },
	    items: [
	     	{
	     		xtype:'container',
				width: window.innerWidth,
		        tpl: new Ext.XTemplate(
		            "<div class='container'>",
		        		"<div class='food'>",
			                '<tpl if="ricepo.app.isChn()">', "{chn_name}",
			                '<tpl else>', "{name}",
			                '</tpl>',
			        		"<span>${[values.price.toFixed(2)]}</span>",
		        		"</div>",
		            "</div>"
		        ),
	     	},
	     	{
	     		xtype:'container',
	     		width: '100px',
	     		cls: 'deletePanel',
	     		items: [{
	     			xtype: 'button',
	     			text: 'Delete',
	     			//iconCls: 'trash',
	     			height: '100%',
	     			listeners: {
		     			release:function(cmp,e){
		     				e.stopPropagation();
			                var animation = Ext.create('Ext.Anim',{
			                    from: {height: '51px', opacity:'1'},
			                    to: {height: '0px', opacity:'0.2'},
			                    duration: 150,
			                    after: function(){
				     				var record = cmp.up('cartitem').getRecord();
			    					var store = Ext.getCmp('cart').getStore();
			    					store.remove(record);
			    					if(!store.getCount()){
			    						ricepo.app.slideCmp(Ext.getCmp('foodlist'), 'right');
			    					}
			                    },
			                });
		     				var ele = cmp.up('cartitem').element;
		     				Ext.Anim.run(ele, animation);
		     			}
	     			}
	     		}],
	     	},
	     ],
	},
	updateRecord: function(current, old){
		this.callParent(arguments);
	},
	toggle: function(){
    	this.getScrollable().getScroller().scrollTo(5,0, {type: 'slide'});
	},
	clear: function(){
    	this.getScrollable().getScroller().scrollTo(0,0, {type: 'slide'});
	}
});