# (DISCONTINUED - MOVED TO: https://github.com/prsolucoes/logstack)

# WebRemoteLog-Go

To run you need a MongoDB running on localhost:

1. Start your mongodb  
2. Create a database with name: WebRemoteLog
3. Execute: git clone git@github.com:prsolucoes/WebRemoteLog-Go.git  
4. Execute: cd WebRemoteLog-Go
5. Execute: ./commands/install-go-deps.sh  
6. Execute: ./commands/start.sh  
7. Open in your browser: http://localhost:8080  

** The application will try connect on your localhost mongdb

# API

1. List(GET): http://localhost:8080/api/log/list?token=[put-your-token-here]&created_at=[start-date-log-optional]
2. Add(POST): http://localhost:8080/api/log/add   [token, type, message]
3. DeleteAll(GET): http://localhost:8080/api/log/deleteAll   [token]
4. StatsByType(GET): http://localhost:8080/api/log/statsByType   [token]

# Log Entity

1. token = your session token, because you can see only logs from specific session token.
2. type = can be any knew type of level log (error, fatal, info, warning, trace, debug, verbose, echo, warning, success)
3. message = any log message

# Command line interface

Inside "commands" directory, you have some command line interface to make something automatic, like start, stop and update from git repository.

1. start = it will kill current WebRemoteLog-Go process and start again
2. stop  = it will kill current WebRemoteLog-Go process
3. update  = it will update code from git, rebuild the service and restart the service for you

So if you want start your server, you can use "start" command to do it for you.

# Alternative method to Build and Start project

1. go build
2. ./WebRemoteLog-Go

# Updates In Real Time

You dont need refresh your browser, everything is updated in real time. 

You can leave the stats charts opened in one browser window for example and see the chart being refreshed in real time.  

# Screenshots

[![Main interface](https://github.com/prsolucoes/WebRemoteLog-Go/raw/master/screenshots/WebRemoteLog1.png)](http://github.com/prsolucoes/WebRemoteLog-Go)

[![Stats](https://github.com/prsolucoes/WebRemoteLog-Go/raw/master/screenshots/WebRemoteLog2.png)](http://github.com/prsolucoes/WebRemoteLog-Go)

# Author WebSite

> http://www.pcoutinho.com

# License

MIT
