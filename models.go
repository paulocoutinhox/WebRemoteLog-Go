package main

import (
	"time"
	"gopkg.in/mgo.v2/bson"
)

type LogHistory struct {
	ID         bson.ObjectId `bson:"_id,omitempty"`
	DebugToken string        `bson:"debugToken"`
	LogType    string        `bson:"logType"`
	LogMessage string        `bson:"logMessage"`
	CreatedAt  time.Time     `bson:"createdAt"`
}
