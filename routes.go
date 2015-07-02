package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
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
	renderTemplate(c.Writer, "home/index", nil)
}

func logToken(c *gin.Context) {
	renderTemplate(c.Writer, "log/token", nil)
}

func logIndex(c *gin.Context) {
	token := c.Query("token")

	if token == "" {
		c.Redirect(http.StatusMovedPermanently, "/log/token")
	}

	renderTemplate(c.Writer, "log/index", map[string]string{"ContainerClass": "container-fluid"})
}

func apiLogAdd(c *gin.Context) {
	s := globalSession.Clone()
	defer s.Close()

	coll := s.DB("WebRemoteLog").C("LogHistory")

	doc := &LogHistory{}
	doc.DebugToken = c.PostForm("token")
	doc.LogType = c.PostForm("type")
	doc.LogMessage = c.PostForm("message")
	doc.CreatedAt = time.Now()
	coll.Insert(doc)
}

func apiLogList(c *gin.Context) {
	logDebugToken := c.Query("token")
	logCreatedAt, err := time.Parse("2006-01-02T15:04:05.999", c.Query("created_at"))

	s := globalSession.Clone()
	defer s.Close()

	coll := s.DB("WebRemoteLog").C("LogHistory")

	var result []LogHistory
	err = coll.Find(bson.M{
		"debugToken": logDebugToken,
		"createdAt": bson.M{
			"$gt": logCreatedAt,
		},
	}).Sort("createdAt").All(&result)

	if err != nil {
		log.Print("Error on list LogHistory: ")
		log.Println(err)
	}

	c.JSON(200, result)
}
