#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

apt-get install -y lxterminal

# add lxterminal shortcut to openbox
sed -i '/<\/keyboard>*/i<keybind key="C-A-t"><action name="Execute"><command>lxterminal</command></action></keybind>' /etc/xdg/openbox/rc.xml

# remove mouse pointer
sed -i '/#xserver-command=X/c\xserver-command=X -s 0 dpms -nocursor' /etc/lightdm/lightdm.conf

cp -r ./screens /etc/xdg/openbox

# 10"
echo "/etc/xdg/openbox/screens/10_inch.sh" > /etc/xdg/openbox/autostart
