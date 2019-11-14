# Mik-Printer
This application is responsible to print tickets and obtain printer status.
The layout of the ticket is defined in lib/printer/ticket-template.


# Contribute
System requirements
 - node (version 10.11.0) - because node-ffi dependency does not work with node10+
 - see setup deps for your environment

# RPi 4 image build
1. Get most recent desktop raspbian version (tested with 2019-09-26-raspbian-buster.img)
1. Extend it to free some space to create a new partition
    1. If the image is smaller than 4GB, use the following command
    1. sudo dd if=/dev/zero of=raspbian-buster.img bs=1M count=2048 seek=4096 conv=fsync status=progress
    1. It extends the image 2GB from 4GB offset
    1. Now lets extend the existing rootfs partition
    1. parted raspbian-buster.img
    1. resizepart 2 5120MB
    1. quit
    1. End sector of rootfs was moved to 5120
    1. Now let's create the new partition
    1. fdisk raspbian-buster.img
    1. p
    1. You can see that the rootfs was extended
    1. n
    1. e
    1. First sector is rootfs end sector + 1
    1. Last sector is default
    1. n
    1. l
    1. default
    1. default
    1. w
1. Remove the vanilla raspbian rootfs resize to fit the size of the sdcard
    1. sudo kpartx -av raspbian-buster.img
    1. mount created loop (should be in /dev/mapper) boot partition (should be the first one) somewhere
    1. go to the mount point of boot, edit cmdline.txt and remove "init=/usr/lib/raspi-config/init_resize.sh"
    1. sudo resize2fs /dev/mapper/<device of rootfs partition, should be the second one>
    1. unmount
    1. sudo kpartx -dv raspbian-buster.img
1. Burn it (tested with Etcher)
1. Boot. Username "pi", if asked.
1. Configure it with portuguese timezone and check the "Use English language" tick
1. Change keyboard layout to portuguese, in "Menu"->"Preferences"->"Mouse and Keyboard Settings"
1. Configure wireless connection or connect an ethernet cable. Either way, we need internet
1. Agree with the initial updates. On failure, execute "sudo apt-get update && sudo apt-get upgrade"
1. Fetch yourself a coffee
1. sudo rpi-update
1. Fetch yourself a cookie
1. reboot
1. Login again
1. Let's create the home partition
    1. Open terminal
    1. sudo apt-get install vim
    1. see partitions with sudo fdisk -l
    1. sudo mkfs.ext4 /dev/<the logical partition, should be the last one>
    1. sudo mkdir /mnt/pi
    1. sudo mount /dev/<the logical partition> /mnt/pi
    1. sudo chown 1000.1000 /mnt/pi
    1. cp -rp /home/pi /mnt/
    1. sudo vim /etc/fstab
    1. insert in last line "/dev/<the logical partition> /home/pi ext4    rw,user,auto,exec 0       0"
    1. sudo umount /mnt/pi
    1. reboot
1. cd ~
1. Somehow, clone mik-printer repo (I did it with an imported ssh key to github)
    1. cd mik-printer/setup/raspbian
    1. sudo ./deps.sh
    1. Fetch yourself another coffee
    1. ./electron.sh
    1. export PATH=${PATH}:/home/pi/node-v10.11.0-linux-armv7l/bin
    1. sudo ./screen.sh
    1. cd ~/mik-printer
    1. npm i
1. cd ~
1. Somehow, clone mik-dispenser
    1. cd mik-dispenser
    1. git checkout n2019-10-09-ipc
    1. npm run electron_install
1. cd ~
1. cd mik-printer
    1. cd setup/raspbian
    1. sudo ./systemd.sh
1. cd ~
    1. rm -rf mik-printer
    1. rm -rf mik-dispenser
    1. rm -rf node-v10.11.0-linux-armv7l
1. Somehow clone root-ro
    1. cd root-ro/utils
    1. sudo mount_utils.sh
    1. cd ..
    1. sudo ./install.sh

# RPi 4 lite image build
1. Get most recent lite raspbian version (tested with 2019-09-26-raspbian-buster-lite.img)
1. Extend it to free some space to create a new partition
    1. If the image is smaller than 4GB, use the following command
    1. sudo dd if=/dev/zero of=raspbian-buster.img bs=1M count=2048 seek=4096 conv=fsync status=progress
    1. It extends the image 2GB from 4GB offset
    1. Now lets extend the existing rootfs partition
    1. parted raspbian-buster.img
    1. resizepart 2 5120MB
    1. quit
    1. End sector of rootfs was moved to 5120
    1. Now let's create the new partition
    1. fdisk raspbian-buster.img
    1. p
    1. You can see that the rootfs was extended
    1. n
    1. e
    1. First sector is rootfs end sector + 1
    1. Last sector is default
    1. n
    1. l
    1. default
    1. default
    1. w
1. Remove the vanilla raspbian rootfs resize to fit the size of the sdcard
    1. sudo kpartx -av raspbian-buster.img
    1. mount created loop (should be in /dev/mapper) boot partition (should be the first one) somewhere
    1. go to the mount point of boot, edit cmdline.txt and remove "init=/usr/lib/raspi-config/init_resize.sh"
    1. sudo resize2fs /dev/mapper/<device of rootfs partition, should be the second one>
    1. unmount
    1. sudo kpartx -dv raspbian-buster.img
1. Burn it (tested with Etcher)
1. Boot. login "pi:raspberry".
1. sudo raspi-config
    1. "Localisation options" to set timezone "Lisbon", keyboard layout, and add a locale "pt_PT.UTF-8 UTF-8". Keep the default one  
    1. 
    1. "Network options" if you don't already have an internet connection. If using wifi don't forget to set location
1. sudo apt-get update
1. sudo apt-get vim (it is an essential tool)
1. sudo apt-get upgrade
1. sudo apt-get dist-upgrade
1. sudo rpi-update
1. sudo reboot
1. Login again
1. Let's take care of the GUI and other dependencies
    1. sudo apt-get install --no-install-recommends xserver-xorg xinput x11-xserver-utils
    1. sudo apt-get install openbox
    1. sudo apt-get install lightdm
    1. sudo raspi-config
    1. Boot Options -> boot to GUI without password
    1. sudo apt-get install libxss1
    1. sudo reboot
1. cd ~
1. Somehow, clone mik-printer repo (I did it with an imported ssh key to github)
    1. cd mik-printer/setup/raspbian
    1. sudo ./deps.sh
    1. Fetch yourself another coffee
    1. ./electron.sh
    1. export PATH=${PATH}:/home/pi/node-v10.11.0-linux-armv7l/bin
    1. sudo ./screen_lite.sh
    1. cd ~/mik-printer
    1. npm i