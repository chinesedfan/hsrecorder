#!/bin/sh
# THIS SCRIPTS GENERATES A FILE THAT CONTAINS ALL CARDS INFORMATION.

# The generated files are placed here.
OUTPUT_DIR=../bin

# Open {$HS_HOME}/Hearthstone.app/Contents/Data/Managed/Assembly-CSharp.dll by Monodevelop's assembly
# browser(Download from: http://www.monodevelop.com/), find enum GAME_TAG in namespace -, then copy all
# contents into this file **MANUALLY**.
TAG_FILE=$OUTPUT_DIR/GameTag.cs
# Covert C# enums into a js map.
TAG_MAP_FILE=$OUTPUT_DIR/tagmap.js
# The final result is saved into this file.
INFO_FILE=$OUTPUT_DIR/info.js

# The directory where you install the game.
HS_HOME=/Applications/Hearthstone
# The directory where you clone https://github.com/ata4/disunity.
DISUNITY_HOME=~/Desktop/disunity_v0.3.0
# Extracted XML files are in this folder.
XML_DIR=$HS_HOME/Data/OSX/cardxml0/CAB-cardxml0/TextAsset

# Generate the tag directory: {id -> name}.
node parseCs.js $TAG_FILE > $TAG_MAP_FILE
# Extract XML from unity3d files
if [ ! -d $HS_HOME/Data/OSX/cardxml0 ]
then
    sh $DISUNITY_HOME/disunity.sh extract $HS_HOME/Data/OSX/cardxml0.unity3d
fi
# Covert XML into json
node parseXml.js $XML_DIR/enUS.txt $TAG_MAP_FILE > $INFO_FILE

echo "...done!"
