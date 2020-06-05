#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

DEFAULT_USER="$(id -nu 1000)"

cp /etc/dhcpcd.conf /home/$DEFAULT_USER
cp /etc/dhcpcd.conf /etc/dhcpcd.conf_baku
rm /etc/dhcpcd.conf
ln -s /home/$DEFAULT_USER/dhcpcd.conf /etc/dhcpcd.conf
chmod 666 /home/$DEFAULT_USER/dhcpcd.conf
