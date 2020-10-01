#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

apt-get install -y lxterminal

# add lxterminal shortcut to openbox
sed -i '/<\/keyboard>*/i<keybind key="C-A-t"><action name="Execute"><command>lxterminal</command></action></keybind>' /etc/xdg/openbox/rc.xml

# remove all crap inside /usr/share/lightdm/lightdm.conf.d
rm /usr/share/lightdm/lightdm.conf.d/*

# remove mouse pointer
cp 50-moviik.conf /usr/share/lightdm/lightdm.conf.d

cp -r ../screens /etc/xdg/openbox

# 10"
# echo "/etc/xdg/openbox/screens/10_inch.sh" > /etc/xdg/openbox/autostart
# 14"
echo "/etc/xdg/openbox/screens/14_inch.sh" > /etc/xdg/openbox/autostart
