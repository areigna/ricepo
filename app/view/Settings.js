Ext.define('ricepo.view.Settings',{
    extend: 'Ext.form.Panel',
    xtype: 'settings',
    requires: ['Ext.form.FieldSet'],
    config:{
        id: 'settings',
        fullscreen: true,
        cls: 'r-form',
        style: 'background-color:#FEFEF9',
        scrollable: {
            direction: 'vertical',
            indicators: false,
        },
        items: [
        	{
        		xtype: 'titlebar',
        		cls: 'r-toolbar',
                docked: 'top',
                items: [
                    {
                        text: 'Done',
                        align: 'left',
                        cls: 'left',
                        listeners: {
                            release: function(){
                                Ext.Viewport.animateActiveItem(Ext.getCmp('home'), {type: 'reveal', direction: 'down'}); 
                            } 
                        }
                    },
                ]
        	},
            {
            	xtype: 'fieldset',
            	title: '',
            	instructions: '',
            	items: [
            		{
            			xtype: 'textareafield',
                        name: 'comment',
            			placeHolder: 'Any thoughts about this app will help us get better!',
            			maxRows: 8,
                        listeners: {
                            keyup: function(cmp){
                                if(cmp.getValue()){cmp.up('settings').activate(); }
                                else{cmp.up('settings').off(); }
                            },
                            clearicontap: function(cmp){
                                cmp.up('settings').off();
                            }
                        }
            		},
            	]
            },
            {
                xtype: 'fieldset',
                cls: 'buttonpanel',
                instructions: '',
                items: [
                    {
                        xtype: 'button',
                        cls: 'buttonfield',
                        text: 'Send',
                        disabled: true,
                        pressedCls: 'pressed',
                        handler: function(){Ext.getCmp('settings').send(); }
                    }
                ]
            }
        ]
    },
    send: function(){
        //if no network connection
        if(!ricepo.app.checkNetwork()){return false;}
        var me = this;
        //prepare button
        var button = me.down('button[cls=buttonfield]');
        button.disable();
        button.setText('Sending..');

        var field = me.down('textareafield');
        Ext.Ajax.request({
            url: host() + '/comment',
            method: 'POST',
            params:  me.getValues(),
            success: function(response){
                field.setValue('');
                button.setText('Feedback Sent');
            },
            failure: function(){
                me.activate();
                ricepo.app.alert('Failed.. Please try again later.');
            },
            callback: function(){
            }
        });
    },
    activate: function(){
        this.down('button[cls=buttonfield]').enable();
        this.down('button[cls=buttonfield]').setText('Send');
    },
    off: function(){
        this.down('button[cls=buttonfield]').disable();
        this.down('button[cls=buttonfield]').setText('Send');
    },
});			

