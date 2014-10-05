Ext.define('ricepo.view.Order',{
    extend: 'Ext.form.Panel',
    xtype: 'order',
    //requires: ['ricepo.store.Carts'],
    config:{
        id: 'order',
        cls: 'r-form',
        fullscreen: true,
        scrollable: {
            direction: 'vertical',
            indicators: false,
        },

        order: null,
        listeners: {
            hide: function(cmp){cmp.getScrollable().getScroller().scrollTo(0,0); },
        },

        items: [
            {
                xtype:'titlebar',
                cls: 'r-toolbar',
                docked: 'top',
                items: [
                    {
                        ui: 'back',
                        text: 'Orders',
                        align: 'left',
                        cls: 'left',
                        listeners: {
                            release: function(){
                                ricepo.app.slideCmp(Ext.getCmp('orderlist'), 'right');
                            }
                        }
                    },
                    {
                        text: 'Call',
                        align: 'right',
                        cls: 'right',
                        listeners: {
                            release: function(cmp){
                                window.location.href='tel:'+cmp.up('order').getOrder().get('rest').phone;
                            }
                        }
                    },
                ]
            },
            {
                xtype: 'fieldset',
                cls: 'statuspanel',
                title: '',
                defaults: {
                    xtype: 'textfield',
                    clearIcon: false,
                    readOnly: true,
                },
                items:[],
            },
            {
                xtype: 'fieldset',
                cls: 'totalpanel',
                title: '',
                defaults: {
                    xtype: 'textfield',
                    clearIcon: false,
                    readOnly: true,
                    labelWidth: '70%',
                },
                items:[],
            },
            {
                xtype: 'fieldset',
                cls: 'deliverypanel',
                title: '',
                instructions: '',
                defaults: {
                    xtype: 'textfield',
                    clearIcon: false,
                    readOnly: true,
                },
                items:[
                ],
            },
            {
                xtype: 'fieldset',
                cls: 'buttonpanel',
                instructions: '',
                items:[
                    {
                        text: 'Re - Order',
                        xtype: 'button',
                        cls: ['buttonfield','good'],
                        pressedCls: 'pressed',
                        handler : function(cmp){
                            cmp.disable();
                            ricepo.app.mask();
                            cmp.up('order').reOrder(); 
                            ricepo.app.unmask();
                            cmp.enable();
                        }
                    },
                ],
            },
            {
                xtype: 'fieldset',
                cls: 'buttonpanel',
                instructions: 'You have to call restaurant to cancel the order.',
                items:[
                    {
                        text: 'Cancel Order',
                        id: 'cancelbutton',
                        xtype: 'button',
                        cls: ['buttonfield','bad'],
                        pressedCls: 'pressed',
                        handler: function(cmp){
                            cmp.up('order').getOrder().cancel();
                        }
                    }
                ],
            },
            
        ],
    },
    updateOrder: function(current, old){
        if(current){
            this.updateView(current);
        }
    },
    updateView: function(current){
        if(!current){current = this.getOrder(); }// for refresh status use
    	if(current){
            //resetaurant name
            var bar = this.down('titlebar');
            if(ricepo.app.isChn()){
                bar.setTitle(current.get('rest').chn_name);
            }
            else{
                bar.setTitle(current.get('rest').name);
            }
            //restaurant phone number

            //status
            var statuspanel = this.down('[cls=statuspanel]');
            statuspanel.removeAll();
            statuspanel.add({
                cls: current.get('status').toLowerCase(),
                value: current.get('msg') 
            });
            statuspanel.setInstructions(ricepo.app.getDate(current.get('update_time')));
            

            //food list and total
            var items = current.get('items');
            var totalpanel = this.down('[cls=totalpanel]')
            totalpanel.removeAll(true);
            for(var i =0 ;i < items.length ; i++){
                totalpanel.add({
                    label: ricepo.app.isChn() ? items[i].chn_name : items[i].name,
                    value: '$'+items[i].price.toFixed(2),
                });
            }
            totalpanel.add({
                //label: 'Total + tax '+(current.get('address') == 'pickup' ? '' : '+ deli fee'),
                label: 'Total',
                value: '$'+(current.get('total')*1.08+   (current.get('address') == 'pickup' ? 0 : current.get('rest').delivery_fee )   ).toFixed(2),
            });
            totalpanel.setInstructions('Total with tax' + (current.get('address') == 'pickup' ? '' : ' & delivery fee'));

            //delivery info
            var deliverypanel = this.down('[cls=deliverypanel]')
            deliverypanel.removeAll(true);
            deliverypanel.add({value: current.get('address')});
            deliverypanel.add({value: current.get('phone')});
            if(current.get('comments')){
                deliverypanel.add({value: current.get('comments')});
            }
            if(current.get('delay') && current.get('delay')!='Now'){
                deliverypanel.add({value: 'future order @ ' + current.get('delay')});
            }

            //
            //if(current.get('status') != ricepo.app.startStatus) this.down('#cancelbutton').disable();
            this.down('#cancelbutton').disable();

    	}
    },
    reOrder: function(){
        //if no network connection
        if(!ricepo.app.checkNetwork()){return false;}
        
        var me = this;
    	var order = this.getOrder();

        //find restaurant record
    	var id = order.get('rest').rest_id;
    	var record = Ext.getStore('restsStore').findRecord('rest_id',id)
        //set rest of whole app
    	Ext.getCmp('foodlist').setRest(record);

        //copy the food to the rest cart store
        var to = Ext.getStore(id+'CartsStore');
        to.removeAll();
        var items = order.get('items');
        for(var i =0 ;i < items.length ; i++){
            if(items[i].name!='Total'){
                items[i].item_id = null;
                to.add(items[i]);
            }
        }

        //update the address options
        var order = me.getOrder();
        Ext.getCmp('address').changeAddress(order.get('address'), order.get('phone'), order.get('comments'));

        //show address
        ricepo.app.slideCmp(Ext.getCmp('address'), 'left');
    },
});