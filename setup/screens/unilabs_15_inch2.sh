#!/bin/sh

# screen rotation counterclock
# must be a shell script because of escaping
# see https://wiki.lxde.org/en/LXSession

xrandr --output DP-2 --rotate left

#   touch matrix rotation and Calibration matrixes needs delay because xorg takes time to detect the touch device
sleep 10
xinput set-prop "USB Touchscreen 0dfc:0001" "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1
# different calibration for different Touchscreen
xinput set-prop "USB Touchscreen 0dfc:0001" "libinput Calibration Matrix" 39.384615384615378, 0, -0.39230769230769197, 0, -48.343347639484975, 1.571244635193133, 0.000000, 0.000000, 1.000000
