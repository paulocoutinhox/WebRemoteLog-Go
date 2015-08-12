DIR=`dirname $0`
DIR="$DIR/../"
LOG_FILE=/var/log/webremotelog.log
EXECUTABLE=WebRemoteLog-Go

echo "> Starting in: $DIR"
cd $DIR
echo "> Stopping..."
pkill WebRemoteLog-Go
echo "> Stopped"
echo "> Log will be store in: $LOG_FILE"
echo "> Starting..."
nohup $DIR/$EXECUTABLE >> $LOG_FILE 2>&1 </dev/null &
echo "> Started"