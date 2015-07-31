WebRemoteLog-Go
===============
> An API to manage remote log messages

[![Demo](https://github.com/prsolucoes/WebRemoteLog-Go/raw/master/screenshot.png)](http://github.com/prsolucoes/WebRemoteLog-Go)

WebRemoteLog-Go provides an API to store the log messages and a web interface
to see and query the data into database.

## Requirements

* MongoDB server
* Golang environment

## How to use

Follow the steps bellow:

```bash
# Start your mongodb
mongod &

# Create the LogHistory collection into the WebRemoteLog database
mongo WebRemoteLog --eval "db.createCollection('LogHistory')"

# Clone this repo
git clone git@github.com:prsolucoes/WebRemoteLog-Go.git

# Build and run the app
cd WebRemoteLog-Go
./commands/install-go-deps.sh
go build -o WebRemoteLog-Go
./WebRemoteLog-Go

# Open the web interface
open http://localhost:8080
```

## The Docker way

You can run into a Docker container. This way is a good option if you don't have a `Golang` environment and the `MongoDB` server installed.
Remeber if you  are using the OSX or Windows you need to have the `boot2docker` installed.

```bash
# Create the Docker image
make build

# Run into the container
make container

# Compile the app
make compile

# Run the app
make run

# Open the web interface
open http://`boot2docker ip`:8080
```

## API usage

You need to send your token generated via web interface all the time.

* **token**: your session token, because you can see only logs from specific session token.
* **type**: can be any knew type of level log (error, fatal, info, warning, trace, debug, verbose, echo, warning, success)
* **message**: any log message

```bash
#  To list the logs. You can send an optional date
curl http://localhost:8080/api/log/list?token=<your-token>&created_at=<optional-start-date>

# To save the log message
curl -XPOST http://localhost:8080/api/log/add [token, type, message]

# To clear the log message
curl http://localhost:8080/api/log/deleteAll   [token]
```

## Command line interface

Inside `commands` directory, there are some command line interface to make something automatic, like start, stop and update from git repository.

* **start**: it will kill current WebRemoteLog-Go process and start again
* **stop**: it will kill current WebRemoteLog-Go process
* **update**: it will update code from git, rebuild the service and restart the service for you

So if you want start your server, you can use `start` command to do it for you.

## Contributors

[Paulo Coutinho](http://www.pcoutinho.com) (Author)
[Gustavo Henrique](http://about.me/gustavohenrique)

## License

[MIT license](http://opensource.org/licenses/MIT)
