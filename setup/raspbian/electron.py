'Script to install electron\'s dependencies'

from urllib import request
from pathlib import Path
from utils import extract_file


def electron():
    home_dir = str(Path.home())
    node_version = 'node-v10.11.0-linux-armv7l'
    file, _headers = request.urlretrieve(
        f'https://nodejs.org/dist/v10.11.0/{node_version}.tar.xz',
        f'{home_dir}/{node_version}.tar.xz'
    )

    extract_file(file, home_dir)
