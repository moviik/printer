#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

MODUS_FILE=../Modus3_CUPSDrv-200-PKG.tgz
if [ ! -f "$MODUS_FILE" ]
  then echo "$MODUS_FILE must exist"
  exit
fi

DEFAULT_USER="$(id -nu 1000)"

# cups service
apt-get install -y cups

# so the current user has access to printer service
usermod -a -G lp $DEFAULT_USER

# modus 3 libraries dependencies
apt-get install libgl-dev libqt4-dev libusb-dev libpng12-dev -y

tar -xvf "$MODUS_FILE"

# configure cups service
# https://github.com/apple/cups/issues/5664#issuecomment-540617663
echo "0x0dd4 0x023b no-reattach unidir" >  /usr/share/cups/usb/faster-print.usb-quirks
systemctl restart cups

# configure cups printer driver
./Modus3_CUPSDrv-200-PKG/Modus3_CUPSDrv-200.sh
gunzip -d /usr/share/cups/model/Custom/Modus3.ppd.gz
/usr/sbin/lpadmin -p CUSTOM_SPA_MODUS3 -E -v usb://CUSTOM%20SPA/MODUS3?serial=MODUS3%20USB%20Num.:%200 -m Custom/Modus3.ppd