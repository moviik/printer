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
# for ubuntu 20.04 you need this ppa: ppa:rock-core/qt4
wget -P /tmp http://security.ubuntu.com/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1.1_amd64.deb
# for ubuntu 20.04 http://ppa.launchpad.net/linuxuprising/libpng12/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1.1+1~ppa0~eoan_amd64.deb
dpkg -i /tmp/libpng12-0_1.2.54-1ubuntu1.1_amd64.deb

apt-get install dhcpcd5
apt-get install python