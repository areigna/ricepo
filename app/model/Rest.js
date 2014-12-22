Ext.define('ricepo.model.Rest', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'city','rest_id','click','name','chn_name',
            'delivery_fee','min', 'image','closed', 'off',

            'popular', 'chn_popular', 'phone', 'fax', 'sms',
            'slot', 'slot_info', 'note',

            'hour0', 'hour1', 'hour2', 'hour3', 'hour4', 'hour5', 'hour6',
            {
                name: 'slot_options',
                convert: function(value, record) {
                    var slot = record.get('slot'),
                        options = [],
                        date = new Date(),
                        day = date.getDay(),
                        hour = date.getHours(),
                        min = date.getMinutes();
                    if(!slot || !slot.length) return null;

                    for(var i = 0 ;i < slot.length; i++){
                        var item = {locations: []},
                            time = slot[i].split('$')[0],
                            start = time.split('-')[0],
                            startHour = parseInt(start.split(':')[0]),
                            startMin = parseInt(start.split(':')[1]),
                            locations = (slot[i].split('$')[1] || '').split(','),
                            days = (slot[i].split('$')[2] || '0123456'),
                            closed = parseInt(slot[i].split('$')[3]) || (startHour*60 + startMin - 60),
                            matchDay = day;

                        if(hour*60 + min > closed) {
                            matchDay = (matchDay + 1) % 7;
                        }

                        //find next available day
                        while(days.indexOf(matchDay) < 0) {
                            matchDay = (matchDay + 1) % 7;
                            //avoid infinite loop
                            if(matchDay === day) {
                                break;
                            }
                        }

                        //time
                        item.value = item.text = time + ' - ' + ricepo.app.getDay(matchDay);
                        //sort
                        item.v = (matchDay - day + 7) % 7 * 24 * 60 + startHour * 60 + startMin;

                        //locations
                        for(var j = 0 ;j < locations.length; j++) {
                            var locationItem = {};
                            locationItem.text = locationItem.value = locations[j].split('?')[0];
                            locationItem.more = /\?/.test(locations[j]);
                            item.locations.push(locationItem);
                        }

                        options.push(item);
                    }
                    options.sort(function(a,b){
                        return a.v - b.v;
                    });
                    return options;
                }
            },
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