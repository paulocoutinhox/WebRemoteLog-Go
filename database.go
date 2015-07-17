package main

import (
	"log"
	"gopkg.in/mgo.v2"
)

var (
	globalSession *mgo.Session
)

func getSession() *mgo.Session {
	s, err := mgo.Dial("mongodb://localhost")
	
	if err != nil {
		panic(err)
	}

	log.Println("Connected to database : OK")

	return s
}

func createConnection() {
	globalSession = getSession()
}
