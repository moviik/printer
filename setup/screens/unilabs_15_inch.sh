#!/bin/sh

# screen rotation counterclock
# must be a shell script because of escaping
# see https://wiki.lxde.org/en/LXSession

xrandr --output DP-1 --rotate left

#   touch matrix rotation and Calibration matrixes needs delay because xorg takes time to detect the touch device
sleep 10
xinput set-prop "HID 1aad:0001" "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1
xinput set-prop "HID 1aad:0001" "libinput Calibration Matrix" -40.959999, 0.000000, 4.900000, 0.000000, -55.854546, 1.409091, 0.000000, 0.000000, 1.000000