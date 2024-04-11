#!/bin/sh

set -ex

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

PRINTER_FILE=./CUPS_Linux_Driver.zip
if [ ! -f "$PRINTER_FILE" ]
  then echo "$PRINTER_FILE must exist"
  exit
fi

DEFAULT_USER="$(id -nu 1000)"

apt-get install unzip

# so the current user has access to printer service
usermod -a -G lp $DEFAULT_USER
usermod -a -G lpadmin $DEFAULT_USER

# configure cups printer driver
unzip ./CUPS_Linux_Driver.zip -d CUPS_Linux_Driver
sudo dpkg -i CUPS_Linux_Driver/ctzpos-cups_1.2.4-0_armhf.deb
cd /usr/share/cups/model
mkdir citizen
sudo mv CBM1000.ppd citizen
sudo mv CDS500.ppd citizen
sudo mv CM* citizen
sudo mv CT* citizen
sudo mv P* citizen

lpadmin -p CT_S310 -E -v 'usb://CITIZEN/CT-S310II?serial=00000000' -m citizen/CTS310II.ppd
lpadmin -p CT_S310 -o PageSize=X72MMY60MM
lpadmin -p CT_S310 -o CutterMode=2NoFull