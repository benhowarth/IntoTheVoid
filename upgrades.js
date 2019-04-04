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

newPossibleUpgrade("hpMax","#hpMax# (+max hp)",
function(){
	hpMax+=hpMaxIncrement
});


newPossibleUpgrade("skip","#skip# (+move to next sector)",
function(){
	sector++;
	//pursuedInSector=false;
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


		if(sector>2 && hpMax+hpMaxIncrement<=hpMaxMax){
				upgradesToChoose.push("hpMax")
		}


		if(sector>1){
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
			let up=possibleUpgrades[upgradeChoice]
			up.scrambleText()
			upgrades.push({displayText:up.getText(),upgradeRefIndex:upgradeChoice})
		}


		/*
		for(u=0;u<upgrades.length;u++){
			 upgrades[u].scrambleText()
			 upgrades[u].displayText=upgrades[u].getText()
		}
		*/


		//decide next sector stuff
		pursuedInSector=false
		let difficulty=Math.min(sector,50)/50
		if(Math.random()<0.2+(difficulty*0.8)){
			pursuedInSector=true
			pubText+=parseT(" #pursueWarning#")
		}
		spawnInterval=math.floor(spawnIntervalMax-(spawnIntervalMax*(Math.min(sector,50)/50)))
		enemyMax=1+math.ceil(enemyMaxMax*(Math.min(sector,50)/50))
		enemySpawnInterval=math.floor(enemySpawnIntervalMax-(enemySpawnIntervalMax*(Math.min(sector,50)/50)))
		//pursuedInSector=true
		//console.log("spawn interval now:"+spawnInterval)
}

function getUpgrade(id){
	if(upgrades[id]!=null && possibleUpgrades[upgrades[id].upgradeRefIndex]!=null){
		possibleUpgrades[upgrades[id].upgradeRefIndex].func()
		sector++
		sectorTimer=sectorTimerMax
		p.vel=Victor(-10,0)
		inControl=true
		inPub=false
		selectSFX.play()
		pubBG1SFX.setVolume(0.0,2)
		pubBG1SFX.stop(2.1)
	}

}

function setOffSmartBomb(){
	/*
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
	*/
	smartbombActive=false
	smartbombHappened=true
	smartbombSFX.play()
}

function checkAndDrawSmartbombExplosion(){
	let maxRad=Math.min(width,height)
	if(smartbombRad<maxRad){
		//console.log("smartbomb firing"+(smartbombRad/maxRad))
		smartbombRad+=15
		fill(0,255,0,150*(1-(smartbombRad/maxRad)))
		ellipse(p.pos.x,p.pos.y,smartbombRad*2,smartbombRad*2)


		for(k=0;k<obs.length;k++){
			ob=obs[k]
			if((ob.pos.clone().subtract(p.pos)).length()<smartbombRad){
				newExplosionCluster(ob.pos,ob.r*3)
				obs.splice(k,1)
				k--
			}
		}

		for(k=0;k<enemies.length;k++){
			enemy=enemies[k]
			if((enemy.pos.clone().subtract(p.pos)).length()<smartbombRad){
				newExplosionCluster(enemy.pos,enemy.r*3)
				enemies.splice(k,1)
				k--
			}
		}

	}else{
		//console.log("smartBomb over")
		smartbombRad=0
		smartbombHappened=false
	}
}
