package main

import (
	//"net/http"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
    "time"
    "log"
)

type LogHistory struct {
    id          bson.ObjectId `bson:"_id,omitempty"`
    debugToken  string        `bson:"debugToken"`
    logType     string        `bson:"logType"`
    logMessage  string        `bson:"logMessage"`
    createdAt   time.Time     `bson:"createdAt"`
}

var (
	globalSession *mgo.Session
)

func main() {
    router := gin.Default()
	
	/*
    // This handler will match /user/john but will not match neither /user/ or /user
    router.GET("/user/:name", func(c *gin.Context) {
        name := c.Param("name")
        c.String(http.StatusOK, "Hello %s", name)
    })

    // However, this one will match /user/john/ and also /user/john/send
    // If no other routers match /user/john, it will redirect to /user/join/
    router.GET("/user/:name/*action", func(c *gin.Context) {
        name := c.Param("name")
        action := c.Param("action")
        message := name + " is " + action
        c.String(http.StatusOK, message)
    })
    */
    
    // conexão com o banco
    globalSession = getSession()
    
    defer globalSession.Close()
	globalSession.SetMode(mgo.Monotonic, true)

	// rotas
	router.Static("/static", "resources/static")
	router.LoadHTMLGlob("resources/*.html")

	router.GET("/", index)

    router.Run(":8080")
    
    log.Fatal("FOI 22!")
}

func getSession() *mgo.Session {  
    s, err := mgo.Dial("mongodb://localhost")

    if err != nil {
        panic(err)
    }

    return s
}

func index(c *gin.Context) {
	s := globalSession.Clone()
	defer s.Close()
	
	coll := s.DB("WebRemoteLog").C("log_history")
	
	doc := &LogHistory{}
	doc.id          = bson.NewObjectId()
	doc.debugToken  = "token-teste-123"
	doc.logType     = "error"
	doc.logMessage  = "sjhdsdsadjshdkjsahd jsahdjksahdkjsahd sdjsahdjkashdjkshd sjkahjkahdkjshdksjhdk sdjksdhakjhdkashdksa sadkhskjdhskdjhskd sd sdsjkadhsakjdhaksdh"
	doc.createdAt   = time.Now()
	
	coll.Insert(doc)
	
	c.HTML(200, "index.html", nil)
}