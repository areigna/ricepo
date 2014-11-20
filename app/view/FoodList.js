Ext.define('ricepo.view.FoodList', {
    extend: 'Ext.dataview.List',
    xtype: 'foodlist',
    requires: [
        'Ext.dataview.DataView', 'Ext.Anim',
        'ricepo.store.Carts','Ext.field.Search',
    ],
    config: {
        id: 'foodlist',
        cls: 'foodlist',
        scrollable: 'vertical',
        fullscreen: true,
        pinHeaders: true,
        store: 'foodsStore',
        loadingText: false,
        borderAnim: null,

        rest: null, cartStore: null, qty: null,
        groups: null,

        useSimpleItems: true, disableSelection: true, grouped: true,
        scrollToTopOnRefresh: true, 

        pressedCls: '',
        //selectedCls: 'select',
        itemCls: 'food',
        itemTpl: new Ext.XTemplate(
            "<div class='container'>",
                '<tpl if="values.icon">', "<span class='icon'>{icon}</span>", '</tpl>',
                '<tpl if="ricepo.app.isChn()">', "{chn_name}",
                '<tpl else>', "{name}",
                '</tpl>',
                "<span class='right'>",
                    "{[values.price ? '$'+values.price.toFixed(2) : values.label]}",
                "</span>",
            "</div>",
            '<tpl if="values.info">', "<div class='info'>{info}</div>", '</tpl>'
        ),
        listeners: {
            itemtap: function(cmp, index, target, record,e){
                var dist = window.innerWidth - e.pageX;
                if(dist > 70) return;
                //add food to the cart
                cmp.getCartStore().add(record.getData());
                
                //add food to recent
                var id = ricepo.app.rest.get('rest_id');
                var foodId = record.get('food_id');
                var recentStore = Ext.getStore(id+'RecentFoodsStore');
                //prevent duplicate
                if(recentStore.find('food_id', foodId) == -1){
                    var data = record.getData();
                    recentStore.add(record.getData());
                }

                //run border animation
                Ext.Anim.run(target.element.down('.right'), cmp.getBorderAnim());

                //cart icon shake animation
                var icon = cmp.down('titlebar[docked=top]').down('[align=right]').element.down('.x-button-icon');
                icon.removeCls('shake');
                setTimeout(function(){icon.addCls('shake'); },0);
            },
            hide: function(cmp){
                //remove the cart icon shake class
                var icon = cmp.down('titlebar[docked=top]').down('[align=right]').element.down('.x-button-icon');
                icon.removeCls('shake');
            },
            initialize:function(cmp){
                //create animation
                var me = this;
                var anim = Ext.create('Ext.Anim',{
                    //from: {opacity: '0.05'},
                    //to: {opacity: '1'},
                    from: {color: 'white' , backgroundColor: 'rgba(255,138,116,0.95)', },
                    to: {color: 'rgba(255,138,116,0.95)', backgroundColor: 'transparent', },
                    duration: 1100,
                });
                cmp.setBorderAnim(anim);
            },
        },
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                cls: 'r-toolbar',
                listeners: {
                    initialize: function(cmp){
                        cmp.element.on('tap', function(){
                            cmp.up('foodlist').getScrollable().getScroller().scrollTo(0,0,true);
                        });
                    }
                },
                items: [
                    {
                        ui: 'back',
                        text: 'Home',
                        align: 'left',
                        cls: 'left',
                        listeners: {
                            release:  function(cmp, e){
                                e.stopEvent();//prevent auto scroll to top
                                ricepo.app.slideCmp(Ext.getCmp('home'), 'right');
                            },
                        }
                    },
                    {
                        iconCls: 'cart',
                        align: 'right',
                        cls: 'right',
                        listeners: {
                            release: function(cmp,e){
                                e.stopEvent();
                                if(!cmp.getDisabled()){
                                    ricepo.app.slideCmp(Ext.getCmp('cart'), 'left');
                                }
                            },
                        }
                    },
                ],
            },
        ],

    },
    //this is where everything starts
    updateRest: function(current, old){
        //here we must check if current is null in order to avoid the error occurs when initilizing tha app
        if(current){
            //display loading mask
            ricepo.app.mask(Ext.getCmp('foodlist'));
            //set the app var here
            ricepo.app.rest = current;

            var me = this;

            //set and load menu
            var store = this.getStore();
            var id = current.get('rest_id');
            store.removeAll();
            store.getProxy().setExtraParams({rest_id: id});
            store.load();

            //set cart store
            var cartStore = Ext.getStore(id+'CartsStore');
            if(!cartStore){
                cartStore = Ext.create('ricepo.store.Carts',{
                    storeId: id+'CartsStore',
                    proxy: {
                        type: 'localstorage',
                        id: id+'Cart',
                    },
                });
            }
            this.setCartStore(cartStore);
            //set quantity
            this.setQty(cartStore.getCount());
            

            //pass it to cart
            //preload the cart view's cartstore
            Ext.getCmp('cart').setStore(id+'CartsStore');
            Ext.getCmp('cart').setTotal(cartStore.getTotal());

            //turn on/off for ohio
            Ext.getCmp('address').toggleOhio();

            //whole app check close
            ricepo.app.refreshClose();

        }
    },
    updateQty: function(current, old){
        var btn = this.down('[iconCls=cart]');
        btn.setText(current);
        if(current){btn.enable(); }
        else{btn.disable(); }
    },
    checkClose: function(){
        var rest = this.getRest();
        var field = this.down('titlebar');
        if(rest){
            if(rest.get('off')){
                field.setTitle('Coming Soon');
            }
            else if(rest.get('hour_closed')){
                field.setTitle('Closed');
            }
            else if(rest.get('closed')){
                field.setTitle('Closed');
            }
            else{
                field.setTitle(ricepo.app.isChn() ? rest.get('chn_name') : rest.get('name'));
            }
        }
    },
});