package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
    "time"
    "log"
    "html/template"
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
    globalSession = getSession()    
	
	// outes
	router := gin.Default()
	router.Static("/static", "resources/static")	
	router.GET("/", index)
	log.Println("Router started : OK")
    router.Run(":8080")
}

func getSession() *mgo.Session {  
    s, err := mgo.Dial("mongodb://localhost")

    if err != nil {
        panic(err)
    }
	
	log.Println("Connected to database : OK")
	
    return s
}

func renderTemplate(w http.ResponseWriter, templateName string) {
    tmpl := template.Must(template.ParseFiles("resources/layout.html", "resources/" + templateName + ".html"))
    tmpl.ExecuteTemplate(w, "layout", nil)
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
