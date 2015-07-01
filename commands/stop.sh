DIR=`dirname $0`
DIR="$DIR/../"
EXECUTABLE=WebRemoteLog-Go

echo "> Starting in: $DIR"
echo "> Killing Application: $EXECUTABLE"
pkill WebRemoteLog-Go
echo "> Killed"