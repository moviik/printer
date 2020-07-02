#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

DEFAULT_USER="$(id -nu 1000)"

cp ./mik-printer.service /etc/systemd/system
cp ./mik-dispenser.service /etc/systemd/system

cp -rp /home/$DEFAULT_USER/mik-printer /usr/local/bin
cp -rp /home/$DEFAULT_USER/mik-dispenser /usr/local/bin
cp -rp /home/$DEFAULT_USER/node-v10.11.0-linux-x64 /usr/local/bin

systemctl enable mik-printer
systemctl enable mik-dispenser