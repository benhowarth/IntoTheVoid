//https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
function is_touch_device() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
    return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

if(is_touch_device()){
  touchDevice=true

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
}else{
  touchDevice=false

  document.addEventListener("mousedown",function(e){
    //alert("A!")
    touchStart=Victor(e.clientX,e.clientY)
    touching=true;
  });
  document.addEventListener("mouseup",function(e){
    touching=false;
  });

  movementKeys=[]
  movementKeys["w"]={active:false,onActive:function(){p.vel.y-=speedVec.y;}}
  movementKeys["s"]={active:false,onActive:function(){p.vel.y+=speedVec.y;}}
  movementKeys["a"]={active:false,onActive:function(){p.vel.x-=speedVec.x;}}
  movementKeys["d"]={active:false,onActive:function(){p.vel.x+=speedVec.x;}}

  movementKeysToUpgrades=[]
  movementKeysToUpgrades["w"]=0
  movementKeysToUpgrades["a"]=2
  movementKeysToUpgrades["s"]=3
  movementKeysToUpgrades["d"]=1

  document.addEventListener("keydown",function(e){
    //console.log(e.key);
    if(movementKeys[e.key]!=null){
      //alert(e.key)
      if(inControl){
        movementKeys[e.key].active=true
      }else{
          //check all other movement keys are up
          movementKeysAllUp=true
          for(var mK in movementKeys){
            //if(mK!=e.key){
              if(movementKeys[mK].active){movementKeysAllUp=false;}
            //}
          }

          if(movementKeysAllUp){
            getUpgrade(movementKeysToUpgrades[e.key])
          }


      }
    }
  });
  document.addEventListener("keyup",function(e){
    //console.log(e.key);
    if(movementKeys[e.key]!=null){
      movementKeys[e.key].active=false
    }
  });
}

function checkMovementKeys(){
  if(!touchDevice){
    if(inControl){
      for(var mK in movementKeys){
        //console.log(movementKeys[mK])
        if(movementKeys[mK].active){movementKeys[mK].onActive();}
      }
    }
  }
}






touching=false
gameOverFingerUp=false
m=Victor(10,10);


function preload(){
	f1=loadFont("img/saved_by_zero.ttf")
  defaultShader=loadShader("img/defaultShader.vert","img/defaultShader.frag")
  starShader=loadShader("img/starShader.vert","img/starShader.frag")
  ambientHumSFX=loadSound("img/Solar Phasing - Industrial Noises Ambient 1.wav")
}

pubY=-100
bgPointRad=19
bgMoveSpeed=0.002
bgOffset=0
parallaxFactor=4
function drawBG(){

	//if(!dead && inControl){
	if(pubY<height/2 || sectorTimer>0){
	     bgOffset+=bgMoveSpeed*(1-(p.pos.y/h))*parallaxFactor;
	}
	parallaxOffset=((p.pos.y/height)-0.5)*100
	//blendMode(LIGHTEST)
	yOffset=bgOffset%(bgPointRad)
	yOffset=0
  if(!touchDevice){
    bgDrawer.shader(starShader)
    starShader.setUniform("bgOffset",bgOffset)
    starShader.setUniform("resolution",[w,h])
    starShader.setUniform("time",time*0.01)
    bgDrawer.background(0);
  	bgDrawer.noStroke()
  	bgDrawer.rect(0,0,w,h)

    texture(bgDrawer)
  }
    rect(w/2,h/2,w,h)



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
  if(touchDevice){
    createCanvas(w,h)
  }else{
    createCanvas(w,h,WEBGL)
    cam=createCamera()
    //camera(0,0,h,0,0,0,0,1,0)
    camera()
    cam.move(w/2,h/2,0)
    bgDrawer=createGraphics(w,h,WEBGL)

  }


  noSmooth()
	p.pos=Victor(width/2,height/2)

  pCosmetic={
  	h:(10+(Math.random()*15)),
    trailAgeMax:Math.floor(15+(Math.random()*40)),
    trailSizeMax:Math.floor(15+(Math.random()*40)),
    trailInterval:Math.floor(5+(Math.random()*5)),
  	shipCol1:color(random(255),random(255),random(255)),
  	shipCol2:color(random(255),random(255),random(255)),
  	trailCol:color(random(255),random(255),random(255))
  }
  pCosmetic.w=pCosmetic.h*((Math.random()*0.4)+0.6)
  p.r=Math.max(pCosmetic.w,pCosmetic.h)

  //load highscore
  highscore=parseInt(Cookies.get("highscore"))
  if(isNaN(highscore)){highscore=0}
  newHighscore=false

	background(0);
	frameRate(60);
	//speed=1;
  speed=(200)/(pCosmetic.h*pCosmetic.w)
  console.log("speed",speed)
  speedMax=3;
  speedIncrement=0.5;
  speedVec=Victor(speed,speed)
	friction=0.97;
	pDmg=5
	smartbombActive=false
	smartbombHappened=false
  smartbombRad=0
	shieldActive=false
	crashteroidActive=false
	crashteroidRad=60
  crashteroidRadIncrement=30
  crashteroidRadMax=180
	shootActive=false
	shootTargetId=null
	shootTargetIdOld=null
	shootTimerMax=30
  //the smallest the interval between shooting can be upgraded to
	shootTimerMaxMin=7
  shootTimerMaxIncrement=2
	shootToTarget=Victor(null,null)
	shootRad=100
  shootRadIncrement=60
  shootRadMax=350
	shootSpeed=2
  shootSpeedMax=10
  shootSpeedIncrement=2
	shootTimer=shootTimerMax


  hpMaxMax=1000
  hpMaxIncrement=100
	hpMax=100
	//hpMax=100000
	hp=hpMax
  //bool for if currently dead
	dead=false
  //bool for one time onDeath stuff
  died=false
  deadKeyHoldTimer=50
	rectMode(CENTER)
	time=0
  //spawnTimer=50
  spawnIntervalMax=30
	spawnInterval=spawnIntervalMax

  enemyMaxMax=10
  enemyMax=1
  enemySpawnIntervalMax=100
  enemySpawnInterval=enemySpawnIntervalMax

	touchStart=p.pos.clone()
	velDampening=0.07;

	sector=0;
	sectorTimerMax=500
	sectorTimer=sectorTimerMax
	inControl=true
	pubSpawned=false
	inPub=false
  pubBeamOn=true
	pubName=parseT("#pubName#")

	pursuedInSector=false


  //sound setup

  soundFormats("wav")

  trailSFX=loadSound("img/trail.wav")
  trailSFX.playMode('sustain')
  trailSFX.setVolume(0.3)

  warningSFX=loadSound("img/warning.wav")
  warningSFX.playMode('sustain')
  warningSFX.setVolume(0.1)

  shootSFX=loadSound("img/shoot.wav")
  shootSFX.setVolume(0.6)
  shootSFX.playMode('sustain')

  explosionSFX=loadSound("img/explosion.wav")
  explosionSFX.setVolume(0.3)
  explosionSFX.playMode('sustain')

  smartbombSFX=loadSound("img/smartbomb.wav")
  smartbombSFX.setVolume(0.3)

  selectSFX=loadSound("img/select.wav")
  selectSFX.setVolume(0.4)

  pubTractorBeamSFX=loadSound("img/254942__deatlev__beam.wav")
  pubTractorBeamSFXMax=0.5

  pubBG1SFX=loadSound("img/397569__gagehurley78__crowded-bar-ambient-loop.wav")
  pubBG1SFX.setVolume(0.7)

  battleBG1SFX=loadSound("img/battle.wav")
  battleBG1SFX.setVolume(0.4)

  //bg hum start
  ambientHumSFX.loop()
}
function draw(){
	textFont(f1)
  if(touchDevice){
     textSize(10)
  }else{
    textSize(14)
  }
	rectMode(CENTER)
	time+=1
	if(!dead){
		sectorTimer--;
    checkMovementKeys();
	}

	if(sectorTimer>0){
    //if((time%enemySpawnInterval)==0){console.log("enemy should spawn",pursuedInSector,enemies.length,enemyMax,enemies.length<enemyMax)}
  	if(pursuedInSector && enemies.length<enemyMax && (time%enemySpawnInterval)==0){
  		newEnemy()
      console.log("New enemy!")
  	}
  	if(time%spawnInterval==0){
  		newAsteroid()
  		//if(spawnTimer>spawnInterval){spawnTimer--}
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
      pubTractorBeamSFX.loop()
      pubBeamOn=true
		}else{
			//update pub
			if(pubY<height/2){
			  pubY++;
        pubTractorBeamSFX.setVolume((pubY/(height/2))*pubTractorBeamSFXMax);
			}
		}
	}


	fill(0)
	noStroke()
	rect(width/2,height/2,width,height)
  background(0)
	drawBG()

	//fill(255)
	//draw trails
	for(i=0;i<trails.length;i++){
		trails[i].age++
		agePerc=trails[i].age/pCosmetic.trailAgeMax
		fill(pCosmetic.trailCol.levels[0],pCosmetic.trailCol.levels[1],pCosmetic.trailCol.levels[2],255*(1-agePerc))
		trailRad=(1-agePerc)*pCosmetic.trailSizeMax
		ellipse(trails[i].pos.x,trails[i].pos.y,trailRad,trailRad)
		if(trails[i].age>pCosmetic.trailAgeMax){
			trails.splice(i,1)
			i--
		}
	}

	fill(255)
	m=Victor(mouseX,mouseY);
//fullDir=	m.clone().subtract(p.pos)
fullDir=m.clone().subtract(touchStart).multiply(Victor(velDampening,velDampening))
dir=fullDir.clone().norm()

	//if(touching && fullDir.length()>0 &&inControl){
  if(p.vel.length()>1 &&inControl){
    if(time%pCosmetic.trailInterval==0){

			//alert(trails.length)
			trailPos=p.pos.clone()
			trailPos.x=trailPos.x-cos(pAng)*5
			trailPos.y=trailPos.y-sin(pAng)*8
			newTrail(trailPos)
      trailSFX.play();
		}
  }
    if(touching && fullDir.length()>0 &&inControl){
		//speedVec=Victor(speed/fullDir.length,speed/fullDir.length)
		speedVec=Victor(speed/(w/500),speed/(h/500))
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


  //check smartbomb
  if(smartbombHappened){
    checkAndDrawSmartbombExplosion()

  }

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
    }
    //if(collideRectCircle(p.pos.x,p.pos.y,pCosmetic.w,pCosmetic.y, ob.pos.x,ob.pos.y, ob.r)){
    if(collideCircleCircle(p.pos.x,p.pos.y,p.r,ob.pos.x,ob.pos.y,ob.r)){
    fill(255,0,0)
    if(smartbombActive){

    setOffSmartBomb()
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

  if(!inPub && shootActive){
  stroke(255,0,0)
  noFill()
  ellipse(p.pos.x,p.pos.y,shootRad,shootRad)
  noStroke()
  fill(255)
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
          shootSFX.play()
			}else{
				stroke(0,255,0)
			}
		}
		enemyT=enemies[shootTargetId].pos
		line(p.pos.x,p.pos.y,enemyT.x,enemyT.y)
		noStroke()
	}


	translate(p.pos.x,p.pos.y)
	//if(inControl){pAng=dir.angle()}
  pAng=p.vel.angle()
  rotate(pAng+PI/2)
  fill(pCosmetic.shipCol1)
	rect(0,0,pCosmetic.w,pCosmetic.h)
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


	rotate(-pAng-PI/2)
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


  fill(255,255,255)

	//update enemies

  //check if should fade out enemy encounter music (if no enemies or player is dead)
  checkIfEndBattleMusic()

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

        setOffSmartBomb()
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
		if(!inPub&&pubBeamOn){
			rect(width/2,pubY,width,beamHeight)
		}
		fill(255)
		rect(width-50,pubY,100,100)
		fill(255,150,150)
		textAlign(CENTER)
    textSize(10)
		text("The "+pubName,width-50,pubY,100,100)


    if(touchDevice){
       textSize(10)
    }else{
      textSize(16)
    }


  	if(!inPub && sectorTimer<=0 && !dead){
      if(p.pos.y<pubY+50&&p.pos.y>pubY-50){
  		 inControl=false

  		 pubText=parseT("#[name:"+pubName+"]pubIntro#")
  			p.vel=Victor(0,0)
  			if(p.pos.x<width-25){
  			  p.pos.x+=w*(0.003)
  			}else{
  				inPub=true
          pubTractorBeamSFX.setVolume(0.0,1)
          pubTractorBeamSFX.stop(1.1)
          pubBG1SFX.setVolume(0.5,4)
          pubBG1SFX.loop()
          pubBeamOn=false
  				refreshUpgrades()
  			}
  			if(pubY<height/2 && p.pos.y<pubY){
  					p.pos.y++
  			}else if(p.pos.y>pubY){
          p.pos.y--
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

    boxParam=Math.min(width,height)
		boxSize=(boxParam/3)
    gapX=(width-(2*boxSize))/3
    gapY=(height-optionsY-boxSize*2)/3

		rect(gapX,optionsY+gapY,boxSize,boxSize)
		rect(boxSize+gapX*2,optionsY+gapY,boxSize,boxSize)
		rect(gapX,optionsY+boxSize+gapY*2,boxSize,boxSize)
		rect(boxSize+gapX*2,optionsY+boxSize+gapY*2,boxSize,boxSize)



		fill(255)

    if(touchDevice){
       textSize(10)
    }else{
      textSize(14)
    }
		text(pubText,10,10,width-20,optionsY-10)

    keyBorderBuffer=30

		text(upgrades[0].displayText,gapX,optionsY+gapY,boxSize,boxSize)
		text(upgrades[1].displayText,boxSize+gapX*2,optionsY+gapY,boxSize,boxSize)
		text(upgrades[2].displayText,gapX,optionsY+boxSize+gapY*2,boxSize,boxSize)
    text(upgrades[3].displayText,boxSize+gapX*2,optionsY+boxSize+gapY*2,boxSize,boxSize)



    if(!touchDevice){
      text("w",gapX+boxSize-keyBorderBuffer,optionsY+gapY+boxSize-keyBorderBuffer,boxSize,boxSize)
  		text("d",boxSize+gapX*2+boxSize-keyBorderBuffer,optionsY+gapY+boxSize-keyBorderBuffer,boxSize,boxSize)
      text("a",gapX+boxSize-keyBorderBuffer,optionsY+boxSize+gapY*2+boxSize-keyBorderBuffer,boxSize,boxSize)
      text("s",boxSize+gapX*2+boxSize-keyBorderBuffer,optionsY+boxSize+gapY*2+boxSize-keyBorderBuffer,boxSize,boxSize)
    }


		//check options for click

		if(touching){
			//alert(mouseX)
			//alert(collidePointRect(mouseX,mouseY,10,10,(width/2)-20,(width/2)-20))
			box0Hit=collidePointRect(mouseX,mouseY,gapX,optionsY+gapY,boxSize,boxSize)
			//alert(box0Hit)
			 if(box0Hit){
			 	getUpgrade(0)
			 }

			 box1Hit=collidePointRect(mouseX,mouseY,boxSize+gapX*2,optionsY+gapY,boxSize,boxSize)

		   if(box1Hit){
			 	getUpgrade(1)
			 }

			 box2Hit=collidePointRect(mouseX,mouseY,gapX,optionsY+boxSize+gapY*2,boxSize,boxSize)

			 if(box2Hit){
			 	getUpgrade(2)
			 }

			 box3Hit=collidePointRect(mouseX,mouseY,boxSize+gapX*2,optionsY+boxSize+gapY*2,boxSize,boxSize)

			 if(box3Hit){
			 	getUpgrade(3)
			 }


			 //getUpgrade(0)
		}
	}

	if(dead){
    if(!died){
      died=true
      if(highscore<sector){
        Cookies.set("highscore",sector)
        newHighscore=true
      }
    }

		textSize(40)
		//textAlign(CENTER)
		text("GAME OVER",10,height/2,width,height)

    if(newHighscore){
      text("NEW HIGHSCORE: "+sector,10,100,width,height)
    }
    else{
      if(isNaN(highscore)){highscore=0}
      text("CURRENT HIGHSCORE: "+highscore,10,100,width,height)
    }

    if(touchDevice){
      retryString="TAP TO RETRY"
    }else{
      retryString="CLICK OR HOLD ANY KEY TO RETRY"
    }
  	text(retryString,10,50+height/2,width,height)


    if(touching){
      if(gameOverFingerUp){
        document.location.reload(false)
      }
    }else{
      gameOverFingerUp=true
      if(keyIsPressed === true){
        if(deadKeyHoldTimer<=0){
          document.location.reload(false)
        }else{
          deadKeyHoldTimer--;
        }
      }
    }
	}


}
