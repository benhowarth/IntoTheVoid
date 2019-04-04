//window.onerror = function(msg, url, linenumber) { alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber); return true; }


grammarVar={
	pubNameAdj:["Olde","King's","Queen's"],
	pubNameAdjSpace:["Hyper","Mecha","Cyber","Space"],
	pubNameNoun:["Arms","Head","Lord","Lady","Plough"],
	pubNameNounSpace:["Sprocket","Oil","Rock","Moon","Dust"],
	pub:["pub","bar"],
	pubName:["#pubNameNounSpace# and #pubNameNoun#","#pubNameNounSpace# and #pubNameNounSpace#","#pubNameNoun# and #pubNameNounSpace#","#pubNameAdj# #pubNameNounSpace#","#pubNameAdjSpace# #pubNameNoun#"],
	color:["red","blue"],
	physicalAdj:["#color#","old"],
	emotionalAdj:["jovial","angry"],
	someoneAdj:["#emotionalAdj#"],
	job:["detective","vendor","pilot"],
	shooter:["soldier","rebel federation guard","assassin"],
	engi:["engineer","ship technician"],
	species:["droid","cyborg","exomorph","daemon"],
	someone:["#someoneAdj.a# #species#","#job.a#"],
	thingToDoInBar:["begins their encore","downs their pint"],
	somethingHappens:["the place is mostly empty, save for #someone# at the bar","the whole room erupts with raucous laughter as #someone# #thingToDoInBar#"],
	pubIntro:["You enter the #name# and #somethingHappens#."],
	repair:["someone offers to repair your ship","you find a mechanic"],
	shield:["you get a shield","you have a shield"],
	smartbomb:["you get a smartbomb"],
	speed:["a mechanic offers to work on your engine"],
	skip:["#someone# offers you a hyperlight tow"],
	crash:["#someone# trades you a crash field"],
	crashRad:["#someone# upgrades your crash field radius"],
	hpMax:["you find someone to work on your hull"],
	shoot:["#shooter.a# offers their services"],
	shootRad:["#engi.a# says they can upgrade your weapon targeting system"],
	shootSpeed:["#shooter.a# says they can get faster torpedoes"],
	shootTimer:["#engi.a# offers to upgrade your weapon coolant system"],
	pursueWarning:["You notice a federation guard and they see you."]
}


grammar=tracery.createGrammar(grammarVar)

//alert(grammar.flatten("test"))
//alert(grammar.flatten("#repair#"))

function parseT(str){
	return grammar.flatten(str)
}
