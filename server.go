package main

import (
	"github.com/gin-gonic/gin"
	"log"
)

var (
	Server *WebServer
)

type WebServer struct {
	DB     *Database
	Router *gin.Engine
}

func NewWebServer() *WebServer {
	router := gin.New()
	router.Use(gin.Recovery())

	server := WebServer{DB : new(Database), Router : router}
	return &server
}

func (s *WebServer) CreateRouter() {
	s.Router.Static("/static", "resources/static")

	{
		var controller HomeController
		controller.Register()
	}

	{
		var controller LogController
		controller.Register()
	}

	{
		var controller APIController
		controller.Register()
	}

	log.Println("Router creation : OK")
}

func (s *WebServer) CreateDatabase() {
	Server.DB.NewDatabase()
	log.Println("Database creation : OK")
}

func (s *WebServer) Start() {
	log.Println("Server started : OK")
	s.Router.Run(":8080")
}