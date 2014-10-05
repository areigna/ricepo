Ext.define('ricepo.model.Rest', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'city','rest_id','click','name','chn_name',
            'delivery_fee','min', 'image','closed', 'off',

            'popular', 'chn_popular', 'phone',

            'hour0', 'hour1', 'hour2', 'hour3', 'hour4', 'hour5', 'hour6',
            {
                name: 'hour_closed',
                convert: function(value, record){
                    //if manuallly closed
                    if(record.get('closed')) return 'Closed today';
                    //get current time
                    var d = new Date();
                    var day = d.getDay();
                    var current = d.getHours()*60 + d.getMinutes();
                    //get rest hours
                    var hour = record.get('hour'+day);
                    var arr = hour.split('-');
                    if(arr.length == 1){
                        return 'Closed today'; 
                    }
                    var open = arr[0].split(':');
                    var openTime = parseInt(open[0])*60 + parseInt(open[1]);
                    var close = arr[1].split(':');
                    var closeTime = parseInt(close[0])*60 + parseInt(close[1]);
                    //already closed
                    if(current > closeTime){
                        return 'Closed @ ' + ricepo.app.ampm(parseInt(closeTime/60), closeTime%60);
                    }
                    //will open
                    else if(current < openTime){
                        return 'Open @ ' + ricepo.app.ampm(parseInt(openTime/60), openTime%60);
                    }
                    return '';
                },
            },
            {
                name: 'score',
                type: 'int',
                convert: function(value, record){
                    if(record.get('off')) return -3; 
                    //closed today is worse than will open at
                    else if(record.get('closed') || record.get('hour_closed').indexOf('oday') > -1) return -2; 
                    else if(record.get('hour_closed')) return -1; 
                    else return record.get('click'); 
                }
            }
        ],
        idProperty: 'rest_id',
    },
});