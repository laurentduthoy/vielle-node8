'use strick';

const peupler = require("./modules/peupler");
const tabPrenom;
const tabNom;
const tabCourriel;
const tabCourrielExt;
const tabCourrielSepatation;
const tabTelephone;

const peupler_Json = () => {
	let tabPersonnes = [];
	let tabUnePersonne = [];
	let position = 0;
	let nom;
	let prenom;
	let courriel;
	let courrielExt;
	let courrielSepatation;
	let ntelephone3;
	let ntelephone4;

	for(i=0 ; i<30 ; i++){
		tabPersonnes = [];
		nom = "";
		prenom = "";
		courriel = "";
		courrielExt = "";
		courrielSepatation = "";
		telephone = "";
		ntelephone3 ="";
		ntelephone4 = "";
		tabNumero = ["0","1","2","3","4","5","6","7","8","9"];

		
		//prénom
		position = Math.floor(Math.random()*tabPrenom.length);
		prenom = tabPrenom[position];
		tabPersonnes.push(prenom);

		//nom
		position = Math.floor(Math.random()*tabNom.length);
		nom = tabNom[position];
		tabPersonnes.push(nom);

		//courriel
		position = Math.floor(Math.random()*tabCourriel.length);
		courriel = tabCourriel[position];

		position = Math.floor(Math.random()*tabCourrielSepatation.length);
		courrielSepatation =  tabCourrielSepatation[position];

		position = Math.floor(Math.random()*tabCourrielExt.length);
		courrielExt =  tabCourrielExt[position];

		tabPersonnes.push(prenom+courrielSepatation+nom+courriel+courrielExt);

		//téléphone
		position = Math.floor(Math.random()*tabTelephone.length);
		telephone =  telephone[position];

		for(i=0 ; i<3 ; i++){
			nb = Math.floor(Math.random()*3);
			ntelephone3 += tabNumero[nb];
		}


		for(n=0 ; n<3 ; n++){
			nb = Math.floor(Math.random()*4);
			ntelephone4 += tabNumero[nb];
		}
		
		tabPersonnes.push("("+telephone+")"+"-"+ntelephone3+"-"+ntelephone4);

	}

}

