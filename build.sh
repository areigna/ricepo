#create phonegap folder in case
mkdir phonegap

#copy the config xml
cp config.xml phonegap/config.xml

#build
sencha app build native

#copy the icon screen
cp -r res/* phonegap/www/res/
cp icon.png phonegap/www/icon.png

#git commit & push
cd phonegap ; git add -A ; git commit -m 'new commit' ; git push origin master
