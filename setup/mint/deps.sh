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
apt-get install -y cups libcups2-dev

# so the current user has access to printer service
usermod -a -G lp $DEFAULT_USER

# modus 3 libraries dependencies
apt-get install libgl-dev libqt4-dev libusb-1.0-0-dev -y
wget -P /tmp http://security.ubuntu.com/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1.1_amd64.deb
dpkg -i /tmp/libpng12-0_1.2.54-1ubuntu1.1_amd64.deb

tar -xvf "$MODUS_FILE"

# configure cups service
# https://github.com/apple/cups/issues/5664#issuecomment-540617663
echo "0x0dd4 0x023b no-reattach unidir" >  /usr/share/cups/usb/faster-print.usb-quirks
systemctl restart cups

# configure cups printer driver
./Modus3_CUPSDrv-200-PKG/Modus3_CUPSDrv-200.sh
gunzip -d /usr/share/cups/model/Custom/Modus3.ppd.gz
/usr/sbin/lpadmin -p CUSTOM_SPA_MODUS3 -E -v usb://CUSTOM%20SPA/MODUS3?serial=MODUS3%20USB%20Num.:%200 -m Custom/Modus3.ppd