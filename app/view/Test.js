Ext.define('ricepo.view.Test',{
	extend: 'Ext.Panel',
	xtype: 'test',
	requires: [],
	config:{
			fullscreen: true,
			scrollable: {
				direction: 'horizontal',
				directionLock: true,
			},
			items: [{
				xtype: 'dataview',
				width: '100%',
				height: '10vh',
                scrollable: {
                    direction: 'horizontal',
                    directionLock: true,
                    //indicators: false,
                },
                inline: { wrap: false },
                data: [
                    {name: 'haha'}, {name: 'yaya'},
                    {name: 'haha'}, {name: 'yaya'},
                    {name: 'haha'}, {name: 'yaya'},
                    {name: 'haha'}, {name: 'yaya'},
                    {name: 'haha'}, {name: 'yaya'},
                    {name: 'haha'}, {name: 'yaya'},
                    {name: 'haha'}, {name: 'yaya'},
                ],
                itemCls: 'cart',
                itemTpl : '{name}',

			}],
                //xtype: 'dataview',
	},
});