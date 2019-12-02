#!/bin/sh

# screen rotation counterclock
# must be a shell script because of escaping
# see https://wiki.lxde.org/en/LXSession

#   display
xrandr --output HDMI-1 --rotate left

#   touch matrix rotation, needs delay because xorg takes time to detect the touch device
sleep 10
xinput set-prop "ILITEK Multi-Touch-V3000" "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1