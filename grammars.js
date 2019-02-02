window.onerror = function(msg, url, linenumber) { alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber); return true; }


grammarVar={
	pubNameAdj:["Hyper","Olde"],
	pubNameNoun:["Sprocket","Oil","Rock","Moon"],
	pub:["pub","bar"],
	pubName:["#pubNameNoun# and #pubNameNoun#","#pubNameAdj# #pubNameNoun#"],
	color:["red","blue"],
	physicalAdj:["#color#"],
	emotionalAdj:["jovial","angry"],
	someoneAdj:["#emotionalAdj#"],
	job:["detective","vendor","pilot"],
	species:["droid","cyborg","exomorph","daemon"],
	someone:["#someoneAdj.a# #species#","#job.a#"],
	somethingHappens:["the place is mostly empty, save for #someone# at the bar","the whole room erupts with raucous laughter as #someone# begins their encore"],
	pubIntro:["You enter the #name# and #somethingHappens#."],
	repair:["someone offers to repair your ship","you find a mechanic"],
	shield:["you get a shield","you have a shield"],
	smartbomb:["you get a smartbomb"],
	speed:["a mechanic offers to work on your engine"],
	skip:["#someone# offers you a hyperlight tow"]
}


grammar=tracery.createGrammar(grammarVar)

//alert(grammar.flatten("test"))
//alert(grammar.flatten("#repair#"))

function parseT(str){
	return grammar.flatten(str)
}