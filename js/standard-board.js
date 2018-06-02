
window.onload=function(){
	function player(name,number,team,position,lineUp){
	this.name=name;
	this.number=number;
	this.team=team;
	this.position=position;
	this.score=0;
	this.Block=0;
	this.assistant=0;
	this.foul=0;
	this.status=0;
	if(lineUp){
	this.status=1;
	}else{
		this.status=0;
	}
   }
	var teamName1=document.getElementById("team1");
	var teamName2=document.getElementById("team2");
		var team1=new Array();
		var team2=new Array();
		team1.foulNumber=0;
	    team2.foulNumber=0;
		var teamContent1="骑士";
		var teamContent2="勇士";
	
    $.ajaxSetup({async:false});
	var x=function(){
		$.getJSON('../datas/teams.json',function(data){
		$.each(data, function(index,info) {
			if(info["teamname"]==teamContent1){
				document.getElementById("teamName1").innerText = info["teamname"];
				$.each(info["staff"], function(index,info) {
					var team1_player=new player(info["name"],info["number"],teamContent1,info["position"],info["lineup"]);
					team1.push(team1_player);
				});
			}
			if(info["teamname"]==teamContent2){
				document.getElementById("teamName2").innerText = info["teamname"];
				$.each(info["staff"], function(index,info) {
					var team2_player=new player(info["name"],info["number"],teamContent1,info["position"],info["lineup"]);
					team2.push(team2_player);
				});
			}
		});
	})
		}
	x();
	for(var i=0;i<team1.length;i++){
		if(team1[i].status==1){
		teamName1.children[i+1].children[0].innerText=team1[i].name;
		}
	}
	for(var i=0;i<5;i++){
			if(team2[i].status==1){
		teamName2.children[i+1].children[0].innerText=team2[i].name;
		}
	}
	var start=document.getElementById("start")
	var mainTimeNode=document.getElementById("restTime");
	var totelTime = 0;
	var tmp=0;
	var status=0;
	start.addEventListener('click',function(){
		if(tmp==0){
		var mainTime=document.getElementById("restTime").textContent;
		totelTime = mainTime;
		var time=new Array();
		time=mainTime.split(":");
		var minute=parseInt(time[0]);
		var second=parseInt(time[1]);
		var secondNumber=minute*60+second-1;
		var short=document.getElementById("countDown");
		var shortTime=parseInt(short.textContent);
		if(status==1){
				shortTime=25;
			}
	  tmp=setInterval(function(){
			var minuteNumber=Math.floor(secondNumber/60);
			var seconds=secondNumber%60;
			shortTime--;
			
			if(secondNumber<0){
				minuteNumber=12;
				seconds=0;
				shortTime=24;
				if(tmp!=0){
				clearInterval(tmp);
				tmp=0;
				}
			}
			var time=minuteNumber+":"+seconds;
		    mainTimeNode.innerText=time;
			secondNumber--;
			if(shortTime==-1){
				shortTime=24;
				if(tmp!=0){
				clearInterval(tmp);
				tmp=0;
				}
			}
			short.innerText=shortTime;
		},1000)
	  }
	},false)
	var stop=document.getElementById("pause");
	stop.addEventListener('click',function(){
		clearInterval(tmp);
		tmp=0;
	})
	function chooseScore(team,player){
		var tmpTeam;
		if(team%2==0){
			tmpTeam=teamName1;
		}else{
			tmpTeam=teamName2;
		}
		var scoreNumber=document.getElementById('actualsubWindow');
		scoreNumber.innerHTML="";
		for(var i=0;i<3;i++){
			var tmpScore=document.createElement("li");
			var x=i+1;
			tmpScore.innerHTML='<li class="mui-table-view-cell"><a href="#">'+x+'</a></li>';
			scoreNumber.appendChild(tmpScore);
		}
			mui('.mui-popover').popover('toggle',document.getElementById('subWindow'));
			
		 for(var i=0;i<3;i++){
		 	    scoreNumber.children[i].score=i+1;
		 		scoreNumber.children[i].team=team;
		 		scoreNumber.children[i].player=player;
		 	  scoreNumber.children[i].onclick=function(){
		 		mui('.mui-popover').popover('toggle',document.getElementById('subWindow'));
		 		changeScore(this.team,this.player,this.score);
		 		for(var i=1;i<6;i++){
        	     tmpTeam.children[i].onclick=function(){}
               }
		 	}
		 }
	}
	function changeScore(team,player,score){
		var tmpTeam;
		var tmpTeamName;
		if(team==0){
			tmpTeam=team1;
			tmpTeamName=teamName1;
		}else{
			tmpTeam=team2;
			tmpTeamName=teamName2;
		}
			var name=tmpTeamName.children[player].children[0].innerText;
		    for(var i=0;i<tmpTeam.length;i++){
		    	if(tmpTeam[i].name==name){
		    		tmpTeam[i].score+=score;
		    		break;
		    	}
		    }
		var sumScore=parseInt(document.getElementById("score-record"+team).innerText);
		sumScore+=score;
		document.getElementById("score-record"+team).innerText=sumScore;
		if(tmp!=0){
			clearInterval(tmp);
			tmp=0;
			status=1;
		}
	}
     function changeOther(team,player){
			var tmpTeam;
		var tmpTeamName;
		if(team%2==0){
			tmpTeam=team1;
			tmpTeamName=teamName1;
		}else{
			tmpTeam=team2;
			tmpTeamName=teamName2;
		}
		var name=tmpTeamName.children[player].children[0].innerText;
		    for(var i=0;i<tmpTeam.length;i++){
		    	if(tmpTeam[i].name==name){
		    		if(team==2||team==3){
		    		tmpTeam[i].Block++;
		    		}else if(team==4||team==5){
		    			tmpTeam[i].assistant++;
		    		}else{
		    			tmpTeam[i].foul++;
		    			tmpTeam.foulNumber++;
		    			if(tmpTeam[i].foul==5){
                             tmpTeam[i].status=3;
		    				alert(tmpTeam[i].name+"的犯规次数已达五次，请换人");
		    			}else if(tmpTeam.foulNumber>=5){
		    				alert(team%2+"队的犯规次数已达五次，请罚球")
		    			}
		    		}
		    		break;
		    	}
		    }
		    for(var i=1;i<6;i++){
        	     tmpTeamName.children[i].onclick=function(){}
               }
	}
	function addScore(team){
		var tmpTeam;
		if(team%2==0){
			tmpTeam=teamName1;
		}else{
			tmpTeam=teamName2;
		}
		for(var i=1;i<6;i++){
			tmpTeam.children[i].id=i;
			tmpTeam.children[i].team=team;
			if(team<2){
        	tmpTeam.children[i].onclick=function(team,i){
        		chooseScore(this.team,this.id);
        	}
        }else{
        	tmpTeam.children[i].onclick=function(team,i){
        		changeOther(this.team,this.id);
        	}
          }
        }
	}
		var leftAddScore=document.getElementById("score1");
	leftAddScore.addEventListener('click',function(){
		addScore(0);
	},false);
       var rightAddScore=document.getElementById("score2");
       rightAddScore.addEventListener('click',function(){
       	addScore(1);
       })
        var leftAddBlock=document.getElementById("backboard1");
        leftAddBlock.addEventListener('click',function(){
        	addScore(2);
        })
        var RightAddBlock=document.getElementById("backboard2");
        RightAddBlock.addEventListener('click',function(){
        	addScore(3);
        })
        var LeftAddAssistant=document.getElementById("assist1");
        var RightAddAssistant=document.getElementById("assist2");
        LeftAddAssistant.addEventListener('click',function(){
        	addScore(4);
        })
        RightAddAssistant.addEventListener('click',function(){
        	addScore(5);
        })
        var LeftFoul=document.getElementById("foul1");
        var RightFoul=document.getElementById("foul2");
         LeftFoul.addEventListener('click',function(){
        	addScore(6);
        })
        RightFoul.addEventListener('click',function(){
        	addScore(7);
        })
        function changePlayer(self,team){
        	var tmpTeam=team%2==0?team1:team2;
        	var alternates=document.getElementById("actualsubWindow");
        		alternates.innerHTML="";
        	for(var i=0;i<tmpTeam.length;i++){
        		if(tmpTeam[i].status==0){
        			var newli=document.createElement("li");
        			newli.innerHTML='<li class="mui-table-view-cell"><a href="#">'+tmpTeam[i].name+'</a></li>';
        			alternates.appendChild(newli);
        		}
        	}
        	mui('.mui-popover').popover('toggle',document.getElementById('subWindow'));
        	for(var i=0;i<alternates.children.length;i++){
        		alternates.children[i].addEventListener('click',function(){
        			mui('.mui-popover').popover('hide',document.getElementById('subWindow'));
        			var originalName=self.parentNode.children[0].innerText;
        			 for(var j=0;j<tmpTeam.length;j++){
		    	  if(tmpTeam[j].name==originalName){
		    		tmpTeam[j].status=0;
		    		break;
		    	 }
		        }
        			var name=this.innerText.substring(0,this.innerText.length-1);
        			 for(var j=0;j<tmpTeam.length;j++){
		    	  if(tmpTeam[j].name.toString()==name.toString()){
		    		tmpTeam[j].status=1;
		    		break;
		    	      }
		            }
        			self.parentNode.children[0].innerText=name;
        		})
        	}
        }
        for(var i=1;i<6;i++){
         teamName1.children[i].children[1].addEventListener('click',function(){
         	changePlayer(this,0);
         })
           teamName2.children[i].children[1].addEventListener('click',function(){
         	changePlayer(this,1);
         })
        }
       var shortTimecount=document.getElementById("countDown");
       shortTimecount.addEventListener('click',function(){
       	status=1;
       	if(tmp!=0){
       		clearInterval(tmp);
       		tmp=0;
       	}
       })
    var old_back = mui.back;
    mui.back = function(){
    	var button =["确定","取消"]
    	mui.confirm("是否保存比赛信息？","退出",button,function(e){
    		if(e.index ==0){
    			
    			  plus.io.requestFileSystem(plus.io.PRIVATE_DOC,function(fs){
    		fs.root.getFile("datas/recent_games.json",{create:true},function(file){

    			
                var fileReader = new plus.io.FileReader();
                fileReader.readAsText(file,"utf-8");
                var datestr1;
                fileReader.onloadend = function(e){
                	var datestr = e.target.result;
                	var date;
                	if(datestr ==""){
                    date =[];
                }else{
                	date =JSON.parse(datestr);
                }
               
                	
                	var id= {};
    			id["firstName"] = " aaa ";
    			id["firstCoach"] = " bbb";
    			id["firstClass"] = "aaad";
    			id["secondName"] = "fdgdf";
    			id["secondCoach"] = "sdfsdf";
    			id["secondClass"] = "fdsfsdf";
    			id["firstScore"] = "23";
    			id["secondScore"]= "54";
    			id["official_match_time"] = totelTime;
    			id["single_game_time"] = totelTime/2;
    			id["half_time"] = 3;
    			id["break_time"] = 5;
    			id["each_full"] =  5;
    			id["personal_full"] = 5;
    			var firstTeam =[];
    			var secondTeam = [];
    			for(var i= 0; i <team1.length;i++){
    				var player = {};
    				player["name"] = team1[i].name;
    				player["number"]= team1[i].number;
    				player["position"]  =team1[i].position;
    				player["lineup"] = team1[i].status;
    				player["score"] = team1[i].score;
    				player["foul"] = team1[i].foul;
    				player["asts"] = team1[i].assistant;
    				firstTeam.push(player);
    			}
    			for(var i= 0; i <team2.length;i++){
    				var player = {};
    				player["name"] = team2[i].name;
    				player["number"]= team2[i].number;
    				player["position"]  =team2[i].position;
    				player["lineup"] = team2[i].status;
    				player["score"] = team2[i].score;
    				player["foul"] = team2[i].foul;
    				player["asts"] = team2[i].assistant;
    				secondTeam.push(player);
    			}
    			id["firstTeam"] = firstTeam;
    			id["secondTeam"] = secondTeam;
    			
    		
    			date.push(id);
    			datestr1 =JSON.stringify(date);
                	

                
    			}
    			 file.createWriter(function(writer){
                		alert(datestr1);
    				    writer.write(datestr1);
//  				    writer.onwrite =old_back();
						writer.onwrite=function(e){
							plus.screen.lockOrientation("portrait-primary"); 
                 var targetPage = plus.webview.getWebviewById("html/recent-games-list.html");
				 targetPage.reload();
							plus.webview.currentWebview().close("auto",400);
						}
    				},function(e){
    			
    				})
                    
    		},function(e){
    		
    		})
    	})
    			
    			
    		}else{
//  			old_back();
plus.screen.lockOrientation("portrait-primary"); 
                 var targetPage = plus.webview.getWebviewById("html/recent-games-list.html");
				 targetPage.reload();
plus.webview.currentWebview().close("auto",400);
    		}
    	})
    }
    mui.plusReady(function(){   
    var end = document.getElementById("end");
    var path = plus.io.convertLocalFileSystemURL("../datas/recent_games.json");
    
    

    end.addEventListener("tap",function(){
        
        mui.back();
//  	var readJson = function(){
//  		$.getJSON(path,function(date){
//  			var id= {};
//  			id["firstName"] = " aaa ";
//  			id["firstCoach"] = " bbb";
//  			id["firstClass"] = "aaad";
//  			id["secondName"] = "fdgdf";
//  			id["secondCoach"] = "sdfsdf";
//  			id["secondClass"] = "fdsfsdf";
//  			id["firstScore"] = "23";
//  			id["secondScore"]= "54";
//  			id["official_match_time"] = totelTime;
//  			id["single_game_time"] = totelTime/2;
//  			id["half_time"] = 3;
//  			id["break_time"] = 5;
//  			id["each_full"] =  5;
//  			id["personal_full"] = 5;
//  			var firstTeam =[];
//  			var secondTeam = [];
//  			for(var i= 0; i <team1.length;i++){
//  				var player = {};
//  				player["name"] = team1[i].name;
//  				player["number"]= team1[i].number;
//  				player["position"]  =team1[i].position;
//  				player["lineup"] = team1[i].status;
//  				player["score"] = team1[i].score;
//  				player["foul"] = team1[i].foul;
//  				player["asts"] = team1[i].assistant;
//  				firstTeam.push(player);
//  			}
//  			for(var i= 0; i <team2.length;i++){
//  				var player = {};
//  				player["name"] = team2[i].name;
//  				player["number"]= team2[i].number;
//  				player["position"]  =team2[i].position;
//  				player["lineup"] = team2[i].status;
//  				player["score"] = team2[i].score;
//  				player["foul"] = team2[i].foul;
//  				player["asts"] = team2[i].assistant;
//  				secondTeam.push(player);
//  			}
//  			id["firstTeam"] = firstTeam;
//  			id["secondTeam"] = secondTeam;
//  			
//  			date.push(id);
//  			var datestr =JSON.stringify(date);
//
//  			
////  			var FileWriter = plus.android.importClass("java.io.FileWriter")
////              var BufferedWriter = plus.android.importClass("java.io.BufferedWriter");
////              var fw = new FileWriter(path,true);
////              var bw=  new BufferedWriter(fw);
////              try{
////      			bw.write(datestr);
////      			bw.close();
////     		    	fw.close();
////  			}catch(e){
////      			alert("aaa: ")
////  			}  
//			})		
//  		    
//  		}
//  	readJson();
    	})				
	})
}
