#!/bin/sh


DEFAULT_USER="$(id -nu 1000)"

wget https://nodejs.org/dist/v10.11.0/node-v10.11.0-linux-x64.tar.xz -P /home/$DEFAULT_USER
tar -xvf /home/$DEFAULT_USER/node-v10.11.0-linux-x64.tar.xz -C /home/$DEFAULT_USER