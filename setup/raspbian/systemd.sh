#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

cp ./mik_printer.service /etc/systemd/system
cp ./mik_dispenser.service /etc/systemd/system

cp -rp /home/pi/mik-printer /usr/local/bin
cp -rp /home/pi/mik-dispenser /usr/local/bin
cp -rp /home/pi/node-v10.11.0-linux-armv7l /usr/local/bin

systemctl enable mik_printer
systemctl enable mik_dispenser