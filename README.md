# WebRemoteLog-Go

To run you need a MongoDB running on localhost:

1. Start your mongodb  
2. git clone git@github.com:prsolucoes/WebRemoteLog-Go.git  
3. cd WebRemoteLog-Go  
4. go build  
5. ./WebRemoteLog-Go  
6. Open in your browser: http://localhost:8080  

# WebRemoteLog-Go - API

1. List(GET): http://localhost:8080/api/log/list?token=[put-your-token-here]&created_at=[start-date-log-optional]
2. Add(POST): http://localhost:8080/api/log/add   [token, type, message]

# WebRemoteLog-Go - Log Entity

1. token = your session token, because you can see only logs from specific session token.
2. type = can be any knowed type of level log (error, fatal, info, warning, trace, debug, verbose, echo, warning, success)
3. message = any log message

# WebRemoteLog-Go - Author WebSite

> http://www.pcoutinho.com
