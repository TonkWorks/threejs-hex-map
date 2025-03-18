# Rising Powers
 
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



## prompting
map units -- cahtgpt 4.0
Generate a texture for a Three.js projec, designed to depict a  3D revolutionary era military axe man in a hex map perspective view - scale to 2/3 of image so that it is not cut off

Generate a texture for a game Three.js project, designed to depict a 3D c 5 4x iso-style of a farm a hex map perspective view - scale to 2/3 of image
https://chatgpt.com/c/67d9a3f0-0ae4-8010-b8a0-08d7dd72cd48





## Packaging to windows

# apt-get install wine64
# npm install electron-packager
cd election

export PATH=$PATH:/usr/lib/wine
rm -fr build
electron-packager dist risingpowers --platform=win32 --arch=x64 --out build/win --overwrite --icon dist/assets/branding/icon.ico
(cd build/win/risingpowers-win32-x64 && zip -r ../a.zip .)

# right click download
# wait like 2 minutes to finish
# https://partner.steamgames.com/apps/depotuploads/3486440