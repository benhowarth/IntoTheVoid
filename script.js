document.addEventListener("touchstart",function(e){
  e.preventDefault();
	touchStartX=e.touches[0].clientX;
 touchStartY=e.touches[0].clientY;
 touchStart=Victor(touchStartX,touchStartY)
 touching=true;

});

document.addEventListener("touchend",function(e){
  touching=false;

});

function preload(){
	f1=loadFont("img/saved_by_zero.ttf")
}

p={
	pos:Victor(0,0),
	vel:Victor(0,0)
	};
	touching=false
m=Victor(10,10);

obs=[]
function newOb(_pos,_vel,_r){
	_ob={
		pos:_pos,
		vel:_vel,
		r:_r
		}
		
	obs.push(_ob)
}

function newAsteroid(){
	obR=math.random(10,30)
obPos=Victor(0,0)	
obVel=Victor(math.random(0.5,5),math.random(0.5,5))
	if(math.random()>0.5){
			_obPos=Victor(width,0)
			_obVel=Victor(math.random(-5,-0.5),math.random(0.5,5))
		}
	newOb(obPos,obVel,obR)
}


enemies=[]
class Enemy{
	constructor(_followSpeed){
		this.pos=Victor(math.random()*width,height+20)
		this.followSpeed=Victor(2,1)
		//this.followSpeed=Victor(5,3)
		this.hpMax=30
		this.hp=this.hpMax
		this.vel=Victor(0,0)
		this.dmg=10
		this.r=20
		this.minDist=0
		this.tpos=p.pos.clone()
		this.crashteroid=false
		
	}
	draw(){
		rectMode(CENTER)
		fill(255,0,0)
	if(this.pos.y>height){
		rect(this.pos.x,height-30,this.r*sin(time*0.3),this.r*sin(time*0.3))
	}else{
			//ellipse(this.pos.x,this.pos.y,this.r,this.r)
			translate(this.pos.x,this.pos.y)
			rotate(this.toPlayer.angle())
			
			rect(0,0,this.r,this.r/2)
			
			rotate(-this.toPlayer.angle())
	translate(-this.pos.x,-this.pos.y)
			
		stroke(255,0,0)
		noFill()
	rectMode(CORNER)
rect(this.pos.x-10,this.pos.y-20,20,5)
		
		noStroke()
		fill(255,0,0)
		
		rect(this.pos.x-10,this.pos.y-20,20*this.hp/this.hpMax,5)
		}
		
		
		
	}
	
	
	update(){
		//this.pos.x+=(p.pos.x-this.pos.x)/this.followSpeed
		if(this.crashteroid){
			if(obs.length>0){
				this.tpos=obs[0].pos.clone()
			}
		}else{
			this.tpos=p.pos
		}
	if(sectorTimer>0 && !dead){
		
		this.toPlayer=this.tpos.clone().subtract(this.pos)
		
		if(this.toPlayer.length()>this.minDist || this.crashteroid){	this.vel=this.toPlayer.norm().multiply(this.followSpeed)
		}else{
			this.vel=this.vel.multiply(Victor(0.6,0.6))
		}
	}else{
		//this.vel.multiplyX(0.5);
		this.vel.add(Victor(0,0.4))
	
	}
	//this.vel=this.vel.multiply(Victor(0.999,0.999))
		this.pos=this.pos.add(this.vel)
		
		
	}
}



function newEnemy(){
	enemies.push(new Enemy(Victor(2,1)))
}

trails=[]
function newTrail(_pos){
	trails.push(
	{
		pos:_pos,
		age:0
	}
	)
}


explosionAgeMax=10
explosionAgeStartMax=4
explosionClusterSize=20
explosionClusterMaxNo=6
explosions=[]
function newExplosion(_pos,_size){
	explosions.push(
	{
		pos:_pos,
		age:0,
		size:_size,
		fill:color(255,100,100)
	}
	)
}

function newExplosionCluster(_pos,_size){
	clusterNo=(Math.random()*explosionClusterMaxNo)+1
	clusterNo=explosionClusterMaxNo
	for(ec=0;ec<clusterNo;ec++){
		 //alert(_pos.toString())
			curPos=_pos.clone()
			curPos.add(Victor(Math.random(-explosionClusterSize/2,explosionClusterSize/2),Math.random(-explosionClusterSize/2,explosionClusterSize/2)))
			//alert(curPos.toString())
			newExplosion(curPos.clone(),_size)
	}
}

function drawExplosions(){
	for(e=0;e<explosions.length;e++){
		 //alert(JSON.stringify(explosions[e]))
		 explosions[e].age++
		 ex=explosions[e]
		 exRad=(1-(ex.age/explosionAgeMax))*ex.size
		 fill(ex.fill)
ellipse(ex.pos.x,ex.pos.y,exRad,exRad)
   
		 if(ex.age>explosionAgeMax){
		 	 explosions.splice(e,1)
		 	 e--
		 }
	}
}

//TODO more interesting bg
class BgColorFilter{
	constructor(_col,_colMult,_minVal,_maxVal,_rangeMult,_timingMult,_minY,_maxY){
			this.color=_col
			//how much to mix the color
			this.colorMult=_colMult
			//min and max noise value to capture
			this.min=_minVal
			this.max=_maxVal
			//pulse range
			this.rangeMult=_rangeMult
			//how much to multiply time before sin func
			this.timingMult=_timingMult
			
			this.minY=_minY
			this.maxY=_maxY
	}
	filterColor(_noiseVal,_color,colorIndex,yVal){
			
			let _newColor=color(_color.r,_color.g,_color.b)
			let rangeShift=sin(this.timingMult*time)*this.rangeMult
			if(yVal>this.minY && yVal<this.maxY){
			if(_noiseVal<this.max-rangeShift && _noiseVal>this.min+rangeShift){
			_newColor=lerpColor(_color,this.color,this.colorMult/(colorIndex+1))
			//_newColor=color(0,0,255)
			}else{
				_newColor	=lerpColor(_newColor,color(0),0.5)
					_newColor=_color
					//_newColor=color(0)
				}
				}
			return _newColor
	}
}

bgColorFilters=[]



pubY=-100
bgPointRad=19
bgMoveSpeed=2
bgOffset=0
function drawBG(){
	//if(!dead && inControl){
		if(pubY<height/2 || sectorTimer>0){
	bgOffset+=bgMoveSpeed
	}
	parallaxOffset=((p.pos.y/height)-0.5)*100
	//blendMode(LIGHTEST)
	yOffset=bgOffset%(bgPointRad)
	yOffset=0
	
	
	for(y=0;y<height;y+=bgPointRad){
		for(x=0;x<width;x+=bgPointRad){
			noiseVal=noise(x*noiseScale,(y-bgOffset+parallaxOffset)*noiseScale)
			
			//stroke(255)
			
			//ellipse(x,y,bgPointRad*1.5,bgPointRad*1.5)
			noiseCol=color(noiseVal*255)
			pixelCol=noiseCol
			for(c=0;c<bgColorFilters.length;c++){
				pixelCol=bgColorFilters[c].filterColor(noiseVal,pixelCol,c,bgOffset)
			}
			
		
			//if(noiseVal>80){
			fill(pixelCol)
			rect(x,y+yOffset,bgPointRad,bgPointRad)
		 //}
		
		}
		
	}
	
	//blendMode(NORMAL)
}

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
			return this.parsedText
	}
}
possibleUpgrades={}
function newPossibleUpgrade(id,text,func){
	possibleUpgrades[id]=new Upgrade(text,func)
}
newPossibleUpgrade("speed","#speed#\n(+speed)",
	function(){
		speed+=0.3
		
		});
		
		newPossibleUpgrade("smartbomb","#smartbomb#\n(+smartbomb)",
	function(){
		smartbombActive=true
		
		});
		
		newPossibleUpgrade("shield","#shield#\n(+shield)",
	function(){
		shieldActive=true
		});
		
		newPossibleUpgrade("repair","#repair#\n(+full repair)",
	function(){
		hp=hpMax
		
		});
		
		newPossibleUpgrade("skip","#skip#\n(+move to next sector)",
	function(){
		sector++;
		
		});
		
newPossibleUpgrade("crash","#crash#\n(+enemies crash)",
	function(){
		crashteroidActive=true
		
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
		
		
		
		if(sector>1){
			upgradesToChoose.push("shield")
		}
		if(sector>2){
			upgradesToChoose.push("speed")
		}
		if(sector>3){
	upgradesToChoose.push("smartbomb")
		}
		
		if(sector>=0){
			upgradesToChoose.push("crash")
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
			pubText+="\nYou will be pursued."
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


function takeDamage(dmg){
	if(hp-dmg<=0){
		dead=true
		hp=0
		inControl=false
	}else{
		hp-=dmg
	}
}

function setup(){
	ratio = window.devicePixelRatio || 1;
  w = screen.width * ratio;
  h = screen.height * ratio;
  w=window.innerWidth;
  h=window.innerHeight;
  createCanvas(w,h)
  noSmooth()
	p.pos=Victor(width/2,height/2)
	background(0);
	frameRate(60);
	speed=1;
	friction=0.97;
	pDmg=5
	smartbombActive=false
	smartbombHappened=false
	shieldActive=false
	crashteroidActive=false
	crashteroidRad=80
	shootActive=true
	shootTargetId=null
	shootTargetIdOld=null
	shootTimerMax=10
	shootToTarget=Victor(null,null)
	shootRad=300
	shootSpeed=3
	shootTimer=shootTimerMax
	
	
	hpMax=100
	hpMax=100000
	hp=hpMax
	dead=false
	rectMode(CENTER)
	time=0
	spawnInterval=50
	touchStart=p.pos.clone()
	velDampening=0.07;
	trailAgeMax=35;
	trailSizeMax=15;
	trailInterval=3;
	
	
	sector=0;
	sectorTimerMax=500
	sectorTimer=sectorTimerMax
	inControl=true
	pubSpawned=false
	inPub=false
	pubName=parseT("#pubName#")
	
	pursuedInSector=false
	
	noiseScale=0.01
noiseDetail(5,0.25)

	bgColorFilters.push(new BgColorFilter(color(255,150,150),0.25,0.5,0.8,0.03,0.03,0,10000))
	bgColorFilters.push(new BgColorFilter(color(150,255,150),0.4,0.1,0.5,0.04,0.025,0,100))
	bgColorFilters.push(new BgColorFilter(color(0),1.0,0.0,0.2,0.02,0.05,0,100000))
	 
}

function draw(){
	textFont(f1)
	textSize(10)
	rectMode(CENTER)
	time+=1
	if(!dead){
		sectorTimer--;
	}
	
	if(sectorTimer>0){
	if(/*pursuedInSector &&*/ enemies.length<4){
		newEnemy()
	}
	if(time%spawnInterval==0){
		newAsteroid()
		if(spawnInterval>5){spawnInterval--}
	}
	if(pubSpawned){
		pubY+=4
		if(pubY>height+100){
			pubSpawned=false
			pubY=-100
			pubName=parseT("#pubName#")
		}
	}
	}else{
		if(!pubSpawned){
			pubSpawned=true
			pubY=-100;
		}else{
			//update pub
			if(pubY<height/2){
			  pubY++;
			}
		}
	}
	
	
	fill(0)
	noStroke()
	rect(width/2,height/2,width,height)
	drawBG()
	
	//fill(255)
	//draw trails
	for(i=0;i<trails.length;i++){
		trails[i].age++
		agePerc=trails[i].age/trailAgeMax
		fill(255,200,200,255*(1-agePerc))
		trailRad=(1-agePerc)*trailSizeMax
		ellipse(trails[i].pos.x,trails[i].pos.y,trailRad,trailRad)
		if(trails[i].age>trailAgeMax){
			trails.splice(i,1)
			i--
		}
	}
	
	fill(255)
	m=Victor(mouseX,mouseY);
//fullDir=	m.clone().subtract(p.pos)
fullDir=	m.clone().subtract(touchStart).multiply(Victor(velDampening,velDampening))
dir=fullDir.clone().norm()
	
	if(touching && fullDir.length()>0 &&inControl){
		if(time%trailInterval==0){
			
			//alert(trails.length)
			trailPos=p.pos.clone()
			trailPos.x=trailPos.x-cos(pAng)*5
			trailPos.y=trailPos.y-sin(pAng)*8
			newTrail(trailPos)
		}
		//speedVec=Victor(speed/fullDir.length,speed/fullDir.length)
		speedVec=Victor(speed,speed)
			//p.vel=dir.multiply(speedVec);
			p.vel=fullDir.multiply(speedVec)
		}
	
	p.vel.multiply(Victor(friction,friction));
	if(!touching){
	if(p.pos.x==0 || p.pos.x==width){
		p.vel.invertX()
	}
	if(p.pos.y==0 || p.pos.y==height){
		p.vel.invertY()
	}
	}
	p.pos.add(p.vel)
	//manually clamp pos
	if(p.pos.x<0){p.pos.x=0}
	else if(p.pos.x>width){p.pos.x=width}
	if(p.pos.y<0){p.pos.y=0}
	else if(p.pos.y>height){p.pos.y=height}
	
	//check colls
	for(i=0;i<obs.length;i++){
		
		obs[i].pos.add(obs[i].vel)
	 ob=obs[i]
	 destroy=false
	 fill(255)
	 for(j=0;j<obs.length;j++){
	 	  if(i!=j){
	 	  	  ob2=obs[j]
	 	  	  if(collideCircleCircle(ob2.pos.x,ob2.pos.y,ob2.r,ob.pos.x,ob.pos.y,ob.r)){
	 	fill(0,0,255)
	 	destroy=true
	 	newExplosionCluster(ob.pos.clone(),ob.r*2)
	 }
	 	  	
	 	  }
	 	}	if(collideCircleCircle(p.pos.x,p.pos.y,15,ob.pos.x,ob.pos.y,ob.r)){
	 	fill(255,0,0)
	 	if(smartbombActive){
	 		obs=[]
	 		enemies=[]
	 		smartbombActive=false
	 		smartbombHappened=true
	 		break;
	 	}else if(shieldActive){
	 		shieldActive=false
	 	}else{
	 		takeDamage(ob.r)
	 	}
	 	newExplosionCluster(p.pos.clone(),ob.r*2)
	 	destroy=true
	 }
	 
	 //update enemies
	for(j=0;j<enemies.length;j++){
		enemy=enemies[j]
		if(collideCircleCircle(enemy.pos.x,enemy.pos.y,enemy.r,ob.pos.x,ob.pos.y,ob.r)){
			
			newExplosionCluster(enemies[j].pos.clone(),ob.r*2)
			enemies[j].hp-=ob.r
			if(enemies[j].hp<0){
				enemies.splice(j,1)
				}
			destroy=true
			break;
			
		}
	}
	  ellipse(ob.pos.x,ob.pos.y,ob.r,ob.r)
	  if(destroy || ob.pos.x<0 || ob.pos.x>width || ob.pos.y<0 || ob.pos.y>height){
	  	  obs.splice(i,1)
	  	  i--
	  }
	}
	fill(255)
	
	if(enemies[shootTargetId]==null){
		shootTargetId=null
		shootTargetIdOld=null
		shootToTarget=null
	}
	
	if(shootTargetId!=null){	if(shootTargetId==shootTargetIdOld){
			shootTimer--
			if(shootTimer==0){
					shootTimer=shootTimerMax
					stroke(255,0,0)
					//shoot projectile
					obPos=p.pos.clone().add(shootToTarget.norm().multiply(Victor(-30,-30)))
					obVel=shootToTarget.norm().multiply(Victor(shootSpeed,shootSpeed))
					newOb(obPos,obVel,10)
			}else{
				stroke(0,255,0)
			}
		}
		enemyT=enemies[shootTargetId].pos
		line(p.pos.x,p.pos.y,enemyT.x,enemyT.y)
		noStroke()
	}
	
	
	translate(p.pos.x,p.pos.y)
	if(inControl){pAng=dir.angle()}
	rotate(pAng)
	rect(0,0,15,10)
	if(crashteroidActive){
		fill(255,150,150,150)
		ellipse(0,0,crashteroidRad,crashteroidRad)
	}
	else if(smartbombActive){
		fill(0,255,0,150)
		ellipse(0,0,25,25)
	}else if(shieldActive){
		fill(0,0,255,150)
		ellipse(0,0,25,25)
	}
	
	
	rotate(-pAng)
	translate(-p.pos.x,-p.pos.y)
	if(touching){
	fill(255,0,0)
	stroke(255,0,0)
	//line(p.pos.x,p.pos.y,m.x,m.y)
 fullDirDisplay=p.pos.clone().add(fullDir)
 /*	line(p.pos.x,p.pos.y,fullDirDisplay.x,fullDirDisplay.y)
	line(touchStart.x,touchStart.y,m.x,m.y)
	ellipse(m.x,m.y,10,10)
	*/
	}
	
	
	
	//update enemies
	shootTargetIdOld=shootTargetId
	shootTargetId=null
	shootToTarget=null
	for(i=0;i<enemies.length;i++){
		enemy=enemies[i]
		enemies[i].update()
		enemies[i].draw()
		if(sectorTimer<0 && enemies[i].pos.y>height+40){
			enemies.splice(i,1)
			i--
		}
		
		if(shootActive && collideCircleCircle(enemy.pos.x,enemy.pos.y,enemy.r,p.pos.x,p.pos.y,shootRad)){
				shootToTargetTemp=p.pos.clone().subtract(enemy.pos)
				if(shootToTarget==null || shootToTargetTemp.length()<shootToTarget.length()){
					shootToTarget=shootToTargetTemp.clone()
					shootTargetId=i
				}
			}
			
			
		if(crashteroidActive && collideCircleCircle(enemy.pos.x,enemy.pos.y,enemy.r,p.pos.x,p.pos.y,crashteroidRad)){
			enemies[i].crashteroid=true
			crashteroidActive=false
		}
		else if(collideCircleCircle(enemy.pos.x,enemy.pos.y,enemy.r,p.pos.x,p.pos.y,20)&&sectorTimer>0&&!dead){
			
			if(smartbombActive){
				obs=[]
	 		enemies=[]
	 		smartbombActive=false
	 		smartbombHappened=true
	 		break;
	 	}else if(shieldActive){
	 		shieldActive=false
	 	}else{
	 		takeDamage(enemies[i].dmg)
	 	}
	 	newExplosionCluster(enemies[i].pos.clone(),enemies[i].dmg*3)
			enemies[i].hp-=pDmg
			if(enemies[i].hp<0){
				enemies.splice(i,1)
				i--
				}
			
		}
	}
	rectMode(CENTER)
	if(pubSpawned){
		noStroke()
		beamHeight=(10*sin(0.1*time))+90
		fill(0,255,0,100)
		if(!inPub){
			rect(width/2,pubY,width,beamHeight)
			}
		fill(255)
		rect(width-50,pubY,100,100)
		fill(255,150,150)
		textAlign(CENTER)
		text(pubName,width-50,pubY,100,100)
		
		
		
	if(!inPub && sectorTimer<=0 && !dead){	if(p.pos.y<pubY+50&&p.pos.y>pubY-50){
		 inControl=false
		 
		 pubText=parseT("#[name:"+pubName+"]pubIntro#")
			p.vel=Victor(0,0)
			if(p.pos.x<width-25){
			  p.pos.x++
			}else{
				inPub=true
				refreshUpgrades()
			}
			if(pubY<height/2 && p.pos.y<pubY){
					p.pos.y++
			}
		}
	}
	}
	
	
	//update explosions
	drawExplosions()
	
	rectMode(CORNER)
	if(!inPub){
	
	//draw timer bar
	
	
	stroke(255)
	noFill()
	rect(2,2,width-4,26)
	noStroke()
	fill(255)
	rect(2,2,(width-4)*sectorTimer/sectorTimerMax,26)
	fill(255,0,0)
	textAlign(CENTER)
	text("Sector:"+sector,width/2,20)
	
	stroke(255)
	noFill()
	rect(p.pos.x-10,p.pos.y-30,20,5)
	noStroke()
	fill(255)
	rect(p.pos.x-10,p.pos.y-30,20*hp/hpMax,5)
	fill(255,0,0)
	//textAlign(CENTER)
	//text("HP:"+hp,width/2,height-20)
	
	}else{
		textAlign(LEFT)
		//draw pub menu
		fill(100)
		//draw options
		optionsY=150
		
		rect(10,10,width-20,optionsY-10)
	
		boxSize=(width/2)-20
		rect(10,optionsY+10,(width/2)-20,(width/2)-20)
		rect((width/2)+10,optionsY+10,(width/2)-20,(width/2)-20)
		rect(10,optionsY+(width/2)+10,(width/2)-20,(width/2)-20)
		rect((width/2)+10,optionsY+(width/2)+10,(width/2)-20,(width/2)-20)
		
		
		
		fill(255)
		text(pubText,10,10,width-20,optionsY-10)
		
		text(upgrades[0].displayText,10,optionsY+20,boxSize,boxSize)
		text(upgrades[1].displayText,(width/2)+10,optionsY+20,boxSize,boxSize)
		text(upgrades[2].displayText,10,optionsY+(width/2)+20,boxSize,boxSize)
		text(upgrades[3].displayText,(width/2)+10,optionsY+(width/2)+20,boxSize,boxSize)
		
		
		//check options for click
		
		if(touching){
			//alert(mouseX)
			//alert(collidePointRect(mouseX,mouseY,10,10,(width/2)-20,(width/2)-20))
			box0Hit=collidePointRect(mouseX,mouseY,10,optionsY+10,(width/2)-20,(width/2)-20)
			//alert(box0Hit)
			 if(box0Hit){
			 	getUpgrade(0)
			 }
			 
			 box1Hit=collidePointRect(mouseX,mouseY,(width/2)+10,optionsY+10,(width/2)-20,(width/2)-20)
			 
		if(box1Hit){
			 	getUpgrade(1)
			 }
			 
			 box2Hit=collidePointRect(mouseX,mouseY,10,optionsY+(width/2)+10,(width/2)-20,(width/2)-20)
			 
			 if(box2Hit){
			 	getUpgrade(2)
			 }
			 
			 box3Hit=collidePointRect(mouseX,mouseY,(width/2)+10,optionsY+(width/2)+10,(width/2)-20,(width/2)-20)
			 
			 if(box3Hit){
			 	getUpgrade(3)
			 }
			 
			 
			 //getUpgrade(0)
		}
	}
	
	if(dead){
		textSize(40)
		//textAlign(CENTER)
		text("GAME OVER",10,height/2,width,height)
	}
	
	
}