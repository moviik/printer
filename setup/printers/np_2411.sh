#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

PRINTER_FILE=../npi-cups-1.1.0.tar.gz
if [ ! -f "$PRINTER_FILE" ]
  then echo "$PRINTER_FILE must exist"
  exit
fi

DEFAULT_USER="$(id -nu 1000)"

# so the current user has access to printer service
usermod -a -G lp $DEFAULT_USER
usermod -a -G lpadmin $DEFAULT_USER

# configure cups printer driver
tar -xvf "$PRINTER_FILE"
cd npi-cups-1.1.0; make;
cd ..
mkdir -p /usr/share/cups/model/nippon
cp npi-cups-1.1.0/Npi_3inch_Reciept.ppd /usr/share/cups/model/nippon
cp npi-cups-1.1.0/rastertonpi /usr/lib/cups/filter

lpadmin -p NII_2INCH -E -v 	usb://NII/W2K203DPI%20USB -m nippon/Npi_3inch_Reciept.ppd
lpadmin -p NII_2INCH -o PageSize=X72MMY60MM 