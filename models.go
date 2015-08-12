package main

import (
	"time"
	"gopkg.in/mgo.v2/bson"
)

type LogHistory struct {
	ID         bson.ObjectId `bson:"_id,omitempty"`
	Token      string        `bson:"token"`
	Type       string        `bson:"type"`
	Message    string        `bson:"message"`
	CreatedAt  time.Time     `bson:"createdAt"`
}
