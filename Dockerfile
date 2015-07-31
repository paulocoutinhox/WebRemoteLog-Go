FROM ubuntu:14.04.2

RUN bash -c "apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv 7F0CEB10 \
  && echo 'deb http://repo.mongodb.org/apt/ubuntu '$(lsb_release -sc)'/mongodb-org/3.0 multiverse' | tee /etc/apt/sources.list.d/mongodb-org-3.0.list \
  && apt-get update \
  && apt-get install -y wget git mongodb-org \
  && wget https://storage.googleapis.com/golang/go1.4.2.linux-amd64.tar.gz \
  && tar xf go1.4.2.linux-amd64.tar.gz \
  && mv go /opt/ \
  && echo export GOPATH=/opt/gopkg >> ~/.bashrc \
  && echo export GOROOT=/opt/go >> ~/.bashrc \
  && echo 'export PATH=\$PATH:\$GOROOT/bin:\$GOPATH/bin' >> ~/.bashrc"

RUN mkdir -p /data/db; \
  echo "mongo WebRemoteLog --eval \"db.createCollection('LogHistory')\"" > /tmp/createdatabase.sh

ADD ./commands/install-go-deps.sh /tmp/install-go-deps.sh

ENV GOPATH=/opt/gopkg
ENV GOROOT=/opt/go

RUN bash -c ". ~/.bashrc \
  && sh /tmp/install-go-deps.sh"

EXPOSE 8080
EXPOSE 27017
