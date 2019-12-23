'Script to install cups printer modus3 dependencies'

from os import system, getlogin
from gzip import open as gzip_open

from utils import print_env, assert_sudo, assert_file, extract_file


def _cups_quirks():
    # https://github.com/apple/cups/issues/5664#issuecomment-540617663
    cups_quirk_file = open('/usr/share/cups/usb/faster-print.usb-quirks', 'a+')
    cups_quirk_file.writelines(['0x0dd4 0x023b no-reattach unidir'])
    cups_quirk_file.close()


def _cups_driver():
    modus_driver = 'Modus3_CUPSDrv-200-PKG'
    modus_file = f'{modus_driver}.tgz'
    assert_file(modus_file)
    extract_file(modus_file)
    system(f'{modus_driver}/Modus3_CUPSDrv-200.sh')

    ppd_file_name = 'Modus3.ppd'
    cups_ppd_folder = '/usr/share/cups/model/Custom'
    ppd_zip_file = gzip_open(f'{cups_ppd_folder}/{ppd_file_name}.gz')
    ppd_file = open(f'{cups_ppd_folder}/{ppd_file_name}', 'ab')
    ppd_file.write(ppd_zip_file.read())
    ppd_zip_file.close()
    ppd_file.close()

    printer_name = 'CUSTOM_SPA_MODUS3'
    # printer with firmware (FCODE) 1.00
    # printer_usb_uri='usb://CUSTOM%20SPA/MODUS3?serial=MODUS3%20USB%20Num.:%200'
    # printer with firmware (FCODE) 1.01
    printer_usb_uri = 'usb://CUSTOM%20SPA/MODUS3?serial=MODUS3_USB_Num.:_0'
    system(f'lpadmin -p {printer_name} -E -v {printer_usb_uri} -m Custom/Modus3.ppd')
    system(f'lpadmin -p {printer_name} -o PageSize=X80MMY58MM')


def printer():
    print_env()
    assert_sudo()

    username = getlogin()

    system('apt-get update')

    # cups service
    system('apt-get install -y cups')

    # modus 3 libraries dependencies
    system('apt-get install libgl-dev libqt4-dev libusb-dev libpng12-dev -y')

    # so the current user has access to printer service
    system(f'usermod -a -G lp {username}')
    system(f'usermod -a -G lpadmin {username}')

    _cups_quirks()
    _cups_driver()
