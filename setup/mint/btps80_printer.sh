#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

BTP_FILE="../BTP-S80_LinuxDrv_EN_V1.01531982740374.rar"
if [ ! -f "$BTP_FILE" ]
  then echo "$BTP_FILE must exist"
  exit
fi

DEFAULT_USER="$(id -nu 1000)"

apt-get update

# cups service
apt-get install -y cups libcups2-dev

# so the current user has access to printer service
usermod -a -G lp $DEFAULT_USER
usermod -a -G lpadmin $DEFAULT_USER

# need to install unrar to extract this
apt-get install -y unrar-free
unrar e "$BTP_FILE"

# extract required cups drivers
BTP_FILE='./BTP-S80_LinuxDrv_EN V1.0/BTPS80_x64/BTPS80(180).tar'
tar -xvf "$MODUS_FILE"

#install printer
mkdir /usr/share/cups/model/snbc
cp 'BTPS80(180)/BTPS80(180).ppd' /usr/share/cups/model/snbc
cp 'BTPS80(180)/rastertoBTPS80(180)' /usr/lib/cups/filter/
lpadmin -p SNBC_BTPS80 -E -v 'usb://SNBC/BTP-S80(U)1' -m snbc/'BTPS80(180).ppd'

# lpadmin -p SNBC_BTPS80 -o PageSize=Custom.280x180
sudo lpadmin -p SNBC_BTPS80 -o PageSize=Paper210