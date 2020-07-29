/*
	Tarun Haridasan, Brian Ly, Alex Sun
	2019-06-03
	Code.js Battleship file
	This file contains all the game mechanics, JQuery, and Java script code for the Battleship game 
*/
//Basic variable declarations
let name="";
let difficultySelected="";
let inputType;
let direction="";
let inputDirection;
let currentShipOutline=[];
let hoverYCoord;
let hoverXCoord;
let youShotsMissed=0;
let shipRequested="";
let boxesPlaced="";
let aiShotsMissed=0;
let clickAiTurn;
let directionImagePlacement="";
let clickedDestroyer=false;
let clickedCruiser=false;
let clickedSubmarine=false;
let clickedBattleship=false;
let clickedCarrier=false;
let randomHitAudio=0;
let subOrCruiser;
let playerSubOrCruiser=1;
let tempShipClass;
let tempShipAttack;
let turn="player";
let attack;
let startDate;
let endDate;
let justSunkShipName="";
let anyButton=0;
let shipIndex=["twoPiece","threePiece1","threePiece2","fourPiece","fivePiece"];
let playerShips=[["twoPiece", 2],["threePiece1", 3],["threePiece2", 3],["fourPiece", 4],["fivePiece", 5],[17]];
let AiShips=[["twoPiece", 2],["threePiece1", 3],["threePiece2", 3],["fourPiece", 4],["fivePiece", 5],[17]];
let alphaCoordinate="";
let numericCoordinate="";
let parentImageLocation="";
let tempChoiceY=6;
let tempChoiceX=6;
let monthsElapsed=0;
let AiFirstHit=[];
let AiCurrentLine="x";
let AiTries=0;
let AiSunkShip=0;
let AiContinue=0;
let AiMiss=0;
let AiSearching=0;
let AiDirection=0;
let AiSearchingDirection=1;
let AiSearchThree=0;
let AiPreviouslyHitShips=[];
let AiTempPrevShipCoord;
//Initialize sound effects and music
let shipPlacementBeep=new Audio("sound/beep.mp3");
shipPlacementBeep.volume=1;
let hitAudio=new Audio();
let missSplash=new Audio("sound/splashEffect.mp3");
//This function checks if the spot you requested to place the ship is not outside the grid, or already occupied by another ship
function checkValid(y2,x2,length,direction,user)
{	
	//If direction is up, the computer will predict if the number of pieces above the starting position is occupied or outside the grid
	if(direction=="up")
	{
		for(i=y2;i>+y2- +length;i--)
		{
			if($("#"+user+i+x2).hasClass(user+"ship")||i<0||i>8)
			{
				return false;
			}
		}
		return true;
	}
	//If direction is down, the computer will predict if the number of pieces below the starting position is occupied or outside the grid
	else if(direction=="down")
	{
		for(i=y2;i<+y2+ +length;i++)
		{
			if($("#"+user+i+x2).hasClass(user+"ship")||i<0||i>8)
			{
				return false;
			}
		}
		return true;
	}
	//If direction is left, the computer will predict if the number of pieces to the left the starting position is occupied or outside the grid
	else if(direction=="left")
	{
		for(i=x2;i>+x2- +length;i--)
		{
			if($("#"+user+y2+i).hasClass(user+"ship")||i<0||i>8)
			{
				return false;
			}
		}
		return true;
	}
	//If direction is right, the computer will predict if the number of pieces to the right the starting position is occupied or outside the grid
	else if(direction=="right")
	{
		for(i=x2;i<+x2+ +length;i++)
		{
			if($("#"+user+y2+i).hasClass(user+"ship")||i<0||i>8)
			{
				return false;
			}
		}
		return true;
	}
} //End of checkValid function
//The function below placed the ship in the boxes you requested, after running the checkValid function and making sure that the boxes you requested are valid.
function placeShip(y,x,length,direction,user)
{
	//When the user if placing the ship, the computer will make sure to place the image of the ship
	if (user!="i") 
	{
		//Computer checks which type of ship you want to place, and how many pieces it has (Ex: The carrier has 5 pieces)
		if(length==2)
		{
			tempShipClass="twoPiece";
			clickedDestroyer=true;
		}
		else if(length==3)
		{
			if(playerSubOrCruiser==1)
			{
				tempShipClass="threePiece1";
				clickedCruiser=true;
				playerSubOrCruiser--;
			}
			else
			{
				tempShipClass="threePiece2";
				clickedSubmarine=true;
				playerSubOrCruiser=1;
			}
		}
		else if(length==4)
		{
			tempShipClass="fourPiece";
			clickedBattleship=true;
		}
		else if(length==5)
		{
			tempShipClass="fivePiece";
			clickedCarrier=true;
		}
		else
		{
			tempShipClass="null";
		}
		//If the direction is up, a certain number of boxes will be placed on top of the starting position. The appropriate images will also be placed.
		if(direction=="up")
		{
			boxesPlaced=length;
			directionImagePlacement="";
			for(i=y;i>+y- +length;i--)
			{			
				$("#"+user+i+x).addClass(user+"ship");		
				$("#"+user+i+x).text(".");
				$("#"+user+i+x).addClass(tempShipClass);
				$("#"+user+i+x).css({"background-image": "url("+shipRequested+boxesPlaced+directionImagePlacement+".png)"});
				boxesPlaced--;			
				$("#"+user+i+x).addClass("noBorder");	
				shipPlacementBeep.play();
			}
		}
		//If the direction is down, a certain number of boxes will be placed below the starting position. The appropriate images will also be placed.
		else if(direction=="down")	
		{
			boxesPlaced=length;
			directionImagePlacement="Down";
			for(i=y;i<+y+ +length;i++)
			{			
				$("#"+user+i+x).addClass(user+"ship");
				$("#"+user+i+x).text(".");
				$("#"+user+i+x).addClass(tempShipClass);
				$("#"+user+i+x).css({"background-image":"url("+shipRequested+boxesPlaced+directionImagePlacement+".png)"});
				boxesPlaced--;				
				$("#"+user+i+x).addClass("noBorder");
				shipPlacementBeep.play();
			}
		} 
		//If the direction is left, a certain number of boxes will be placed to the left of the starting position. The appropriate images will also be placed.
		else if(direction=="left")
		{
			boxesPlaced=length;
			directionImagePlacement="Left";
			for(i=x;i>+x- +length;i--)
			{		
				$("#"+user+y+i).addClass(user+"ship");
				$("#"+user+y+i).text(".");
				$("#"+user+y+i).addClass(tempShipClass);
				$("#"+user+y+i).css({"background-image":"url("+shipRequested+boxesPlaced+directionImagePlacement+".png)"});
				boxesPlaced--;	
				$("#"+user+y+i).addClass("noBorder");	
				shipPlacementBeep.play();
			}
		} 
		//If the direction is right, a certain number of boxes will be placed to the right of the starting position. The appropriate images will also be placed.
		else if(direction=="right")
		{
			boxesPlaced=length;
			directionImagePlacement="Right";
			for(i=x;i<+x+ +length;i++)
			{		
				$("#"+user+y+i).addClass(user+"ship");
				$("#"+user+y+i).text(".");
				$("#"+user+y+i).addClass(tempShipClass);
				$("#"+user+y+i).css({"background-image":"url("+shipRequested+boxesPlaced+directionImagePlacement+".png)"});
				boxesPlaced--;
				$("#"+user+y+i).addClass("noBorder");	
				shipPlacementBeep.play();
			}
		}
		$("#shipPlacementBoard").css({"opacity":"0.3"});
		$("#controlShipPlacement").css({"opacity":"1"});
		$("#hitOrMiss").text("Select another ship from the right");
		//When all ships have been placed, the game screen where you shoot the enemies will be shown, while the current game screen while disappear.
		if (clickedDestroyer==true && clickedCruiser==true && clickedSubmarine==true && clickedBattleship==true && clickedCarrier==true) 
		{
			$("#aiBoardStatus").css({"display":"block"});
			$("#controlShipPlacement").css({"display":"none"});
			$("#scoreboard").css({"display":"block"});
			$("#aiScoreBoard").css({"display":"block"});
			shipRequested="";
			boxesPlaced=0;
			directionImagePlacement="";
			$("#displayTurns").show();
			$("#missileLockLocation").show();
			$("#shipPlacementBoard").css({"opacity":"0.5"});
			$("#previousTurnInformation").hide();
			$("#hitOrMiss").text("Get started by shooting at an enemy coordinate.");
			$("#previousTurnInformation").slideDown(400);
			setTimeout(function() 
			{
				$("#previousTurnInformation").slideUp(400);
			}, 7000);
		}
	}
	//When the AI is placing its ships, the computer will store the data in arrays, but it will not be visible to the user.
	if (user=="i") 
	{
		if(length==2)
		{
			tempShipClass="twoPiece";
		}
		else if(length==3)
		{
			if(playerSubOrCruiser==1)
			{
				tempShipClass="threePiece1";
				playerSubOrCruiser--;
			}
			else
			{
				tempShipClass="threePiece2";
				playerSubOrCruiser=1;
			}
		}
		else if(length==4)
		{
			tempShipClass="fourPiece";
		}
		else if(length==5)
		{
			tempShipClass="fivePiece";
		}
		else
		{
			tempShipClass="null";
		}
		//AI placing ships upwards
		if(direction=="up")
		{
			boxesPlaced=length;
			directionImagePlacement="";
			for(i=y;i>+y- +length;i--)
			{			
				$("#"+user+i+x).addClass(user+"ship");		
				$("#"+user+i+x).addClass(tempShipClass);
				boxesPlaced--;			
				shipPlacementBeep.play();
			}
		}
		//AI placing ships downwards
		else if(direction=="down")	
		{
			boxesPlaced=length;
			directionImagePlacement="Down";
			for(i=y;i<+y+ +length;i++)
			{			
				$("#"+user+i+x).addClass(user+"ship");
				$("#"+user+i+x).addClass(tempShipClass);
				boxesPlaced--;				
				shipPlacementBeep.play();
			}
		} 
		//AI placing ships to the left
		else if(direction=="left")
		{
			boxesPlaced=length;
			directionImagePlacement="Left";
			for(i=x;i>+x- +length;i--)
			{		
				$("#"+user+y+i).addClass(user+"ship");
				$("#"+user+y+i).addClass(tempShipClass);
				boxesPlaced--;	
				shipPlacementBeep.play();
			}
		} 
		//AI placing ships to the right
		else if(direction=="right")
		{
			boxesPlaced=length;
			directionImagePlacement="Right";
			for(i=x;i<+x+ +length;i++)
			{		
				$("#"+user+y+i).addClass(user+"ship");
				$("#"+user+y+i).addClass(tempShipClass);
				boxesPlaced--;
				shipPlacementBeep.play();
			}
		}
	}
} //End of placeShip function
//This function makes sure the user cannot place the same ship again, by disabled buttons and altering CSS properties. It also shows the user if their previous placement was valid or invalid.
function tryShip(y,x,type,direction)
{
	if(checkValid(y,x,type,direction,""))
	{
		placeShip(y,x,type,direction,"");
		$("#info").text("Ship Placed!");
		$("#info").css({"color":"green"});
		if (inputType==2) 
		{
			$("#sizeTwoShip").attr("disabled","true");
			$('#sizeTwoShip').css({"opacity": "0.4"});
		}
		else if (inputType==3&&subOrCruiser==1) 
		{
			$("#sizeThreeShip1").attr("disabled","true");
			$('#sizeThreeShip1').css({"opacity": "0.4"});
		}
		else if (inputType==3&&subOrCruiser==2) 
		{
			$("#sizeThreeShip2").attr("disabled","true");
			$('#sizeThreeShip2').css({"opacity": "0.4"});
		}
		else if (inputType==4) 
		{
			$("#sizeFourShip").attr("disabled","true");
			$('#sizeFourShip').css({"opacity": "0.4"});
		}
		else if (inputType==5) 
		{
			$("#sizeFiveShip").attr("disabled","true");
			$('#sizeFiveShip').css({"opacity": "0.4"});
		}
		inputType=-1;
	}
	else
	{
		$("#info").text("Invalid Slot");
		$("#info").css({"color":"red"});
	}
}//End of tryShip function
//This function will display the outline of how the ship will look when it is placed on the board. This allows the player to visualize, and finalize their ship placement.
function showShipOutline(y,x,length,direction)
{
	for(n=0;n<currentShipOutline.length;n++)
	{
		$("#"+(currentShipOutline[n][0])+currentShipOutline[n][1]).removeClass("shipOutline");
	}
	if(direction=="up")
	{
		for(n=y;n>+y- +length;n--)
		{
			$("#"+n+x).addClass("shipOutline");
			currentShipOutline[y-n]=[n,x];
		}
	} 
	else if(direction=="down")
	{
		for(n=y;n<+y+ +length;n++)
		{
			$("#"+n+x).addClass("shipOutline");
			currentShipOutline[n-y]=[n,x];
		}
	} 
	else if(direction=="left")
	{
		for(n=x;n>+x- +length;n--)
		{
			$("#"+y+n).addClass("shipOutline");
			currentShipOutline[x-n]=[y,n];
		}
	} 
	else if(direction=="right")
	{
		for(n=x;n<+x+ +length;n++)
		{
			$("#"+y+n).addClass("shipOutline");
			currentShipOutline[n-x]=[y,n];
		}
	}
}//End of showShipOutline function
//This function makes sure you cannot place the same ship again, by disabling the one you already placed.
function cycleShips()
{
	for(ship=1;ship<=4;ship++)
	{
		if($("#"+ship).prop("disabled")!=true)
		{
			return ship;
		}
	}
	return -1;
}//End of cycleShips function
//This function randomly generates the AI board. It decides a direction, checks if that direction is not outside the grid, or on top of another ship, and finally places that ship. This function is called right at the beginning of the game.
function generateAiBoard()
{
	let aiY;
	let aiX;
	let satisfied=0;
	let aiThrees=2;
	let aiNumberDirection=0;
	let aiDirection;
	//This for loop will run to ensure one of every ship is placed on the board
	for(aiShip=2;aiShip<=5;aiShip++)
	{
		aiNumberDirection=Math.round(Math.random()*3+1);
		if(aiNumberDirection==1)
		{
			aiDirection="up";
		}
		else if(aiNumberDirection==2)
		{
			aiDirection="right";
		}
		else if(aiNumberDirection==3)
		{
			aiDirection="down";
		}
		else if(aiNumberDirection==4)
		{
			aiDirection="left";
		}
		satisfied=0;
		//Once the ship placement is valid, the ship will finally place. If not, this while loop will keep running until one combination works.
		while(satisfied=1)
		{
			aiY=Math.round(Math.random()*8);
			aiX=Math.round(Math.random()*8);
			if(checkValid(aiY,aiX,aiShip,aiDirection,"i"))
			{
				placeShip(aiY,aiX,aiShip,aiDirection,"i");
				break;				
			}
		}
		if(aiThrees>0)
		{
			aiThrees--;
			aiShip=2;
		}
	}
}//End of generateAiBoard function
//This function is called when a user wants to shoot at another ship. The function checks if you have hit or missed by checking if a box has a certain CSS property.
function fire(attackCoord, target)
{	
	//If the location you shoot at has a certain class, it means you have hit. Sound effects and animations will be played.
	if ($("#"+attackCoord).hasClass(target+"ship"))
	{
		randomHitAudio=Math.round(1+Math.random()*2);
		hitAudio.src="sound/hit"+randomHitAudio+".mp3";
		hitAudio.play();
		$("#"+attackCoord).addClass("hit"+target);
		$("#shipPlacement").effect("shake", "fast", "5000");
		$("#"+attackCoord).removeClass(target+"ship");
		$("#info").text("Hit!");
		$("#"+attackCoord).attr("disabled",true);		
		//If you are shooting at the AI, the boxes will either turn red or white.
		if(target=="i")
		{
			$("#"+attackCoord).addClass("disabled");
			tempShipAttack=$("#"+attackCoord).prop('className').split(' ')[1];
			AiShips[shipIndex.indexOf(tempShipAttack)][1]--;
			//Pair the health bar to what ship was attacked (AI Health)
			if (AiShips[shipIndex.indexOf(tempShipAttack)][0]=="twoPiece") 
			{
				$("#aiDestroyerHealthBar").attr("value", AiShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(AiShips[shipIndex.indexOf(tempShipAttack)][0]=="threePiece1") 
			{
				$("#aiCruiserHealthBar").attr("value", AiShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(AiShips[shipIndex.indexOf(tempShipAttack)][0]=="threePiece2") 
			{
				$("#aiSubmarineHealthBar").attr("value", AiShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(AiShips[shipIndex.indexOf(tempShipAttack)][0]=="fourPiece") 
			{
				$("#aiBattleshipHealthBar").attr("value", AiShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(AiShips[shipIndex.indexOf(tempShipAttack)][0]=="fivePiece") 
			{
				$("#aiCarrierHealthBar").attr("value", AiShips[shipIndex.indexOf(tempShipAttack)][1]);
			}			
			AiShips[5]--;
			if(AiShips[shipIndex.indexOf(tempShipAttack)][1]==0)
			{
				if($("#"+attackCoord).prop('className').split(' ')[1]=="threePiece1")
				{					
					$(".AiBoard.threePiece1").css({"background-color":"black"});
					justSunkShipName="The AI's Cruiser";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="threePiece2")
				{
					$(".AiBoard.threePiece2").css({"background-color":"black"});
					justSunkShipName="The AI's Submarine";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="fourPiece")
				{
					$(".AiBoard.fourPiece").css({"background-color":"black"});
					justSunkShipName="The AI's Battleship";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="fivePiece")
				{
					$(".AiBoard.fivePiece").css({"background-color":"black"});
					justSunkShipName="The AI's Carrier";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="twoPiece")
				{
					$(".AiBoard.twoPiece").css({"background-color":"black"});
					justSunkShipName="The AI's Destroyer";
				}
			}
			$("#hitOrMiss").text("You HIT the AI!");
			$("#previousTurnInformation").slideDown("fast");
			setTimeout(function() 
			{
				$("#previousTurnInformation").slideUp("fast");
				$("#btnClickAiTurn").show();
			}, 2000);
		}
		//if the AI is shooting at your, CSS animations will be played to show your boat piece sinking and fading away.
		else if(target=="")
		{
			$("#"+attackCoord).append("<img id='"+attackCoord+"Image"+"' src='images/explosion.gif' class='animationImage'>");
			setTimeout(function() 
			{
				$("#"+attackCoord+"Image").remove();
				$("#"+attackCoord).fadeTo(2400, 0.2);
			}, 1400);
			tempShipAttack=$("#"+attackCoord).prop('className').split(' ')[1];
			playerShips[shipIndex.indexOf(tempShipAttack)][1]--;
			//Pair the health bar to what ship was attacked (Your Health)
			if (playerShips[shipIndex.indexOf(tempShipAttack)][0]=="twoPiece") 
			{
				$("#destroyerHealthBar").attr("value", playerShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(playerShips[shipIndex.indexOf(tempShipAttack)][0]=="threePiece1") 
			{
				$("#submarineHealthBar").attr("value", playerShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(playerShips[shipIndex.indexOf(tempShipAttack)][0]=="threePiece2") 
			{
				$("#cruiserHealthBar").attr("value", playerShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(playerShips[shipIndex.indexOf(tempShipAttack)][0]=="fourPiece") 
			{
				$("#battleshipHealthBar").attr("value", playerShips[shipIndex.indexOf(tempShipAttack)][1]);
			}
			else if(playerShips[shipIndex.indexOf(tempShipAttack)][0]=="fivePiece") 
			{
				$("#carrierHealthBar").attr("value", playerShips[shipIndex.indexOf(tempShipAttack)][1]);
			}			
			playerShips[5]--;
			if(AiSearching>0&&$("#"+attackCoord).prop('className').split(' ')[1]!=$("#"+AiFirstHit[0]+""+AiFirstHit[1]).prop('className').split(' ')[1]&&checkAlreadyLogged(attackCoord)!=true)
			{
				AiPreviouslyHitShips.unshift(attackCoord);
			}

			if(AiFirstHit.length==0)
			{
				AiFirstHit=[attackCoord.charAt(0),attackCoord.charAt(1)];
				tempChoiceY=AiFirstHit[0];
				tempChoiceX=AiFirstHit[1];
				AiSearching=1;
			}
			else
			{
				AiSearching=3;
				AiDirection=AiSearchingDirection;
			}

			if(playerShips[shipIndex.indexOf(tempShipAttack)][1]==0)
			{
				if($("#"+attackCoord).prop('className').split(' ')[1]=="threePiece1")
				{
					justSunkShipName="Your Cruiser";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="threePiece2")
				{
					justSunkShipName="Your Submarine";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="fourPiece")
				{
					justSunkShipName="Your Battleship";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="fivePiece")
				{
					justSunkShipName="Your Carrier";
				}
				else if($("#"+attackCoord).prop('className').split(' ')[1]=="twoPiece")
				{
					justSunkShipName="Your Destroyer";
				}
				AiSunkShip=1;
				AiContinue=0;
				AiTries=0;
				AiDirection=0;
				AiSearching=0;
				if($("#"+attackCoord).prop('className').split(' ')[1]!=$("#"+AiFirstHit[0]+""+AiFirstHit[1]).prop('className').split(' ')[1])
				{
					removeSunkLog($("#"+attackCoord).prop('className').split(' ')[1]);
					AiPreviouslyHitShips.push(AiFirstHit[0]+""+AiFirstHit[1]);
				}
				AiFirstHit=[];
			}
			$("#hitOrMiss").text("The AI HIT You! It is your turn!");
			$("#previousTurnInformation").slideDown("fast");
			setTimeout(function() 
			{
				$("#previousTurnInformation").slideUp("fast");
				$("#aiBoardStatus").css({"opacity":"1"});
				$(".AiBoard").attr("disabled", false);
				$("#shipPlacementBoard").css({"opacity":"0.5"});
				$("#scoreboard").css({"opacity":"0.2"});
				$("#aiScoreBoard").css({"opacity":"1"});
			}, 2000);
		}
	}
	//When you miss your shot, the computer will identify that you missed and play certain animations
	else if (target=="i")
	{
		$("#"+attackCoord).addClass("miss");
		$("#"+attackCoord).attr("disabled",true);
		$("#hitOrMiss").text("You MISSED the AI!");
		missSplash.play();
		youShotsMissed++;
		$("#previousTurnInformation").slideDown("fast");
		setTimeout(function() 
		{
			$("#previousTurnInformation").slideUp("fast");
			$("#btnClickAiTurn").show();
		}, 2000);		
	}
	//When the AI misses its shot on you, the computer will identify that the AI missed and will play certain animations.
	else
	{
		$("#"+attackCoord).addClass("miss");
		$("#info").text("Miss!");
		$("#"+attackCoord).attr("disabled",true);
		$("#"+attackCoord).css({"background-image":"url(images/whirlPool.gif)", "background-color": "transparent"});
		missSplash.play();
		$("#"+attackCoord).fadeTo(2000, 0.1);
			setTimeout(function() 
			{
				$("#"+attackCoord).fadeTo(0, 1);
				$("#"+attackCoord).css({"background-image":"url()", "background-color":"white"});
			}, 1900);
		$("#hitOrMiss").text("The AI Missed! It is your turn!");
		aiShotsMissed++;
		$("#previousTurnInformation").slideDown("fast");
		setTimeout(function() 
		{
			$("#previousTurnInformation").slideUp("fast");
			$("#aiBoardStatus").css({"opacity":"1"});
			$(".AiBoard").not(".disabled").attr("disabled", false);
			$("#shipPlacementBoard").css({"opacity":"0.5"});
			$("#scoreboard").css({"opacity":"0.2"});
			$("#aiScoreBoard").css({"opacity":"1"});
		}, 2000);
		if(target=="")
		{
			AiMiss=1;			
		}
		if(target==i){
			$("#"+attackCoord).addClass("disabled");
		}
	}
	//After you have shot at the AI, the AI will take its turn
	if(target=="i")
	{

		$("#missileLockLocation").hide();
		$("#aiBoardStatus").css({"opacity":"0.5"});
		$(".AiBoard").attr("disabled", true);
		Turn(turn);
	}
}//End of fire function
//This function makes sure the AI doesn't fire at a location outside the grid, or at location it already fired at.
function checkAlreadyLogged(loggingCoords)
{
	for(m=0;m<AiPreviouslyHitShips.length;m++)
	{
		if($("#"+AiPreviouslyHitShips[m]).prop('className').split(' ')[1]==$("#"+loggingCoords).prop('className').split(' ')[1])
		{
			return true;
		}
	}
	return false;
}
function removeSunkLog(loggingClass)
{
	for(m=0;m<AiPreviouslyHitShips.length;m++)
	{
		if($(loggingClass==$("#"+AiPreviouslyHitShips[m]).prop('className').split(' ')[1]))
		{
			AiPreviouslyHitShips.splice(m,1);
			break;
		}
	}
}
function decideOnMove()
{
	/*
		HOW THE AI WORKS:
		The AI begins by searching around the board randomly, and upon hitting a ship, begins its searching 
		routine. It will look around the hit area for another ship piece. Upon finding another piece, 
		it will create a "line" to search the pieces for. If it searches an entire line without sinking
		a ship, it will go back to its first hit point and search the perpendicular line for the rest of the original ship.
		-If a ship is destroyed using more bullets than its size, the ai will assume that there are more ships next to it.
		-Depending on how many ships the ai thinks there are, he will search that far into the ship from each end.
		-Upon finding a potential ship, normal ship attacking routines will continue.
	*/
	if(AiPreviouslyHitShips.length>0&&AiSearching==0)
	{
		AiTempPrevShipCoord=AiPreviouslyHitShips.pop();
		tempChoiceY=AiTempPrevShipCoord.charAt(0);
		tempChoiceX=AiTempPrevShipCoord.charAt(1);
		AiSearching=1;
		AiFirstHit=AiTempPrevShipCoord;
	}
	if(AiMiss==1&&AiFirstHit.length>0)
	{
		if(AiSearching==2)
		{
			AiSearching=1;
		}
		else{
			if(AiDirection==1)
			{
				AiDirection=2;
			}
			else if(AiDirection==2)
			{
				AiDirection=1;
			}
			else if(AiDirection==3)
			{
				AiDirection=4;
			}
			else if(AiDirection==4)
			{
				AiDirection=3;
			}
			if(AiSearchThree>1)
			{
				AiSearchThree=0;
				AiSearching=2;
				AiMiss=1;
				return decideOnMove();
			}
		}
		tempChoiceY=AiFirstHit[0];
		tempChoiceX=AiFirstHit[1];
	}
	AiMiss=0;
	if(AiSearching==1)
	{
		AiSearchingDirection++;
		if(AiSearchingDirection>4)
		{
			AiSearchingDirection=1;
		}
		

		AiSearching=2;
	}
	if(AiSearching==2){
		while($("#"+tempChoiceY+""+tempChoiceX).hasClass("hit"))
		{
			if(AiSearchingDirection==1)
			{
				tempChoiceY++;
			}
			else if(AiSearchingDirection==2)
			{
				tempChoiceY--;
			}
			else if(AiSearchingDirection==3)
			{
				tempChoiceX++;
			}
			else if(AiSearchingDirection==4)
			{
				tempChoiceX--;
			}
		}
		if($("#"+tempChoiceY+""+tempChoiceX).hasClass("hit")||$("#"+tempChoiceY+""+tempChoiceX).hasClass("miss")||$("#"+tempChoiceY+""+tempChoiceX).hasClass("board")!=true)
		{
			AiMiss=1;
			if(AiSearching==3)
			{
				AiSearchThree++;
			}
			return decideOnMove();
		}
	}
	else if(AiSearching==3)
	{
		while($("#"+tempChoiceY+""+tempChoiceX).hasClass("hit"))
		{
			if(AiDirection==1)
			{
				tempChoiceY++;
			}
			else if(AiDirection==2)
			{
				tempChoiceY--;
			}
			else if(AiDirection==3)
			{
				tempChoiceX++;
			}
			else if(AiDirection==4)
			{
				tempChoiceX--;
			}
		}
		if($("#"+tempChoiceY+""+tempChoiceX).hasClass("hit")||$("#"+tempChoiceY+""+tempChoiceX).hasClass("miss")||$("#"+tempChoiceY+""+tempChoiceX).hasClass("board")!=true)
		{
			AiMiss=1;
			if(AiSearching==3)
			{
				AiSearchThree++;
			}
			return decideOnMove();
		}
	}
	else
	{
		while($("#"+tempChoiceY+""+tempChoiceX).hasClass("hit")||$("#"+tempChoiceY+""+tempChoiceX).hasClass("miss"))
		{
			tempChoiceY=Math.round(Math.random()*8);
			tempChoiceX=Math.round(Math.random()*8);
		}
	}
	if($("#"+tempChoiceY+""+tempChoiceX).hasClass("hit")||$("#"+tempChoiceY+""+tempChoiceX).hasClass("miss")||$("#"+tempChoiceY+""+tempChoiceX).hasClass("board")!=true)
	{
		AiMiss=1;
		if(AiSearching==3)
		{
			AiSearchThree++;
		}
		return decideOnMove();
	}
	return tempChoiceY+""+tempChoiceX;
}//End of decideOnMove function
//This function keeps the turn system in order. When you have gone, the AI turn will be called. When the AI has gone, your turn will be called.
function Turn()
{
	if(turn=="player")
	{
		if(AiShips[5]==0)
		{
			win("player");
		}
		else
		{
			turn="AI";
			Turn(turn);
		}
	}
	else if(turn=="AI")
	{	
		let temptmtptmp=decideOnMove();
		if(clickAiTurn==1)
		{
			fire(temptmtptmp,"");
			turn="player";
			if(playerShips[5]==0)
			{
				win("AI");
			}
			clickAiTurn=0;
		}	
	}
	else
	{
		if(win=="player")
		{
		}
		else if(win=="AI")
		{
		}
	}
}//End of decideOnMove function
//This function checks if you have won, by checking if all of the AI's pieces have been sunk. It also checks if you lost, by checking if all your pieces are sunk.
function win(win)
{
	endDate = new Date();
	if(win=="player")
	{	
		$("#winOrLose").text("You have WON the war!");	
	}
	else if(win=="AI")
	{
		$("#winOrLose").text("You have LOST the war!");
	}
	//Set up game statistics
	$("#timeElapsed").text("The war lasted "+(Math.round(((endDate-startDate)/1000)/60))+" months.");
	$('#aiShipsPiecesHit').text("You hit the enemy "+(17-AiShips[5])+" times.");
	$("#aiShipsMissed").text("You missed "+youShotsMissed+" shots on the enemy ships");
	$("#yourShipsHit").text("Your enemy hit you "+(17-playerShips[5])+" times");
	$("#yourShipsMissed").text("Your enemy missed you "+aiShotsMissed+" times");
	//Show the next game screen
	$("#endGameScreen").show();
	$("#shipPlacement").hide();
}// End of win function
//This function converts the array coordinates into alphanumeric coordinates, like in the real game battleship. (Ex: 8,8 => I9)
function checkMissileLockOn(id) 
{
	//Converts to the number component of the alphanumeric coordinate
	if (id.charAt(2)=="0") 
	{
		numericCoordinate="1";
	}
	else if (id.charAt(2)=="1") 
	{
		numericCoordinate="2";
	}
	else if (id.charAt(2)=="2") 
	{
		numericCoordinate="3";
	}
	else if (id.charAt(2)=="3") 
	{
		numericCoordinate="4";
	}
	else if (id.charAt(2)=="4") 
	{
		numericCoordinate="5";
	}
	else if (id.charAt(2)=="5") 
	{
		numericCoordinate="6";
	}
	else if (id.charAt(2)=="6") 
	{
		numericCoordinate="7";
	}
	else if (id.charAt(2)=="7") 
	{
		numericCoordinate="8";
	}
	else if (id.charAt(2)=="8") 
	{
		numericCoordinate="9";
	}
	//Converts to the letter component of the alphanumeric coordinate 
	if (id.charAt(1)=="0") 
	{
		alphaCoordinate="A";
	}
	else if (id.charAt(1)=="1") 
	{
		alphaCoordinate="B";
	}
	else if (id.charAt(1)=="2") 
	{
		alphaCoordinate="C";
	}
	else if (id.charAt(1)=="3") 
	{
		alphaCoordinate="D";
	}
	else if (id.charAt(1)=="4") 
	{
		alphaCoordinate="E";
	}
	else if (id.charAt(1)=="5") 
	{
		alphaCoordinate="F";
	}
	else if (id.charAt(1)=="6") 
	{
		alphaCoordinate="G";
	}
	else if (id.charAt(1)=="7") 
	{
		alphaCoordinate="H";
	}
	else if (id.charAt(1)=="8") 
	{
		alphaCoordinate="I";
	}
	//Puts both numbers together to form the final alphanumeric coordinate, and returns it.
	return(alphaCoordinate+numericCoordinate);
}//End of checkMissileLockOn function
$(document).ready(function($)
{ 		 
	//Set up music
	var bgMusic = document.getElementById("musicPlayer");
  	bgMusic.volume = 0.3;
	//Generate the AI board
	generateAiBoard();
	//When any button is pressed, the title screen will disappear, and will show the ship placement screen
	$("body").keypress(function(event)
	{
		if (anyButton==0) 
		{
			$("#previousTurnInformation").fadeIn(500);
			$("#titleScreen").hide();
			$("#shipPlacement").show();
			$("#shipPlacementBoard").css({"opacity":"0.5"});
			$("#scoreboard").css({"opacity":"0.2"});
			$("#aiScoreBoard").css({"opacity":"1"});
			shipPlacementBeep.play();
			startDate = new Date();
		}
		anyButton=1;		
	});
	//When the exit button is clicked, the game will close
	$("#btnExit").click(function(event) 
	{
		window.location.replace("http://sdsscomputers.com/HaridasanTarun")
	});
	//When the play again button is clicked, the game will restart.
	$("#btnPlayAgain").click(function(event){
		window.location.replace("index.html");
	});
	//When a box on the grid is clicked, it will try to place the ship into one of the boxes.
	$(".board").click(function(event)
	{
		if($(this).hasClass("miss")==false&&$(this).hasClass("hit")==false&&$(this).hasClass("ship")==false&&inputType!=-1)
		{
			$("#info").text(tryShip(hoverYCoord,hoverXCoord,inputType,inputDirection));	
		} 
		else
		{
			$("#info").text("Invalid Slot");
		}
	});
	//Displays the outline of the ship when you hover over the grid.
	$(".board").hover(function(event)
	{
		hoverYCoord=$(this).attr('id').charAt(0);
		hoverXCoord=$(this).attr('id').charAt(1);
		showShipOutline(hoverYCoord,hoverXCoord,inputType,inputDirection);
	});
	//When you click a box on the AI board, it will fire a torpedo to that location.
	$(".AiBoard").click(function(event)
	{
		$(this).attr("disabled", true);
		$(this).addClass("disabled");
		if(turn=="player")
		{
			attack=$(this).attr('id');
			fire(attack,"i");
		}
	});
	//During the ship placement screen, the player can select which type of ship they want to place by clicking one of five buttons.
	$("#sizeTwoShip").click(function(event)
	{
		$("#shipPlacementBoard").css({"opacity":"1"});
		$("#controlShipPlacement").css({"opacity":"0.3"});
		$("#hitOrMiss").text("Place the ship on the board. Use W,A,S,D to rotate.");
		shipRequested="images/shipDestroyer";
		$("#info").text("...");
		$("#info").removeAttr("style");
		inputType=2;
		inputDirection="up";
		showShipOutline(hoverYCoord,hoverXCoord,inputType,inputDirection);
	});
	$("#sizeThreeShip1").click(function(event)
	{		
		$("#shipPlacementBoard").css({"opacity":"1"});
		$("#controlShipPlacement").css({"opacity":"0.3"});
		$("#hitOrMiss").text("Place the ship on the board. Use W,A,S,D to rotate.");
		shipRequested="images/shipCruiser";
		$("#info").text("...");
		$("#info").removeAttr("style");
		subOrCruiser=1;
		inputType=3;
		inputDirection="up";
		showShipOutline(hoverYCoord,hoverXCoord,inputType,inputDirection);
	});
	$("#sizeThreeShip2").click(function(event)
	{
		$("#shipPlacementBoard").css({"opacity":"1"});
		$("#controlShipPlacement").css({"opacity":"0.3"});
		$("#hitOrMiss").text("Place the ship on the board. Use W,A,S,D to rotate.");
		shipRequested="images/shipSubmarine";
		$("#info").text("...");
		$("#info").removeAttr("style");
		subOrCruiser=2;
		inputType=3;
		inputDirection="up";
		showShipOutline(hoverYCoord,hoverXCoord,inputType,inputDirection);
	});
	$("#sizeFourShip").click(function(event)
	{
		$("#shipPlacementBoard").css({"opacity":"1"});
		$("#controlShipPlacement").css({"opacity":"0.3"});
		$("#hitOrMiss").text("Place the ship on the board. Use W,A,S,D to rotate.");
		shipRequested="images/shipBattleship";
		$("#info").text("...");
		$("#info").removeAttr("style");
		inputType=4;
		inputDirection="up";
		showShipOutline(hoverYCoord,hoverXCoord,inputType,inputDirection);
	});
	$("#sizeFiveShip").click(function(event)
	{
		$("#shipPlacementBoard").css({"opacity":"1"});
		$("#controlShipPlacement").css({"opacity":"0.3"});
		$("#hitOrMiss").text("Place the ship on the board. Use W,A,S,D to rotate.");
		shipRequested="images/shipCarrier";
		$("#info").text("...");
		$("#info").removeAttr("style");
		inputType=5;
		inputDirection="up";
		showShipOutline(hoverYCoord,hoverXCoord,inputType,inputDirection);
	});	
	$("#btnClickAiTurn").click(function(event)
	{
		$("#aiBoardStatus").css({"opacity":"0.5"});
		$(".AiBoard").attr("disabled", true);
		$("#shipPlacementBoard").css({"opacity":"1"});
		$("#scoreboard").css({"opacity":"1"});
		$("#aiScoreBoard").css({"opacity":"0.2"});
		clickAiTurn=1;
		Turn();
		$("#btnClickAiTurn").hide();		
		setTimeout(function() 
		{
			$("#missileLockLocation").show();
		},2000);
	});
	//Checks for the W,A,S,D buttons to be pressed. When they are pressed, the ship will rotate to the left, right, down, or up.
	$(document).keydown(function(e) 
	{
		if(e.which==87)
		{
			inputDirection="up";
		}
		else if(e.which==65)
		{
			inputDirection="left";
		}
		else if(e.which==83)
		{
			inputDirection="down";
		}
		else if(e.which==68)
		{
			inputDirection="right";
		}
		//When there is a change in the direction, the outline of the ship will also be updated real time.
		showShipOutline(hoverYCoord,hoverXCoord,inputType,inputDirection);
	});
	//Check for which box is being hovered to update and display the alphanumeric coordinates to user
	$(".AiBoard").mouseover(function() 
	{
		$("#missileLockLocation").val(checkMissileLockOn(this.id));
	});

}); //End of document ready function