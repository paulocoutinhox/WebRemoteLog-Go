package main

import (
	"html/template"
	"net/http"
)

func renderTemplate(w http.ResponseWriter, templateName string) {
    tmpl := template.Must(template.ParseFiles("resources/layout.html", "resources/" + templateName + ".html"))
    tmpl.ExecuteTemplate(w, "layout", nil)
}