#create phonegap folder in case
mkdir phonegap

#copy the config xml
cp config.xml phonegap/config.xml

#build
sencha app build native

#copy the icon screen
cp -r res/* phonegap/www/res/

#git commit & push
cd phonegap ; git add . ; git commit -m 'new commit' ; git push origin master