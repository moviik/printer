#!/bin/bash

# Installs masung driver 
# Tested as working under Ubuntu 32/64 & RaspberryPi

/etc/init.d/cups stop

if [ $HOSTTYPE = 'arm' ]; then
	cp rastertomasungarm /usr/lib/cups/filter/rastertomasung
elif [ $(getconf WORD_BIT) = '32' ] && [ $(getconf LONG_BIT) = '64' ]; then
	cp rastertomasung64 /usr/lib/cups/filter/rastertomasung
else
	cp rastertomasung32 /usr/lib/cups/filter/rastertomasung
fi
mkdir -p /usr/share/cups/model/masung
cp ms-58.ppd /usr/share/cups/model/masung/
cp ms-80.ppd /usr/share/cups/model/masung/
cd /usr/lib/cups/filter
chmod 755 rastertomasung
chown root:root rastertomasung
cd -
/etc/init.d/cups start
