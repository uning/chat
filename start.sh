#!/bin/sh

#
# start.sh
#
# Developed by Tingkun <tingkun@playcrab.com>
# Copyright (c) 2012 Playcrab Corp.
# Licensed under terms of GNU General Public License.
# All rights reserved.
#
# Changelog:
# 2012-01-11 - created
#

mydir=$(dirname $0)

env='development'
if [ "$1" == "1" ] ; then
	env='production'
fi


#NODE_ENV=$env nohup  node $mydir/server.js  > t.log &
#NODE_ENV=$env   node  $mydir/server.js  
NODE_ENV=$env supervisor -w $mydir/src $mydir/index.js  
