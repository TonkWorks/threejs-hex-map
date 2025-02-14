# threejs-hex-map

[![Build Status](https://travis-ci.org/Bunkerbewohner/threejs-hex-map.svg?branch=master)](https://travis-ci.org/Bunkerbewohner/threejs-hex-map)

A simple 3D hexagonal terrain map based on three.js.
 
![Screenshot](examples/random/screenshot.jpg)

## Overview

* hexagonal tiles with water, flat land, hills, mountains, rivers, trees and coast
* one texture atlas each for terrain textures, river tiles, and coast tiles
* blending mask texture for transitions between tiles
* two-tier fog of war like in Civilization

# Flag stickers
https://icons8.com/icon/set/flags/stickers

## Usage

For an example check out the code in `examples/random`. To test it in the browser
simply `npm start` and open `http://localhost:3000/examples/random/`.


## Packaging to windows

# apt-get install wine64
# npm install electron-packager
cd election

export PATH=$PATH:/usr/lib/wine
rm -fr build
electron-packager dist risingpowers --platform=win32 --arch=x64 --out build/win --overwrite --icon dist/assets/branding/icon.ico
zip -r build/a.zip build/win/risingpowers-win32-x64/
# right click download
# wait like 2 minutes to finish
# send to -> compress in folder that has .exe upload to steamworks.