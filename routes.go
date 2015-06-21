package main

import (
	"github.com/gin-gonic/gin"
    "log"
    "time"
)

func createRoutes() {
	router := gin.Default()
	router.Static("/static", "resources/static")	
	router.GET("/", index)
	log.Println("Router started : OK")
    router.Run(":8080")
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