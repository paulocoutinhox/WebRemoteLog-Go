package main

func main() {
	Server = NewWebServer()
	Server.CreateDatabase()
	Server.CreateRouter()
	Server.Start()
}
