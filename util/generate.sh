#!/bin/sh
# THIS SCRIPTS GENERATES A FILE THAT CONTAINS ALL CARDS INFORMATION.

# Python 3
PYTHON=python3.4

# Current work directory
CWD=`pwd`
# The generated files are placed here.
OUTPUT_DIR=../bin

# Open {$HS_HOME}/Hearthstone.app/Contents/Data/Managed/Assembly-CSharp.dll by Monodevelop's assembly
# browser(Download from: http://www.monodevelop.com/), find enum GAME_TAG in namespace -, then copy all
# contents into this file **MANUALLY**.
TAG_FILE=GameTag.cs
# Covert C# enums into a js map.
TAG_MAP_FILE=$OUTPUT_DIR/tagmap.js
# The final result is saved into this file.
INFO_FILE=$OUTPUT_DIR/cardlist.js

# The directory where you install the game.
HS_HOME=/Applications/Hearthstone
# https://github.com/HearthSim/hsdata/blob/master/CardDefs.xml
XML_FILE=../bin/CardDefs.xml

# Generate the tag directory: {id -> name}.
node parseCs.js $TAG_FILE > $TAG_MAP_FILE
# Covert XML into json
node parseXml.js $XML_FILE $TAG_MAP_FILE > $INFO_FILE

echo "...done!"
