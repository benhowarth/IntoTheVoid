

trails=[]
function newTrail(_pos){
	trails.push(
	{
		pos:_pos,
		age:0
	}
	)
}


explosionAgeMax=20
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
