/*
 * Library
 */
var http = require('http');
var express = require('express');
var jade = require('jade');
var connect = require('connect');
var bodyparser = require('body-parser');

/*
 * Local
 */
var port = process.env.port || 1337;
var app = express();
app.set("views", __dirname + "/view");
app.set("view engine", "jade");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: false }));


app.route('/')
    .get(function (req, res){
        res.render('index',{title: "VL-Layout"})
    })
app.listen(port);