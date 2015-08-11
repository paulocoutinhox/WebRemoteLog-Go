package main

import (
	"log"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
	"strings"
)

// Home Controller
type HomeController struct {}

func (s *HomeController) Register() {
	log.Printf("Memory address of server: %v", &Server)
	Server.Router.GET("/", s.HomeIndex)
	log.Println("HomeController Register : OK")
}

func (s *HomeController) HomeIndex(c *gin.Context) {
	renderTemplate(c.Writer, "home/index", nil)
}

// Log Controller
type LogController struct {}

func (s *LogController) Register() {
	Server.Router.GET("/log/index", s.LogIndex)
	Server.Router.GET("/log/token", s.LogToken)
	log.Println("LogController Register : OK")
}

func (s *LogController) LogToken(c *gin.Context) {
	renderTemplate(c.Writer, "log/token", nil)
}

func (s *LogController) LogIndex(c *gin.Context) {
	token := c.Query("token")

	if token == "" {
		c.Redirect(http.StatusMovedPermanently, "/log/token")
	}

	renderTemplate(c.Writer, "log/index", map[string]string{"ContainerClass": "container-fluid", "WrapClass": "wrap-log", "FooterClass": "no-footer", "ShowLogMenu": "1"})
}

// API Controller
type APIController struct {}

func (s *APIController) Register() {
	Server.Router.POST("/api/log/add", s.APILogAdd)
	Server.Router.GET("/api/log/list", s.APILogList)
	Server.Router.GET("/api/log/deleteAll", s.APILogDeleteAll)
	log.Println("APIController Register : OK")
}

func (s *APIController) APILogAdd(c *gin.Context) {
	session := Server.DB.Session.Clone()
	defer session.Close()

	coll := session.DB("WebRemoteLog").C("LogHistory")

	doc := &LogHistory{}
	doc.DebugToken = c.PostForm("token")
	doc.LogType    = c.PostForm("type")
	doc.LogMessage = c.PostForm("message")
	doc.CreatedAt  = time.Now()

	strings.ToLower(strings.TrimSpace(doc.LogType))

	coll.Insert(doc)
}

func (s *APIController) APILogList(c *gin.Context) {
	logDebugToken   := c.Query("token")
	logCreatedAt, _ := time.Parse("2006-01-02T15:04:05.999", c.Query("created_at"))
	filterMessage   := c.Query("filter-message")

	session := Server.DB.Session.Clone()
	defer session.Close()

	coll := session.DB("WebRemoteLog").C("LogHistory")

	var results []LogHistory
	var conditions = bson.M{}

	conditions["debugToken"] = logDebugToken

	if filterMessage == "" {
		conditions["createdAt"]  = bson.M{"$gt": logCreatedAt}
	} else {
		conditions["logMessage"] = bson.RegEx{Pattern: filterMessage, Options: "i"}
	}

	err := coll.Find(conditions).Sort("createdAt").All(&results)

	if err != nil {
		log.Print("Error on list LogHistory: ")
		log.Println(err)
	}

	c.JSON(200, results)
}

func (s *APIController) APILogDeleteAll(c *gin.Context) {
	logDebugToken := c.Query("token")

	session := Server.DB.Session.Clone()
	defer session.Close()

	coll := session.DB("WebRemoteLog").C("LogHistory")

	var result []LogHistory
	_, err := coll.RemoveAll(bson.M{
		"debugToken": logDebugToken,
	})

	if err != nil {
		log.Print("Error on delete all LogHistory: ")
		log.Println(err)
	}

	c.JSON(200, result)
}

