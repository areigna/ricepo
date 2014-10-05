Ext.define('ricepo.model.Order', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'order_id','comments', 
            'items', 'rest',
            'address', 'phone', 'delay',
            //{name: 'done', type: 'bool', defaultValue: false},
            {name: 'done', type: 'number', defaultValue: 0},
            {name: 'total', type: 'number'},
            //{name: 'time', type: 'int', },
            {name: 'status',},
            {name: 'msg', },
            {
                name: 'update_time',
                type: 'int',
                convert: function(value, record){
                    if(value){return value; }
                    else{return new Date().getTime(); }
                }
            }
            //{name: 'status', }
            /*
            {name: 'hour', convert: function(value, record){return new Date(record.get('time')).getHours(); } },
            {name: 'minute', convert: function(value, record){return new Date(record.get('time')).getMinutes(); } },
            {name: 'date', convert: function(value, record){return new Date(record.get('time')).getDate(); } },
            {name: 'month', convert: function(value, record){return new Date(record.get('time')).getMonth(); } },
            */
            //{name: 'order_id', type: 'string', },
        ],
        identifier: 'uuid',
    },
    update: function(){
        var me = this;
        //set to loading animation
        me.set('status','y');
        me.set('msg','y');
        Ext.Ajax.request({
            url: host() + '/getOrder',
            method: 'GET',
            params: {
                rest_id : me.get('rest').rest_id,
                order_id: me.get('order_id'),
            },
            success: function(response){
                var data = JSON.parse(response.responseText);
                if(data.Count){
                    me.set('status',data.Items[0].status);
                    me.set('msg',data.Items[0].msg);
                    me.set('update_time',data.Items[0].update_time);
                    me.set('done',data.Items[0].done);
                    //no need, we have updateRecord event listener
                    //Ext.getCmp('order').updateView();
                }
                //order not found
                else{
                    me.set('status','Cancelled');
                    me.set('msg','Order not found');
                    me.set('update_time', new Date().getTime());
                    me.set('done', 1);
                }
            },
            failure: function(){
                ricepo.app.alert('Refreshing order failed, please try again later');
                me.set('status',ricepo.app.startStatus);
                me.set('msg', ricepo.app.startMsg);
            },
            callback: function(){
            }
        }); 
    },
    cancel: function(){
        //check connection
        if(!ricepo.app.checkNetwork()){return false;}
        //go ahead, disable the button
        var button = Ext.getCmp('cancelbutton');
        button.disable();
        ricepo.app.mask();

        var me = this;
        var time = new Date().getTime();
        var status = 'Cancelled';
        var msg = 'Cancelled by Customer';
        Ext.Ajax.request({
            url: host() + '/pushOrder',
            method: 'POST',
            params: {
                rest_id : me.get('rest').rest_id,
                order_id: me.get('order_id'),
                update_time: time,
                status: status,
                msg: msg,
                done: 1,
            },
            success: function(response){
                me.set('status', status);
                me.set('msg', msg);
                me.set('update_time',time);
                me.set('done',1);
                ricepo.app.slideCmp(Ext.getCmp('orderlist'),'right');
            },
            failure: function(){
                button.enable();
                ricepo.app.alert('Cancel failed, please try later.');
            },
            callback: function(){
                ricepo.app.unmask();
                //we cannot enable the cancel button here
                //because updateview will automatically enable/disable the button after record updated
                //Ext.getCmp('cancelbutton').enable();
                //but we need to handle the requet fail situation
            }
        }); 
    }
});