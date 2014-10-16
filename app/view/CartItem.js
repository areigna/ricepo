Ext.define('ricepo.view.CartItem',{
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'cartitem',
	requires: ['Ext.Anim'],
	config:{
		xtype: 'container', 
        layout: 'hbox',
        cls:'cartitem',
	    items: [
	     	{
	     		xtype:'container',
				width: '85%',
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
	     		width: '15%',
	     		cls: 'deletePanel',
	     		items: [{
	     			xtype: 'button',
	     			iconCls: 'delete',
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