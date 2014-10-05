ricepo
======

Hao Chen
areigna@gmail.com


======
Development Environment Setup

- Sencha
http://www.sencha.com/products/sencha-cmd/download

- Compass
sudo gem install sass -v 3.2.13
sudo gem install fssm -v 0.2.10
sudo gem install compass -v 0.12.2
cd resources/sass && compass watch

- Phonegap / Cordova
http://docs.sencha.com/cmd/5.x/cordova_phonegap.html
sudo npm install -g phonegap
sudo npm install -g cordova

======
Run the application

- local web
sencha web start
sencha web stop

- remote build
chmod 777 build.sh
./build.sh
