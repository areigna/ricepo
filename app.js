/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/
//function host(){ return 'http://ec2-174-129-160-38.compute-1.amazonaws.com:8080'; } //prod
function host(){ return 'http://ec2-54-197-197-221.compute-1.amazonaws.com:8080'; } //dev
//function host(){ return 'http://localhost:8080'; }

Ext.application({
    name: 'ricepo',

    //custom application variables
    //host: 'http://192.168.0.5:8080',
    lang: 'ch',
    startStatus: 'Processing',
    startMsg: 'Contacting restaurant',
    rest: null,
    city: null,

    lastRefresh: 0,
    lastCityRefresh: 0,
    lastResume: 0,

    isChn: function(){
        return this.lang == 'ch';
    },
    mask: function(target){
        if(!target) target = Ext.Viewport;
        target.setMasked({
            xtype: 'loadmask',
            message: null ,
        });
    },
    unmask: function(target){
        if(!target) target = Ext.Viewport;
        target.unmask();
    },
    getDay: function(day){
        switch(day){
            case 1: return 'Monday';
            case 2: return 'Tuesday';
            case 3: return 'Wednesday';
            case 4: return 'Thursday';
            case 5: return 'Friday';
            case 6: return 'Saturday';
            case 0: return 'Sunday';
            default: return null;
        }
    },
    getDate: function(time){
        var then = new Date(time);
        var diff = new Date().getTime() - time;
        //less than 20 hours
        if(diff < 15*3600*1000){
            return (then.getHours()+11)%12+1 + ':' + 
                ('0'+then.getMinutes()).slice(-2) + ' ' + 
                (then.getHours()>=12 ? 'PM' : 'AM');
        }
        else if(diff < 6*24*3600*1000){
            return ricepo.app.getDay(then.getDay());
        }
        else{
            return then.getMonth()+1 + '/' + then.getDate() + '/' + then.getFullYear()%100;
        }
    },

    slideCmp: function(cmp, direction){
        Ext.Viewport.animateActiveItem(cmp,{
            type: 'slide', 
            direction: direction, 
            easing: 'ease-in-out', 
            duration: 200 
        });
    },
    fadeCmp: function(cmp){
        Ext.Viewport.animateActiveItem(cmp,{
            type: 'fade', 
            easing: 'ease-in-out', 
            duration: 200 
        });
    },

    requires: [
        'Ext.MessageBox', 
        //'Ext.device.Push',
        'Ext.device.Device',
    ],

    views: [
        'Home', 'FoodList',
        'Cart', 'CartItem',
        'Address',
        'OrderList','Order', 
        'Settings', 'CityList'
    ],


    stores: [
        'Rests','Foods','Carts','Orders', 'RecentFoods', 'Cities'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },


    launch: function() {
        //config the status bar
        if(Ext.browser.is.WebView && Ext.os.is('iOS')){
            //StatusBar.styleDefault();
            StatusBar.styleLightContent();
            //StatusBar.backgroundColorByHexString("#FEFEF9");
            StatusBar.backgroundColorByHexString("#FF6347");
            StatusBar.overlaysWebView(false);
        }
        this.id = Ext.device.Device.uuid;
        //alert(Ext.device.Connection.isOnline());
        ricepo.app.lastResume = new Date().getTime();
        document.addEventListener("resume", function(){
            ricepo.app.refreshAll();
            ricepo.app.lastResume = new Date().getTime();
        }, false);

        //android back button
        if( Ext.browser.is.WebView && Ext.os.is('Android')){document.addEventListener("backbutton", function(){ricepo.app.goBack(); }, false); }

        
        // Initialize the main view
        var firstView;
        //if city set , go to rest
        if(localStorage.getItem('city')){
            firstView = Ext.create('ricepo.view.Home', {
                city: localStorage.getItem('city')
            });
        }
        //otherwise, go to citylist
        else{
            firstView = Ext.create('ricepo.view.CityList');
            Ext.create('ricepo.view.Home');
        }
        Ext.create('ricepo.view.FoodList');
        Ext.create('ricepo.view.Cart');
        Ext.create('ricepo.view.Address');
        Ext.create('ricepo.view.OrderList');

        //add home
        Ext.Viewport.add(firstView);
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        //hide splash screen
        if(Ext.browser.is.WebView && Ext.os.is('iOS')){
            setTimeout(function(){
                navigator.splashscreen.hide();
            },500);
        }
        //define the callback first
        if(window.callbacks === undefined) { window.callbacks = {}; }
        window.callbacks['onNotificationGCM'] = function(e){ricepo.app.onNotificationGCM(e); };
        window.callbacks['onNotificationAPN'] = function(){ricepo.app.onNotification(); };
        //if there is an order, user must have been asked about the push
        if(Ext.getStore('ordersStore').getCount()){
            ricepo.app.registerPush();
        }
    },

    onUpdated: function() {
        /*
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
        */
    },
    refreshAll: function(){
        //if no network connection
        if(!ricepo.app.checkNetwork()){return false;}

        //refresh orders anyway
        //refresh only the pending orders
        Ext.getStore('ordersStore').refresh();

        //reload restaurant every hour
        var time = new Date().getTime();
        if(time - ricepo.app.lastResume > 3600*1000){
            Ext.getStore('restsStore').load();
        }
        else{
            //recauculate close time every time resume
            Ext.getStore('restsStore').updateClose();
        }

        //ricepo.app.unmask();
    },
    //called when rest record is upated
    refreshClose: function(){
        Ext.getCmp('foodlist').checkClose();
        Ext.getCmp('cart').checkClose();
        Ext.getCmp('address').checkClose();
    },
    //called when order data is updated
    refreshOrder: function(){
        //refresh order view
        if(Ext.getCmp('order')){
            Ext.getCmp('order').updateView();
        }
        //enable/disable the delete button
        if(Ext.getCmp('orderlist')){
            if(Ext.getStore('ordersStore').getInactiveCount()) Ext.getCmp('orderlist').down('[align=right]').enable();
            else Ext.getCmp('orderlist').down('[align=right]').disable();
        }
        //update order number
        if(Ext.getCmp('home')){
            Ext.getCmp('home').setOrderCount(Ext.getStore('ordersStore').getActiveCount());
        }
    },
    //this appears at rests, foods, orders, address, settings, refreshAll
    checkNetwork: function(){
        if(Ext.device.Connection && !Ext.device.Connection.isOnline()){
            ricepo.app.alert('Please check network settings and try again later.', 'Cannot Connect to Ricepo');
            return false;
        }
        return true;
    },
    alert: function(msg, title){
        navigator.notification.alert(msg,null , title ? title : 'Ricepo' );
    },
    bottomPush : function(title){
        var bottom = Ext.getCmp('bottom');
        if(!bottom){
            bottom = Ext.create('Ext.TitleBar', {
                id: 'bottom',
                cls: 'r-toolbar',
                docked: 'bottom',
            });
            bottom.element.on('tap',function(cmp){
                ricepo.app.bottomPull();
                if(title.indexOf('Reload')>-1){
                    Ext.getStore('restsStore').load();
                    ricepo.app.fadeCmp(Ext.getCmp('home'));
                }
                else{
                    ricepo.app.fadeCmp(Ext.getCmp('orderlist'));
                }
            });
        }
        bottom.setTitle(title);
        Ext.Viewport.add(bottom);
        bottom.show();
    },
    bottomPull : function(){
        Ext.getCmp('bottom').hide();
    },
    registerPush: function(){
        
        //return for non webview
        if(!Ext.browser.is.WebView) return;
        //register
        var pushNotification = window.plugins.pushNotification;
        if(Ext.os.is('iOS')){
            pushNotification.register(
                function(result){ricepo.app.saveToken(result);},
                function(error){ricepo.app.alert(error); },
                {
                    "badge":"true", "sound":"true", "alert":"true",
                    "ecb":"callbacks.onNotificationAPN"
                }
            );
        }
        else if(Ext.os.is('Android')){
            pushNotification.register(
                function(result){},
                function(error){ricepo.app.alert(error); },
                {
                    "senderID":"126285366160",
                    "ecb":"callbacks.onNotificationGCM"
                }
            );
        }
    },
    onNotificationGCM: function(e){
        switch( e.event ) {
            case 'registered':
                if( e.regid.length > 0 ){
                    ricepo.app.saveToken('android#'+e.regid);
                } 
                break;
            case 'message':
                if(e.foreground){
                    ricepo.app.onNotification();
                }
                else{
                    if(e.coldstart){return;}
                    else{
                        //app will refresh anyway
                        ricepo.app.fadeCmp(Ext.getCmp('orderlist'));
                    }
                }
                break;
        }
    },
    onNotification: function(){
        var active = Ext.Viewport.getActiveItem().getId()
        if(active != 'orderlist'){
            ricepo.app.bottomPush('Your order is updated')
            setTimeout(function(){ricepo.app.bottomPull();}, 12000);
        }
        //vibrate
        navigator.notification.vibrate(400);
        ricepo.app.refreshAll();
    },
    saveToken: function(result){
        //local save
        localStorage.setItem("apn", result);
        //ajax save
        Ext.Ajax.request({
            url: host() + '/addApn',
            method: 'POST',
            params:  {
                user_id: ricepo.app.id,
                apn: result ,
            },
        });
    },
    goBack: function(){
        var map = {'home': 'home', 'foodlist': 'home', 'cart': 'foodlist', 'address': 'cart', 'orderlist': 'home', 'order': 'orderlist', 'settings': 'home', 'citylist': 'home'};
        var orig = Ext.Viewport.getActiveItem().getId();
        var dest = map[orig];
        if(orig == 'settings' || orig =='citylist') Ext.Viewport.animateActiveItem(Ext.getCmp(dest), {type: 'reveal', direction: 'down'});
        else ricepo.app.slideCmp(Ext.getCmp(dest), 'right');
    },
    ampm: function(hour, min){
        var h = (hour+11)%12+1;
        var m = ('0' + min).slice(-2);
        return h+':'+m+(hour<12||hour==24 ? 'am' : 'pm');
    },
});
//where this app needs network connetion
//create order
//cancel order
//get rests
//get foods
//update order status
//refresh the app
//send feedback
