#!/bin/sh


DEFAULT_USER="$(id -nu 100)"

wget https://nodejs.org/dist/v10.11.0/node-v10.11.0-linux-armv7l.tar.xz -P /home/$DEFAULT_USER
tar -xvf /home/$DEFAULT_USER/node-v10.11.0-linux-armv7l.tar.xz -C /home/$DEFAULT_USER