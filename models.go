package main

import (
    "gopkg.in/mgo.v2/bson"
    "time"
)

type LogHistory struct {
    ID          bson.ObjectId `bson:"_id,omitempty"`
    DebugToken  string        `bson:"debugToken"`
    LogType     string        `bson:"logType"`
    LogMessage  string        `bson:"logMessage"`
    CreatedAt   time.Time     `bson:"createdAt"`
}