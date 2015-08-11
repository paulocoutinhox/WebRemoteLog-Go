package main

import (
	"log"
	"gopkg.in/mgo.v2"
)

type Database struct {
	Session *mgo.Session
}

func (s *Database) NewDatabase() {
	s.Session = s.NewSession()
	s.CreateCollections()
	s.CreateIndexes()
}

func (s *Database) NewSession() *mgo.Session {
	session, err := mgo.Dial("mongodb://localhost")

	if err != nil {
		panic(err)
	}

	log.Println("Connected to database : OK")

	return session
}

func (s *Database) CreateCollections() {
	s.Session.DB("WebRemoteLog").C("LogHistory").Create(&mgo.CollectionInfo{DisableIdIndex: false, ForceIdIndex: true})
	log.Println("Collections creation : OK")
}

func (s *Database) CreateIndexes() {
	s.Session.DB("WebRemoteLog").C("LogHistory").EnsureIndex(mgo.Index{Key: []string{"debugToken"}, Unique: false, DropDups: true, Background: false, Sparse: true})
	s.Session.DB("WebRemoteLog").C("LogHistory").EnsureIndex(mgo.Index{Key: []string{"logType"}, Unique: false, DropDups: true, Background: false, Sparse: true})
	s.Session.DB("WebRemoteLog").C("LogHistory").EnsureIndex(mgo.Index{Key: []string{"createdAt"}, Unique: false, DropDups: true, Background: false, Sparse: true})
	log.Println("Indexes creation : OK")
}