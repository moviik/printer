#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

PRINTER_FILE=../tmx-cups-src-ThermalReceipt-3.0.0.0.tar.gz
if [ ! -f "$PRINTER_FILE" ]
  then echo "$PRINTER_FILE must exist"
  exit
fi

DEFAULT_USER="$(id -nu 1000)"

# so the current user has access to printer service
usermod -a -G lp $DEFAULT_USER
usermod -a -G lpadmin $DEFAULT_USER

# needed to build rasterto
apt-get install cmake

# configure cups printer driver
tar -xvf "$PRINTER_FILE"
cd Thermal\ Receipt; ./build.sh; ./install.sh
/usr/sbin/lpadmin -p EPSON_TM_T20III -E -v 	usb://EPSON/TM-T20III?serial=583741560634690000 -m EPSON/tm-ba-thermal-rastertotmtr-180.ppd