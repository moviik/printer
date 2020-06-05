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

apt-get update

# cups service
apt-get install -y cups

# so the current user has access to printer service
usermod -a -G lp $DEFAULT_USER
usermod -a -G lpadmin $DEFAULT_USER

# modus 3 libraries dependencies
apt-get install libgl-dev libqt4-dev libusb-dev libpng12-dev -y

# configure cups service
# https://github.com/apple/cups/issues/5664#issuecomment-540617663
echo "0x0dd4 0x023b no-reattach unidir" >  /usr/share/cups/usb/faster-print.usb-quirks
systemctl restart cups

# configure cups printer driver
tar -xvf "$MODUS_FILE"
./Modus3_CUPSDrv-200-PKG/Modus3_CUPSDrv-200.sh
gunzip -d /usr/share/cups/model/Custom/Modus3.ppd.gz
## printer with firmware (FCODE) 1.00
# /usr/sbin/lpadmin -p CUSTOM_SPA_MODUS3 -E -v usb://CUSTOM%20SPA/MODUS3?serial=MODUS3%20USB%20Num.:%200 -m Custom/Modus3.ppd

## printer with firmware (FCODE) 1.01
/usr/sbin/lpadmin -p CUSTOM_SPA_MODUS3 -E -v usb://CUSTOM%20SPA/MODUS3?serial=MODUS3_USB_Num.:_0 -m Custom/Modus3.ppd

## update page size 80MM
## lpadmin -p CUSTOM_SPA_MODUS3 -o PageSize=X80MMY58MM
## update page size 60MM
lpadmin -p CUSTOM_SPA_MODUS3 -o PageSize=X54MMYRoll

## enable partial cut
## outputMouth sensor must be disabled in the printer flash for this to work
lpadmin -p CUSTOM_SPA_MODUS3 -o CutMode=1PartialCutEP