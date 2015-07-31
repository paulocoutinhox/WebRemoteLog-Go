clean:
	@docker rm -f webremotelog > /dev/null 2> /dev/null || true

build: clean
	@docker build -t=webremotelog-go .

container:
	@docker run -d -p 8080:8080 -w /app -e GOROOT=/opt/go -e GOPATH=/opt/gopkg --name webremotelog -v ${PWD}:/app webremotelog-go mongod

compile:
	@docker exec webremotelog sh /app/commands/install-go-deps.sh
	@docker exec webremotelog bash -c "cd /app && /opt/go/bin/go build -o WebRemoteLog-Go-Docker"

run:
	@docker exec -ti webremotelog sh /tmp/createdatabase.sh
	@docker exec -ti webremotelog /app/WebRemoteLog-Go-Docker

enter:
	@docker exec -ti webremotelog bash

