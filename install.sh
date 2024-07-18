#!/bin/sh
if [ `id -u` -ne 0 ]
    then echo Please run this script as root or using sudo/doas!
    exit
fi

mkdir -p /usr/lib/tabane
cp -r ./* /usr/lib/tabane
cd /usr/lib/tabane
npm i
npm link
echo "All done! You can try using tabane now using 'tabane help'"