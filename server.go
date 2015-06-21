package main

import (
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
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

var (
	globalSession *mgo.Session
)

func main() {
    // database connection
    createConnection()
	
	// routes
	createRoutes()
}

func index(c *gin.Context) {
	s := globalSession.Clone()
	defer s.Close()
	
	coll := s.DB("WebRemoteLog").C("LogHistory")
	
	doc := &LogHistory{}
	doc.DebugToken  = "token-teste-123"
	doc.LogType     = "error"
	doc.LogMessage  = "sjhdsdsadjshdkjsahd jsahdjksahdkjsahd sdjsahdjkashdjkshd sjkahjkahdkjshdksjhdk sdjksdhakjhdkashdksa sadkhskjdhskdjhskd sd sdsjkadhsakjdhaksdh"
	doc.CreatedAt   = time.Now()	
	coll.Insert(doc)
	
	renderTemplate(c.Writer, "index")
}
