package main

import (
	"github.com/gin-gonic/gin"
    "log"
    "net/http"
    "time"
    "gopkg.in/mgo.v2/bson"
    //"fmt"
    //"encoding/json"
)

func createRoutes() {
	router := gin.Default()
	router.Static("/static", "resources/static")	
	
	router.GET("/", homeIndex)
	router.GET("/log/index", logIndex)
	router.GET("/log/token", logToken)
	router.POST("/api/log/add", apiLogAdd)
	router.GET("/api/log/list", apiLogList)
	
	log.Println("Router started : OK")
    router.Run(":8080")
}

func homeIndex(c *gin.Context) {
	renderTemplate(c.Writer, "home/index")
}

func logToken(c *gin.Context) {
	renderTemplate(c.Writer, "log/token")
}

func logIndex(c *gin.Context) {
	token := c.Query("token")
	
	if token == "" {
		c.Redirect(http.StatusMovedPermanently, "/log/token")
	}
	
	renderTemplate(c.Writer, "log/index")
}

func apiLogAdd(c *gin.Context) {
	s := globalSession.Clone()
	defer s.Close()
	
	coll := s.DB("WebRemoteLog").C("LogHistory")
	
	doc := &LogHistory{}
	doc.DebugToken  = c.PostForm("token")
	doc.LogType     = c.PostForm("type")
	doc.LogMessage  = c.PostForm("message")
	doc.CreatedAt   = time.Now()	
	coll.Insert(doc)
}

func apiLogList(c *gin.Context) {
	token := c.Query("token")
	
	s := globalSession.Clone()
	defer s.Close()
	
	coll := s.DB("WebRemoteLog").C("LogHistory")
	
	var result []LogHistory
	err := coll.Find(bson.M{"token": token}).Sort("-createdAt").All(&result)
	
    if err != nil {
        log.Print("Error on list LogHistory: ")
        log.Println(err)
    }
    
    //c.String(200, result)
    //fmt.Println("Results All: ", result) 
    
    //b, err := json.Marshal(result)
    c.JSON(200, result)
    //fmt.Println("Results All: ", b) 
    //c.String(200, b)
}