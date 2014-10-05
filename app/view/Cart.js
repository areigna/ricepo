Ext.define('ricepo.view.Cart', {
    extend: 'Ext.dataview.DataView',
    xtype: 'cart',
    requires: [
        'ricepo.store.Carts','Ext.Anim',
    ],
    config: {
        id: 'cart',
        cls: 'r-dataview',
        scrollable: {
            direction: 'vertical',
            directionLock: true,
            indicators: false,
        },
        fullscreen: true,
        useComponents: true,
        defaultType: 'cartitem',
        disableSelection: true,
        loadingText: false,

        rest: null,
        store: null,
        total: 0,
        closed: true,

        lastItem: 0,
        listeners: {
            itemtap: function(cmp, index, target, record,e){
                target.toggle();
            },
            itemtouchstart: function(cmp, index, target, record,e){
                var last = cmp.getLastItem();
                if(target != last){
                    if(last){ last.clear(); }
                    cmp.setLastItem(target);
                }
            },
            hide: function(cmp){
                //hide all delete button
                var last = cmp.getLastItem();
                if(last){ last.clear(); }
                cmp.setLastItem(0);
            }
        },
        items: [
            {
                xtype: 'titlebar',
                cls: 'r-toolbar',
                docked: 'top',
                items: [
                    {
                        ui: 'back',
                        text: 'Menu',
                        align: 'left',
                        cls: 'left',
                        listeners: {
                            release: function(cmp){
                                ricepo.app.slideCmp(Ext.getCmp('foodlist'), 'right');
                            }
                        }
                    },
                    {
                        text: 'Check Out',
                        align: 'right',
                        cls: 'right',
                        listeners: {
                            release: function(cmp){
                                if(!cmp.getDisabled()){
                                    ricepo.app.slideCmp(Ext.getCmp('address'), 'left');
                                }
                            }
                        }
                    },
                ]
            },
            {
                xtype: 'textfield',
                id: 'carttotalfield',
                cls: 'centerfield',
                readOnly: true,
                value: '$0.00'
            },
        ],
    },
    //this is where we start get the change
    updateTotal: function(current , old){
        if(!this.getClosed()){this.showTotal(); }

        if(current){Ext.getCmp('address').setTotal(current); }
    }, 
    //called when passed restaurant close check
    showTotal: function(){
        var current = this.getTotal();
        //enable/disable the check out button
        var checkout = this.down('titlebar[docked=top]').down('[align=right]');
        if(current){checkout.enable();}
        else{checkout.disable();}

        this.down('#carttotalfield').setValue('$'+current.toFixed(2));
        //local total
        //pass it to address view
        //set address store
    },
    checkClose: function(){
        var rest = ricepo.app.rest;
        var field = this.down('#carttotalfield');
        var checkout = this.down('titlebar[docked=top]').down('[align=right]');
        var msg = 'No checkout,';
        if(rest){
            if(rest.get('off')){
                this.setClosed(true);
                field.setValue(msg+' restaurant coming soon');
                field.addCls('off');
                checkout.disable();
            }
            else if(rest.get('hour_closed')){
                this.setClosed(true);
                field.setValue(msg + ' '+ricepo.app.rest.get('hour_closed'));
                field.addCls('off');
                checkout.disable();
            }
            else{
                this.setClosed(false);
                field.removeCls('off');
                this.showTotal();
            }
        }
    },
});
