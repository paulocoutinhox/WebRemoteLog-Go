package main

import (
	"github.com/gin-gonic/gin"
    "log"
)

func createRoutes() {
	router := gin.Default()
	router.Static("/static", "resources/static")	
	router.GET("/", index)
	log.Println("Router started : OK")
    router.Run(":8080")
}