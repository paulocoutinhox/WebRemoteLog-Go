package main

import (
	"github.com/gin-gonic/gin"
    "log"
    "net/http"
    "time"
)

func createRoutes() {
	router := gin.Default()
	router.Static("/static", "resources/static")	
	
	router.GET("/", homeIndex)
	router.GET("/log/index", logIndex)
	router.GET("/log/token", logToken)
	router.POST("/api/log/add", apiLogAdd)
	
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