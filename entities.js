p={
	pos:Victor(0,0),
	vel:Victor(0,0),
  r:15
	};

obs=[]
function newOb(_pos,_vel,_r){
	_ob={
		pos:_pos,
		vel:_vel,
		r:_r
		}

	obs.push(_ob)
}
asteroidSpeed=10
function newAsteroid(){
	//obR=math.random(10,30)
  obDifficulty=Math.min(sector,50)/50
  obR=math.random(10,10+(60*obDifficulty))
  obSpeedVec=Victor(math.random(10,10+(20*obDifficulty)),math.random(10,10+(20*obDifficulty)))
  obXSpawnRange=obDifficulty*width/2
  //console.log(obDifficulty)

  obX=math.random(0,obXSpawnRange)
  if(math.random()>0.5){
    obX=math.random(width-obXSpawnRange,width)
  }

  obPos=Victor(obX,0)
  normalToCenter=p.pos.clone().subtract(obPos).norm()
  obVel=normalToCenter.clone().multiply(obSpeedVec)

  /*
  obPos=Victor(0,0)
  obVel=Victor(math.random(asteroidSpeed/10,asteroidSpeed),math.random(asteroidSpeed/10,asteroidSpeed))
	if(math.random()>0.5){
			obPos=Victor(width,0)
			obVel=Victor(math.random(-asteroidSpeed,-asteroidSpeed/2),math.random(asteroidSpeed/10,asteroidSpeed))
		}

    */

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
		warningSFX.play()
		rect(this.pos.x,height-30,this.r*sin(time*0.3),this.r*sin(time*0.3))
	}else{
			//ellipse(this.pos.x,this.pos.y,this.r,this.r)
			translate(this.pos.x,this.pos.y)
			rotate(this.toPlayer.angle())


			rect(0,0,this.r,this.r/2)

      if(this.crashteroid){
          fill(255,0,0,150)
          ellipse(0,0,this.r,this.r)
      }

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

		if(this.toPlayer.length()>this.minDist || this.crashteroid){

        if(this.crashteroid){
          this.vel=this.toPlayer.norm().multiply(this.followSpeed.clone().multiply(Victor(6,6)))
        }else{
          this.vel=this.toPlayer.norm().multiply(this.followSpeed)
        }
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

function checkIfEndBattleMusic(){
	if(enemies.length==0 || dead){
		battleBG1SFX.setVolume(0.0,2)
		battleBG1SFX.stop(2.1)
	}
}

function newEnemy(){
	enemies.push(new Enemy(Victor(2,1)))
	if(enemies.length==1){
		battleBG1SFX.setVolume(0.4,2)
		battleBG1SFX.loop()
	}
}
