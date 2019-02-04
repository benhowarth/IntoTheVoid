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
      if(inControl && !inPub){
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

    bgDrawer.shader(starShader)
  starShader.setUniform("bgOffset",bgOffset)
  starShader.setUniform("resolution",[w,h])
  starShader.setUniform("time",time*0.01)
    bgDrawer.background(0);
  	bgDrawer.noStroke()
  	bgDrawer.rect(0,0,w,h)

    texture(bgDrawer)
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
  createCanvas(w,h,WEBGL)
  bgDrawer=createGraphics(w,h,WEBGL)

  cam=createCamera()
  //camera(0,0,h,0,0,0,0,1,0)
  camera()
  cam.move(w/2,h/2,0)


  noSmooth()
	p.pos=Victor(width/2,height/2)
	background(0);
	frameRate(60);
	speed=1;
  speedMax=5;
  speedIncrement=0.5;
  speedVec=Victor(speed,speed)
	friction=0.97;
	pDmg=5
	smartbombActive=false
	smartbombHappened=false
	shieldActive=false
	crashteroidActive=false
	crashteroidRad=20
  crashteroidRadIncrement=30
  crashteroidRadMax=120
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
	dead=false
  deadKeyHoldTimer=50
	rectMode(CENTER)
	time=0
	spawnInterval=50
	touchStart=p.pos.clone()
	velDampening=0.07;
	trailAgeMax=35;
	trailSizeMax=15;
	trailInterval=1;


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


}
function draw(){
	textFont(f1)
  if(touchDevice){
     textSize(10)
  }else{
    textSize(20)
  }
	rectMode(CENTER)
	time+=1
	if(!dead){
		sectorTimer--;
    checkMovementKeys();
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
  background(0)
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
fullDir=m.clone().subtract(touchStart).multiply(Victor(velDampening,velDampening))
dir=fullDir.clone().norm()

	//if(touching && fullDir.length()>0 &&inControl){
  if(p.vel.length()>1 &&inControl){
    if(time%trailInterval==0){

			//alert(trails.length)
			trailPos=p.pos.clone()
			trailPos.x=trailPos.x-cos(pAng)*5
			trailPos.y=trailPos.y-sin(pAng)*8
			newTrail(trailPos)
		}
  }
    if(touching && fullDir.length()>0 &&inControl){
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
	 	}	if(collideCircleCircle(p.pos.x,p.pos.y,p.r,ob.pos.x,ob.pos.y,ob.r)){
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
  rotate(pAng)
	rect(0,0,p.r,p.r*0.6)
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
		if(!inPub){
			rect(width/2,pubY,width,beamHeight)
			}
		fill(255)
		rect(width-50,pubY,100,100)
		fill(255,150,150)
		textAlign(CENTER)
    textSize(10)
		text(pubName,width-50,pubY,100,100)


    if(touchDevice){
       textSize(10)
    }else{
      textSize(20)
    }


	if(!inPub && sectorTimer<=0 && !dead){	if(p.pos.y<pubY+50&&p.pos.y>pubY-50){
		 inControl=false

		 pubText=parseT("#[name:"+pubName+"]pubIntro#")
			p.vel=Victor(0,0)
			if(p.pos.x<width-25){
			  p.pos.x+=w*(0.003)
			}else{
				inPub=true
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
      textSize(20)
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

		textSize(40)
		//textAlign(CENTER)
		text("GAME OVER",10,height/2,width,height)

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
