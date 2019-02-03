
upgrades=[]
class Upgrade{
	constructor(text,func){
		this.text=text
		this.func=func
		this.parsedText=parseT(this.text)
	}
	scrambleText(){
			this.parsedText=parseT(this.text)
	}
	getText(){
			//this.scrambleText()
			return this.parsedText
	}
}
possibleUpgrades={}
function newPossibleUpgrade(id,text,func){
	possibleUpgrades[id]=new Upgrade(text,func)
}
newPossibleUpgrade("speed","#speed# (+speed)",
function(){
	speed+=speedIncrement
});

newPossibleUpgrade("smartbomb","#smartbomb# (+smartbomb)",
function(){
	smartbombActive=true
});

newPossibleUpgrade("shield","#shield# (+shield)",
function(){
	shieldActive=true
});

newPossibleUpgrade("repair","#repair# (+full repair)",
function(){
	hp=hpMax
});

newPossibleUpgrade("skip","#skip# (+move to next sector)",
function(){
	sector++;
	pursuedInSector=false;
});

newPossibleUpgrade("crash","#crash# (+enemies crash when near you)",
function(){
	crashteroidActive=true
});

newPossibleUpgrade("crashRad","#crashRad# (+crash field radius)",
function(){
	crashteroidRad=crashteroidRad+crashteroidRadIncrement
});


newPossibleUpgrade("shoot","#shoot# (+shoot at enemies)",
function(){
	shootActive=true
});

newPossibleUpgrade("shootRad","#shootRad# (+shooting range)",
function(){
	shootRad=shootRad+shootRadIncrement
});

newPossibleUpgrade("shootSpeed","#shootSpeed# (+shooting range)",
function(){
	shootSpeed=shootSpeed+shootSpeedIncrement
});

newPossibleUpgrade("shootTimer","#shootTimer# (-shooting timer)",
function(){
	shootTimerMax=shootTimerMax-shootTimerMaxIncrement
});


function refreshUpgrades(){
	//alert("new upgrades")
/*	upgrades[0]=possibleUpgrades["speed"]
		upgrades[1]=possibleUpgrades["smartbomb"]
		upgrades[2]=possibleUpgrades["shield"]
		upgrades[3]=possibleUpgrades["repair"]
		*/
		//get upgrades possible for sector
		upgradesToChoose=["repair","skip"]



		if(sector>1 && !shieldActive){
			upgradesToChoose.push("shield")
		}
		if(sector>2 && speed+speedIncrement<=speedMax){
			upgradesToChoose.push("speed")
		}
		if(sector>3){
	upgradesToChoose.push("smartbomb")
		}

		if(sector>4){
			upgradesToChoose.push("crash")
		}
		if(sector>4 && crashteroidRad+crashteroidRadIncrement<=crashteroidRadMax){
			upgradesToChoose.push("crashRad")
		}
		if(sector>5){
			upgradesToChoose.push("shoot")
		}
		if(sector>6 && shootRad+shootRadIncrement<=shootRadMax){
			upgradesToChoose.push("shootRad")
		}
		if(sector>6 && shootSpeed+shootSpeedIncrement<=shootSpeedMax){
			upgradesToChoose.push("shootSpeed")
		}

		if(sector>6 && shootTimerMax-shootTimerMaxIncrement>=shootTimerMaxMin){
			upgradesToChoose.push("shootTimer")
		}
		upgrades=[]


		while(upgrades.length<4){
			//pick random upgrade from list
			upgradeIndex=Math.floor(Math.random()*upgradesToChoose.length)
			upgradeChoice=upgradesToChoose[upgradeIndex]
			//splice out unless is repair
			if(upgradeChoice!="repair"){
				upgradesToChoose.splice(upgradeIndex,1)
			}

			upgrades.push(possibleUpgrades[upgradeChoice])
		}



		for(u=0;u<upgrades.length;u++){
			 upgrades[u].scrambleText()
			 upgrades[u].displayText=upgrades[u].getText()
		}

		//decide next sector stuff
		pursuedInSector=false
		if(Math.random()>0.5){
			pursuedInSector=true
			pubText+=parseT(" #pursueWarning#")
		}
}

function getUpgrade(id){
	upgrades[id].func()
	sector++
	sectorTimer=sectorTimerMax
	p.vel=Victor(-10,0)
	inControl=true
	inPub=false

}

function setOffSmartBomb(){
	for(k=0;k<obs.length;k++){
		ob=obs[k]
		//alert(JSON.stringify(ob))
		newExplosionCluster(ob.pos,ob.r*3)
	}
	obs=[]

	for(k=0;k<enemies.length;k++){
		enemy=enemies[k]
		newExplosionCluster(enemy.pos,enemy.r*3)
	}
	enemies=[]
	smartbombActive=false
	smartbombHappened=true
}
