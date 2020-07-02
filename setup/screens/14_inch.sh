#!/bin/sh

# screen rotation counterclock
# must be a shell script because of escaping
# see https://wiki.lxde.org/en/LXSession

#display, depends heavily on the board/computer
#pi:
xrandr --output HDMI-1 --rotate left
#lattepanda
# xrandr --output HDMI-2 --rotate left
# sleep 1
# xrandr --output HDMI-2 --mode 1024x768 --rate 60
# sleep 1
# xrandr --output DSI-1 --off


#   touch matrix rotation, needs delay because xorg takes time to detect the touch device
sleep 10
xinput set-prop "ILITEK ILITEK-TP" "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1