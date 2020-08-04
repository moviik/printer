# Debian x86 image build

Note: You can use raspbian setup as well, considering the OSs are very similar. Just take some care about specific packages or default settings for some Linux distribution images. But it should work anyway

1. Get a debian image (tested with Ubuntu 18.04 desktop, Mint 19.02, Ubuntu 16.06 desktop)
1. sudo apt-get install vim (it is an essential tool)
1. Let's take care of the GUI
    1. Make sure there is no screen-saver (in Ubuntu go to Settings Menu, Power, or Lock you should see this)
    1. Make sure there is no screen-dim or power-off (in Ubuntu should be in Settings Menu)
    1. Go to user settings and set your user to login automatically
    1. sudo apt-get install cups libcups2-dev libcupsimage2 (needed for npm package @thiagoelg/node-printer)
    1. sudo apt-get install chromium-browser (needed for npm package puppeteer)
    1. sudo reboot
1. cd ~
1. Somehow, clone mik-printer repo (I did it with an imported ssh key to github)
    1. Choose your printer and run the script inside the printers folder
    1. cd ~/mik-printer/setup
    1. sudo ./crontab.sh
    1. cd debian
    1. ./electron.sh
    1. export PATH=${PATH}:/home/admin/node-v10.11.0-linux-x64/bin
    1. sudo ./screen.sh
    1. cd ..
    1. sudo ./networking.sh
    1. cd ~/mik-printer
    1. PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i --production
1. cd ~
1. Somehow, clone mik-dispenser
    1. cd mik-dispenser
    1. npm run electron_install
1. cd ~
1. Lets take care of systemd application management
    1. cd mik-printer/setup/debian
    1. sed -i 's/USER_REPLACE/<your username>/g' mik-dispenser.service mik-printer.service
    1. sudo ./systemd.sh (this is silent and might take a while)
1. Allow user to reboot with no password
    1. Place a file "reboot" with content "%sudo ALL=(ALL) NOPASSWD: /sbin/reboot", with mode 0440 in /etc/sudoers.d
1. Done, reboot
