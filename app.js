const express = require('express');
const app = express();
app.use(express.static('public'));
const MongoClient = require('mongodb').MongoClient;
const util = require("util");
const ObjectID = require('mongodb').ObjectID;

/* on associe le moteur de vue au module «ejs» */
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

let cookieParser = require('cookie-parser')
app.use(cookieParser())


app.set('view engine', 'ejs'); // générateur de template
let db


MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081')
	})	
})

app.get('/accueil', function(req,res) {
	res.render('components/accueil.ejs')
})


app.get('/list', function (req, res) {
   var cursor = db.collection('adresse').find().toArray(function(err, resultat){
	if (err) return console.log(err)
 	console.log('util = ' + util.inspect(resultat));
	res.render('components/adresse.ejs', {adresses: resultat})
	}) 
})

// ====================== POUR AJOUTER
app.post('/ajouter', (req, res) => {
	console.log('req.body' + req.body)
	let oModif;
	 if (req.body['_id'] != '')
	 { 
		console.log('sauvegarde') 
		oModif = {
			"_id": ObjectID(req.body['_id']), 
			nom: req.body.nom,
			prenom:req.body.prenom, 
			telephone:req.body.telephone,
			courriel:req.body.courriel
	 	}
	 let util = require("util");

	 }
	 else
	 {
		 console.log('insert')
		 console.log(req.body)
		 oModif = {
		 nom: req.body.nom,
		 prenom:req.body.prenom, 
		 telephone:req.body.telephone,
		 courriel:req.body.courriel
	 	}
	 }
	 db.collection('adresse').save(oModif, (err, result) => {
	 if (err) return console.log(err)
	 console.log('sauvegarder dans la BD')
	 res.redirect('/list')
	 })
})

// =========== POUR DETRUIRE
app.get('/detruire/:id', (req, res) => {
	let id = req.params.id 
	let critere = ObjectID(req.params.id)

 db.collection('adresse').findOneAndDelete({"_id": critere}, (err, resultat) => {
	if (err) return console.log(err)
 		res.redirect('/list')
 	})
})

// =============== POUR TRIER
app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){
	ordre == 1 ? 'asc' : 'desc';

	//console.log(req.params.ordre);
	ordre = (req.params.ordre == 'asc' ? 'desc' : 'asc')
	 res.render('components/adresse.ejs', {adresses: resultat, cle, ordre })
	})
})

// ============ PEUPLER
app.get('/peupler', (req, res) => {

	let resultat = peupler_Json() ;

	//console.log("resultat = " + util.inspect(resultat));

		db.collection('adresse').insertMany(resultat, (err, result) => {
			if (err) return console.log(err) 
		})

	res.redirect('/list');
})

// =================vide la bdd
app.get('/vider', (req, res) => {
	db.collection('adresse').remove({}, (err, resultat) => {
		if (err) return console.log(err)
		res.redirect('/list')  // redirige vers la route qui affiche la collection
	})
})

// =============== recherche
app.post('/recherche', (req, res) => {
	
  		db.collection("adresse").find({ $or:[
  			{'prenom' : { '$regex' : req.body.elemRecherche, '$options' : 'i' }}, 
  			{'nom' : { '$regex' : req.body.elemRecherche, '$options' : 'i' }},
  			{'courriel' : { '$regex' : req.body.elemRecherche, '$options' : 'i' }},
  			{'telephone' : { '$regex' : (req.body.elemRecherche).replace(/[^0-9]/g, ''), '$options' : 'i' }},

  		]}).toArray(function(err, resultat) {
   		 if (err) throw err;
    		console.log(resultat);
    	 res.render('components/adresse.ejs', {adresses: resultat})
  });
}) 

// ================= afficher un utilisateur
app.get('/afficherUtilisateur/:id', (req, res) => {
	let id = req.params.id 
	let critere = ObjectID(req.params.id)

 db.collection('adresse').findOne({"_id": critere}, (err, resultat) => {

 	console.log(resultat);
 	res.render('components/profilpage.ejs', {personne: resultat})
	
	if (err) return console.log(err)
 		//res.redirect('/list')
 	})
	//res.render('components/profilpage.ejs', {adresses: resultat})
	
})

//changement de langue

const i18n = require('i18n');
app.use(i18n.init);

i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' })


app.use(i18n.init);

app.get('/:locales(en|fr)') , (req,res) => {
	res.cokkie('langueChoisie' , req.param.locale)
	res.setLocal(req.params.locale)
	res.render("accueil.ejs");
}

app.get("/" , function (req,res){
	res.render('accueil.ejs')
	console.log('Cookies: ', req.cookies)
	console.log('Cookies: ', req.cookies.langueChoisie)
})

app.get('/fr', function(req, res){
  let bienvenue = res.__('Hello');
});

app.get('/en', (req, res) => {
// 'en' est enregistré comme langue
res.setLocale('en')
// on en profite pour sauver la langue dans un cookie
res.cookie('moncookie', 'en');
});
 
app.listen(8080)