# Mik-Printer
This application is responsible to print tickets and obtain printer status.
The layout of the ticket is defined in lib/printer/ticket-template.


# Contribute
System requirements
 - node (version 10.11.0) - because node-ffi dependency does not work with node10+
 - see setup deps for your environment

# RPi 4 image build
1. Get most recent desktop raspbian version (tested with 2019-09-26-raspbian-buster.img)
1. Burn it (tested with Etcher)
1. Boot. Username "pi", if asked.
1. Configure it with portuguese timezone and check the "Use English language" tick
1. Agree with the initial updates. On failure, execute "sudo rpi-update"
1. Change keyboard layout to portuguese, in "Menu"->"Preferences"->"Mouse and Keyboard Settings"
1. Reboot
1. cd ~
1. Somehow, clone mik-printer repo (I did it with an imported ssh key to github)
1. cd mik-printer/setup/raspbian
1. sudo ./deps.sh
1. Fetch yourself a coffee
1. ./electron.sh
1. sudo ./systemd.sh
1. sudo ./screen.sh
1. cd ~
1. Somehow, clone mik-dispenser
1. export PATH=${PATH}:/home/pi/node-v10.11.0-linux-armv7l/bin
1. cd mik-printer
1. npm i
1. cd ~/mik-dispenser
1. git checkout n2019-10-09-ipc
1. npm run electron_install
1. sudo reboot