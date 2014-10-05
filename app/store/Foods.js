Ext.define('ricepo.store.Foods', {
	extend: 'Ext.data.Store',
	requires: [
		'ricepo.model.Food','ricepo.store.RecentFoods'
	],

	config: {
		model: 'ricepo.model.Food',
		storeId: 'foodsStore',
		sorters: {property:'food_id', direction: 'ASC'},
        grouper: {
			groupFn: function(record) {
				var arr = record.get('category').split('#');
				if(ricepo.app.isChn()){return arr[1];}
				else{return arr[0];}
			},
			sortProperty: 'score',
        },
        //groupDir: 'DESC',
		proxy: {
			type: 'ajax',
			url: host() + '/getFoodsByRest',
			extraParams: {
			},
			reader: {
	            type: "json",
	            rootProperty: "Items",
	        }
		},
		listeners: {
			beforeload: function(){
				//loading mask show up as soon as rest change
				//load the recent food after finished loading ajax rest food
				var id = ricepo.app.rest.get('rest_id');
	            var recentStore = Ext.getStore(id+'RecentFoodsStore');
	            if(!recentStore){
	                recentStore = Ext.create('ricepo.store.RecentFoods',{
	                    storeId: id+'RecentFoodsStore',
	                    proxy: {
	                        type: 'localstorage',
	                        id: id+'Recent',
	                    },
	                });
	            }
			},
			load: function(store){
				//need to handle the network error case, 
				//in which no foods show up, so no need to add recent
				if(store.getCount()){
					//add the recent items to the menu
					var id = ricepo.app.rest.get('rest_id');
		            var recentStore = Ext.getStore(id+'RecentFoodsStore');
		            recentStore.each(function(item){
		            	//find the item from foodlist
		            	var index = store.findBy(function(record){
		            		return record.get('food_id') == item.get('food_id') && record.get('category')!='Recent#最近';
		            	})
		            	//clone a new object and change category
		            	var newfood = store.getAt(index).copy().getData();
		            	newfood.category = 'Recent#最近';
		            	store.add(newfood);
		            });
				}
	            //unmask
				setTimeout(function(){ricepo.app.unmask(Ext.getCmp('foodlist')); }, 200);
				//do check close for the foodlist
			}
		}
	}
});