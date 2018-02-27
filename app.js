const express = require('express');
const app = express();
app.use(express.static('public'));
const MongoClient = require('mongodb').MongoClient;
const util = require("util");
const ObjectID = require('mongodb').ObjectID;

/* on associe le moteur de vue au module «ejs» */
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs'); // générateur de template

const i18n = require('i18n');

let db


app.get('/:locals(en|fr)') , (req,res) => {
	res.cokkie('langueChoisie' , req.param.locale)
	res.setLocal(req.params.locale)
	res.render("accueil.ejs");
}

app.get("/" , function (req,res){
	res.render('accueil.ejs')
})