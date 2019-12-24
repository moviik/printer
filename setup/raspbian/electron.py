'Script to install electron\'s dependencies'

from urllib import request
from utils import extract_file, home_dir


def electron():
    home = home_dir()
    node_version = 'node-v10.11.0-linux-armv7l'
    file, _headers = request.urlretrieve(
        f'https://nodejs.org/dist/v10.11.0/{node_version}.tar.xz',
        f'{home}/{node_version}.tar.xz'
    )

    extract_file(file, home)
