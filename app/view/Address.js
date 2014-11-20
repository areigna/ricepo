Ext.define('ricepo.view.Address',{
    extend: 'Ext.form.Panel',
    xtype: 'address',
    requires: ['Ext.form.FieldSet','Ext.field.Radio', 'Ext.field.Number', 'Ext.field.Slider', 'Ext.field.Select'],
    config:{
        id: 'address',
        fullscreen: true,
        cls: 'r-form',
        scrollable: {
            direction: 'vertical',
            indicators: false,
        },

        total: 0,
        tab: null,
        ohioFee: 0,

        listeners: {
            show: function(){
                //this.setTotal(Ext.getCmp('cart').getStore().getTotal());
                //scroll to top
                this.getScrollable().getScroller().scrollTo(0,0);
                //for ohio, need a different form
                if(!this.isOhio()){
                    this.checkMin();
                    this.deliveryFee();
                    //also check close, go back to cart if necessary
                    //refresh slider
                    this.slideRefresh();
                }
                this.checkForm();
            },
            painted: function(){this.checkClose(); }
        },
        items: [
            //titlebar
            {
                xtype:'titlebar',
                cls: 'r-toolbar',
                docked: 'top',
                items: [
                    {
                        ui: 'back',
                        text: 'Cart',
                        align: 'left',
                        cls: 'left',
                        listeners: {
                            release: function(){
                                ricepo.app.slideCmp(Ext.getCmp('cart'), 'right');
                            }
                        }
                    },
                    {
                        text: 'Place Order',
                        disabled: true,
                        align: 'right',
                        cls: 'right',
                        id: 'placeorderbtn2',
                        handler: function(cmp){
                            cmp.up('address').confirm();
                        }
                    },
                ]
            },
            ///////////////////form starts here//////////////////////
            //////for ohio only///////////
            //time slot selector
            {
                xtype: 'fieldset',
                id: 'slotpanel',
                title: '',
                items: [
                    {
                        xtype: 'selectfield',
                        placeHolder: 'Choose Delivery Time',
                        autoSelect: false,
                        name: 'slot',
                        listeners: {
                            change: function(cmp, newValue){
                                cmp.up('address').down('#locationselect').changeOptions(newValue);
                                cmp.up('address').checkForm();
                            }
                        },
                        options: [
                            {text: '12:00pm',  value: '12:00'},
                            {text: '6:30pm', value: '6:30'},
                        ]
                    },
                ]
            },
            //time slot selector
            {
                xtype: 'fieldset',
                id: 'locationpanel',
                title: '',
                items: [
                    {
                        xtype: 'selectfield',
                        id: 'locationselect',
                        placeHolder: 'Choose Location',
                        autoSelect: false,
                        name: 'location',
                        listeners: {
                            change: function(cmp, newValue){
                                var address = cmp.up('address'),
                                    locationDetail = address.down('#locationdetail'),
                                    matches;
                                if(newValue && (matches = newValue.match(/(ov)|(hv)/i))){
                                    address.setOhioFee(5);
                                    locationDetail.show();
                                    locationDetail.setPlaceHolder('Address in ' + matches[0] + '?');
                                }
                                else{
                                    address.setOhioFee(newValue ? 3 : 0);
                                    locationDetail.hide();
                                }
                                address.deliveryFee();
                                address.checkForm();
                            },
                            initialize: function(cmp){
                                cmp.changeOptions();
                            },
                        },
                        options: [],
                        changeOptions: function(slot){
                            var lunch = [
                                    {text: 'Mason Hall $3', value: 'Mason Hall'},
                                    {text: '18th Ave Library $3', value: '18th Ave Library'},
                                ],
                                dinner = [
                                    {text: 'OV $5', value: 'OV'},
                                    {text: 'HV $5', value: 'HV'},
                                ];
                            if(slot == '6:30'){
                                return this.setOptions(lunch.concat(dinner));
                            }
                            this.setOptions(lunch);
                        },
                    },
                    {
                        xtype: 'textfield',
                        id: 'locationdetail',
                        hidden: true,
                        name: 'locationDetail',
                    }
                ]
            },
            ////////generic form////////////
            //payment info
            {
                xtype: 'fieldset',
                id: 'paymentpanel',
                title: '',
                defaults:{
                    xtype: 'radiofield',
                    labelWidth: '80%',
                },
                items: [
                    {label: 'Cash', checked: true, }
                ]
            },
            //delivery info
            {
                xtype: 'fieldset',
                id: 'pickuppanel',
                title: '',
                //instructions: '',
                defaults: {
                    xtype: 'radiofield',
                    labelWidth: '80%',
                    name: 'delivery',
                    listeners: {check: function(cmp){Ext.getCmp('address').setTab(cmp.getValue()); } }
                },
                items: [
                    {label: 'Delivery', id: 'deliverybtn', value: 'delivery', },
                    {label: 'Pick Up', id: 'pickupbtn', value: 'pickup', },
                ]
            },
            //text fields
            {
                xtype: 'fieldset',
                id: 'deliverypanel',
                title: '',
                instructions: 'Slide for future order time',
                defaults: {
                    xtype: 'textfield', 
                    listeners: {
                        keyup: function(){Ext.getCmp('address').checkForm(); } ,
                        clearicontap: function(){Ext.getCmp('address').checkForm(); } ,
                    }
                },
                items: [
                    {placeHolder: 'Address', name: 'address', id: 'addressfield', },
                    {placeHolder: 'Phone Number', name: 'phone', component: {type: 'tel'}},
                    {placeHolder: 'Special instructions', name: 'comments', },
                    {
                        labelAlign:'left', label: 'Now', labelWidth: '32%',name: 'delay', xtype: 'sliderfield',
                        listeners: {
                            drag: function(me, sl, thumb, value){
                                var newValue = value[0]; 
                                if(newValue == me.getMinValue()){
                                    me.setLabel('Now');
                                    me.setLabelCls('now');
                                }
                                else{
                                    var time = ricepo.app.ampm(parseInt(newValue/4), parseInt(newValue%4)*15);
                                    me.setLabel(time);
                                    me.setLabelCls('');
                                }
                            },
                            change: function(me, sl, thumb, newValue){
                                if(newValue == me.getMinValue()){
                                    me.setLabel('Now');
                                    me.setLabelCls('now');
                                }
                                else{
                                    var time = ricepo.app.ampm(parseInt(newValue/4), parseInt(newValue%4)*15);
                                    me.setLabel(time);
                                    me.setLabelCls('');
                                }
                            },
                        },
                    },
                ],
            },
            //total panel
            {
                xtype: 'fieldset',
                cls: 'totalpanel',
                id: 'totalpanel',
                title: '',
                instructions: '',
                defaults: {
                    xtype: 'textfield',
                    clearIcon: false,
                    readOnly: true,
                    labelWidth: '50%',
                },
                items: [
                    {label: 'Subtotal:',value: '$0.00', id: 'subtotalfield'},
                    {label: 'Tax:',value: '$0.00', id: 'taxfield'},
                    {label: 'Delivery Fee:',value: '$0.00', id: 'feefield'},
                    {label: 'Total',value: '$0.00', id: 'totalfield',},
                ],
            },
            {
                xtype: 'fieldset',
                id: 'placeorderpanel',
                cls: 'buttonpanel',
                title: '',
                instructions: '',
                items: [
                    {
                        xtype: 'button', text: 'Place Order', id: 'placeorderbtn',
                        cls: 'buttonfield', pressedCls: 'pressed',
                        handler: function(cmp){
                            cmp.up('address').confirm();
                        }
                    }
                ]
            }

        ],
    },
    //total is the trigger to everything
    //total -> checkmin -> update tab -> update delivery fee
    updateTotal: function(current , old){
        //will have error is current is 0
        if(current){
            if(!this.isOhio()){
                this.checkMin();
                //we have to update delivery fee, because tab might not be updated when checkmin
                this.checkForm();
            }
            this.deliveryFee();
        }
    },
    //checking the minimun total is reached
    checkMin: function(){
        var me = this;
        var min = ricepo.app.rest.get('min');
        if(this.isOhio()) return;
        if(min == -1){
            me.down('#deliverybtn').disable();
            me.down('#deliverybtn').setLabel('No Delivery');
            me.setTab('pickup');
        }
        else if(me.getTotal() < min){
            me.down('#deliverybtn').disable();
            me.down('#deliverybtn').setLabel('Delivery Min $'+ricepo.app.rest.get('min'));
            me.setTab('pickup');
        }
        else{
            me.down('#deliverybtn').enable();
            me.down('#deliverybtn').setLabel('Delivery $'+ricepo.app.rest.get('delivery_fee'));
        }
    },
    //change tab, will trigger delivery fee and check form
    updateTab: function(current, old){
        if(this.isOhio()) return;
        if(current == 'delivery'){
            //allowed
            if(this.down('#deliverybtn').isDisabled()){
                this.setTab('pickup'); return;
            }
            this.down('#deliverybtn').check();
            this.down('#addressfield').show();
            this.down('#deliverypanel').setInstructions('Slide for future delivery time');
        }
        else if(current == 'pickup'){
            this.down('#pickupbtn').check();
            this.down('#addressfield').hide();
            this.down('#deliverypanel').setInstructions('Slide for future pickup time');
        }
        else{return; }
        this.checkForm();
        this.deliveryFee();
    },
    //add/remove delivery fee in the total bar
    deliveryFee: function(){
        var me = this;
        var subtotal = me.getTotal();
        var fee = ricepo.app.rest.get('delivery_fee');
        me.down('#subtotalfield').setValue('$'+subtotal.toFixed(2));
        me.down('#taxfield').setValue('$'+(subtotal*0.08).toFixed(2));

        if(this.isOhio()){
            fee = this.getOhioFee();
            me.down('#feefield').show().setValue('$'+fee.toFixed(2));
            me.down('#totalfield').setValue('$'+(subtotal*1.08+fee).toFixed(2));
        }
        else{
            if(this.getTab() == 'delivery'){
                me.down('#feefield').show().setValue('$'+fee.toFixed(2));
                me.down('#totalfield').setValue('$'+(subtotal*1.08+fee).toFixed(2));
                //me.down('#totalfield').up('fieldset').setInstructions('Total with tax & delivery fee');
            }
            else{
                me.down('#feefield').hide();
                me.down('#totalfield').setValue('$'+(subtotal*1.08).toFixed(2));
                //me.down('#totalfield').up('fieldset').setInstructions('Total with tax');
            }
        }
    },
    //this function is called when user click confirm button
    checkForm: function(){
        var data = this.getValues();
        var fieldset = Ext.getCmp('placeorderbtn');
        //ohio case
        if(this.isOhio()){
            if(!data.slot){
                fieldset.setText('Missing Delivery Time');
                this.toggleButtons(false);
                return false;
            }
            if(!data.location){
                fieldset.setText('Missing Delivery Location');
                this.toggleButtons(false);
                return false;
            }
        }
        else{
            if(this.getTab()=='delivery' && !data.address){
                fieldset.setText('Missing Address');
                this.toggleButtons(false);
                return false;
            }
            if(!data.phone){
                fieldset.setText('Missing Phone Number');
                this.toggleButtons(false);
                return false;
            }
        }
        if(!this.validatePhone(data.phone)){
            fieldset.setText('Phone Number Invalid');
            this.toggleButtons(false);
            return false;
        }
        fieldset.setText('Place Order');
        this.toggleButtons(true);
        return true;
    },
    validatePhone: function(phone){
        var count = 0;
        for(var i = 0 ;i < phone.length ; i++){
            if(phone[i] >= '0' && phone[i] <= '9'){count ++; }
        }
        if(count >=10 && count <= 11){return true; }
        else{return false; }
    },
    //this function is called when user tap the restaurant or when user enter one order
    changeAddress: function(address, phone, comments){
        if(this.isOhio()){
            this.setValues({
                slot: localStorage.getItem('slot'),
                location: localStorage.getItem('location'),
                locationDetail: localStorage.getItem('locationDetail'),
                phone: localStorage.getItem('phone')
            })
        }
        else{
            if(address == 'pickup'){
                ;
            }
            else if(address == 'auto'){
                address = localStorage.getItem('address');
                phone = localStorage.getItem('phone');
                comments = localStorage.getItem('comments');
            }
            //apply
            this.setValues({
                phone: phone,
                comments: comments,
            });
            if(!address || address=='pickup'){this.setTab('pickup'); }
            else{
                this.setValues({
                    address: address,
                });
                this.setTab('delivery'); 
            }
        }
        this.checkForm();
    },
    toggleButtons: function(on){
        if(on){
            Ext.getCmp('placeorderbtn').enable();
            Ext.getCmp('placeorderbtn2').enable();
        }
        else{
            Ext.getCmp('placeorderbtn').disable();
            Ext.getCmp('placeorderbtn2').disable();
        }
    },
    confirm: function(){
        var me = this;
        navigator.notification.confirm('Are you sure to place order?', function(buttonIndex){
            if(buttonIndex == 2) me.placeOrder();
        }, 'Ricepo', ['No','Yes']);
    },
    placeOrder: function(){
        //check network connection first
        if(!ricepo.app.checkNetwork()){return false;}

        //if(!this.checkForm()){return; }
        this.toggleButtons(false);
        ricepo.app.mask();
        var me = this;

        //me.registerPush();

        var rest = ricepo.app.rest;
        //construct the order object
        var order = this.getValues();
        //set rest
        order.rest = rest.getData();
        //set apn and id
        order.apn = localStorage.getItem('apn');
        order.user_id = ricepo.app.id;
        //ser future order
        order.delay = this.down('sliderfield').getLabel();
        //delivery
        if(this.isOhio()){
            order.address = order.slot + ' @ ' + order.location;
            order.address2 = this.down('#locationdetail').isHidden() ? null : order.locationDetail;
            order.total = ''+me.getTotal();
        }
        else{
            if(me.getTab() == 'delivery'){
                order.total = ''+me.getTotal();// + ricepo.app.rest.get('delivery_fee')+'';
            }
            else{
                order.address = 'pickup';
                order.total = ''+me.getTotal();
            }
        }
        //items
        order.items = [];
        var storeId = rest.get('rest_id')+ 'CartsStore';
        Ext.getStore(storeId).getData().each(function(item){
            if(item.get('name')!='Total'){
                order.items.push({
                    item_id: item.get('item_id'),//prevent duplicate item in db
                    food_id: item.get('food_id'),
                    name: item.get('name'),
                    chn_name: item.get('chn_name'),
                    price: item.get('price'),
                    comments: item.get('comments'),
                });
            }
        });
        //time and status
        order.update_time = new Date().getTime();
        order.status = ricepo.app.startStatus;
        order.msg = ricepo.app.startMsg;

        //save the order info
        localStorage.setItem('phone', order.phone);
        localStorage.setItem('comments', order.comments);

        if(this.isOhio()){
            localStorage.setItem('slot', order.slot);
            localStorage.setItem('location', order.location);
            localStorage.setItem('locationDetail', order.locationDetail);
        }
        else{
            if(order.address!='pickup'){localStorage.setItem('address', order.address); }
        }

        //send
        me.sendOrder(order);

    },
    sendOrder: function(order){
        var me = this;
        Ext.Ajax.request({
            url: host() + '/addOrder',
            method: 'POST',
            params: {data: JSON.stringify(order), },
            success: function(response){
                var data = JSON.parse(response.responseText);
                if(data.order_id){
                    //save the order id
                    var orderStore = Ext.getStore('ordersStore');
                    order.order_id = data.order_id;
                    //add order to store
                    orderStore.add(order)   ;
                    //clear the cart
                    Ext.getStore(ricepo.app.rest.get('rest_id')+ 'CartsStore').removeAll();
                    //clear the restaurant //why?
                    //ricepo.app.rest = null;
                    //go to orderlist
                    ricepo.app.slideCmp(Ext.getCmp('orderlist'), 'right');
                    //register apn
                    if(!localStorage.getItem('apn')){
                        ricepo.app.registerPush();
                    }
                }
                else{
                    ricepo.app.alert('Place order failed, please try again.')
                }
            },
            failure: function(){
                ricepo.app.alert('Place order failed, please try again.')
            },
            callback: function(){
                ricepo.app.unmask();
                me.toggleButtons(true);
            }
        });
    }, 
    checkClose: function(){
        if(!this.isHidden()){
            //and by the way refresh the slider
            this.slideRefresh();
            setTimeout(function(){
                var rest = ricepo.app.rest;
                if(rest){
                    if(rest.get('off')){
                        ricepo.app.slideCmp(Ext.getCmp('cart'), 'right');
                    }
                    else if(rest.get('hour_closed')){
                        ricepo.app.slideCmp(Ext.getCmp('cart'), 'right');
                    }
                }
            }, 500);
        }
    },
    slideRefresh: function(){
        if(!ricepo.app.rest) return;
        var hour = ricepo.app.rest.get('hour' + new Date().getDay());
        if(hour == 'closed') return;
        var arr = hour.split('-')[1].split(':');
        var end = parseInt(arr[0])*4 + parseInt(parseInt(arr[1])/15);
        var start = new Date().getHours()*4 + parseInt(new Date().getMinutes()/15) + 4 ;
        var slider = this.down('sliderfield');
        //check reversed order
        if(start >= end){
            slider.disable();
            start = end - 1;
        }
        else{
            slider.enable();
        }
        slider.setMinValue(start);
        slider.setMaxValue(end);
        slider.setValue(start);
        slider.setLabel('Now');
        slider.setLabelCls('now');
    },
    //all functions about ohio
    isOhio: function(){
        return ricepo.app.city.toLowerCase() == 'columbus,oh';
    },
    toggleOhio: function(){
        if(this.isOhio()){
            this.down('#slotpanel').show();
            this.down('#locationpanel').show();
            this.down('#paymentpanel').hide();
            this.down('#pickuppanel').hide();
            this.down('sliderfield').hide();
            this.down('#addressfield').hide();
            this.down('#deliverypanel').setInstructions(null);
        }
        else{
            this.down('#slotpanel').hide();
            this.down('#locationpanel').hide();
            this.down('#paymentpanel').show();
            this.down('#pickuppanel').show();
            this.down('sliderfield').show();
            this.down('#addressfield').show();
            this.down('#deliverypanel').setInstructions('Slide for future order time');
        }
    }
});