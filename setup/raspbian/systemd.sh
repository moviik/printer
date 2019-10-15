#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

cp ./mik_printer.service /etc/systemd/system
cp ./mik_dispenser.service /etc/systemd/system

systemctl enable mik_printer
systemctl enable mik_dispenser