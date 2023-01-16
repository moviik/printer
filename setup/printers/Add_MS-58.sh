#!/bin/bash

# Add Printers 
# Tested as working under Ubuntu 32/64 & RaspberryPi

devid=$(dmesg | grep  'vid 0x0519'|cut -b 36-38)
echo "URI:"$devid
lpadmin -p ms-58 -v parallel:/dev/usb/$devid  -P /usr/share/cups/model/masung/ms-58.ppd -E
lpadmin -p ms-80 -v parallel:/dev/usb/$devid  -P /usr/share/cups/model/masung/ms-80.ppd -E 

#Print file
lp -d ms-58 install.sh