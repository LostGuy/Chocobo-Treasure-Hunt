//Stages and Output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");
var battleGround = document.querySelector("#battleGround");
var vivi = document.querySelector("#vivi");
var dagger = document.querySelector("#dagger");
var zidane = document.querySelector("#zidane");
var quina = document.querySelector("#quina");
var amarant = document.querySelector("#amarant");
var eiko = document.querySelector("#eiko");
var freya = document.querySelector("#freya");
var fflogo = document.querySelector("#fflogo");


//Player Variables
var potions = 1;
var gil = 0;
var exp = 0;
var ChocoboHP = 10;
var gameMessage = "Use the arrow keys to make your way to the Moogle.";
var lvlup = 25;
var ChocoboMaxHP = 10;
var eaten = false;

//Audio Variable
var chocoboMusic = new Audio("../audio/chocobo.mp3");
chocoboMusic.loop = true;


//Map

var map =
[
	[0,0,0,2,1,0],
	[0,2,1,1,0,2],
	[2,1,0,3,1,0],
	[0,0,2,1,0,0],
	[1,2,1,0,0,2],
	[1,0,0,2,0,0]	
];

//Game Objects Array

var gameObjects =
[
	[4,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,5]
];

//Map Code Places

var NOTHING = 0;
var ENEMY = 1;
var TREASURE = 2;
var MOOGLE = 3;
var CHOCOBO = 4;
var CHOCOBOEATER = 5;

//Key Codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//Chocobo Positions
var chocoboRow;
var chocoboColumn;
var chocoboEaterRow;
var chocoboEaterColumn;

//Cell Size
var SIZE = 64;

//Rows and Columns
var ROWS = map.length
var COLUMNS = map[0].length;

window.addEventListener("keydown", keydownHandler, false);

render();

function render()
{
	chocoboMusic.play();
	if(stage.hasChildNodes())
	{
		for(var i = 0; i < ROWS * COLUMNS; i++)
		{
			stage.removeChild(stage.firstChild);
		}
	}
	
	for(var row = 0; row < ROWS; row++)
	{
		for(var column = 0; column < COLUMNS; column++)
		{
			if(gameObjects[row][column] === CHOCOBO)
			{
				chocoboRow = row;
				chocoboColumn = column;
			}
			
			if(gameObjects[row][column] === CHOCOBOEATER)
			{
				chocoboEaterRow = row;
				chocoboEaterColumn = column;
			}
		}
	}

	for(var row = 0; row < ROWS; row++)
	{
		for(var column = 0; column < COLUMNS; column++)
		{
			var cell = document.createElement("img");
			
			cell.setAttribute("class", "cell");
			
			stage.appendChild(cell);
			
			switch( map[row][column])
			{
				case NOTHING:
					cell.src = "../images/nothing.png";
					break;
					
				case ENEMY:
					cell.src = "../images/Flan.png";
					break;
					
				case TREASURE:
					cell.src = "../images/chest.png";
					break;
					
				case MOOGLE:
					cell.src = "../images/moogle.png";
					break;
			}
			
			switch(gameObjects[row][column])
			{
				case CHOCOBO:
				cell.src = "../images/chocobo.png";
				break;
				
				case CHOCOBOEATER:
				cell.src = "../images/chocoboeater.png";
				break;
			}
			
			cell.style.top = row * SIZE + "px";
			cell.style.left = column * SIZE + "px";
		}
	}
	output.innerHTML = gameMessage;
	
	output.innerHTML += "<br>" + "Chocobo's HP: " + ChocoboHP 
	+ "<br>" + "Gil: " + gil 
	+ "<br>" + "Potions: " + potions 
	+ "<br>" + "Exp: " + exp;
}

//Arrow Key Function
function keydownHandler(event)
{
	switch(event.keyCode)
	{
		case UP:
		if(chocoboRow > 0)
		{
			gameObjects[chocoboRow][chocoboColumn] = 0;
			
			chocoboRow--;
			
			gameObjects[chocoboRow][chocoboColumn] = CHOCOBO;
			moveChocoboEater();
		}
		break;
		
		case DOWN:
		if(chocoboRow < ROWS -1)
		{
			gameObjects[chocoboRow][chocoboColumn] = 0;
			
			chocoboRow++;
			
			gameObjects[chocoboRow][chocoboColumn] = CHOCOBO;
			moveChocoboEater();
		}
		break;
		
		case LEFT:
		if(chocoboColumn > 0)
		{
			gameObjects[chocoboRow][chocoboColumn] = 0;
			
			chocoboColumn--;
			
			gameObjects[chocoboRow][chocoboColumn] = CHOCOBO;
			moveChocoboEater();
		}
		break;
		
		case RIGHT:
		if(chocoboColumn < COLUMNS - 1)
		{
			gameObjects[chocoboRow][chocoboColumn] = 0;
			
			chocoboColumn++;
			
			gameObjects[chocoboRow][chocoboColumn] = CHOCOBO;
			moveChocoboEater();
		}
		break;
	}
	
	switch(map[chocoboRow][chocoboColumn])
	{
		case NOTHING:
		break;
		
		case ENEMY:
		battle();
		break;
		
		case TREASURE:
		open();
		break;
		
		case MOOGLE:
		endGame();
		break;
	}
	
	if(ChocoboHP <= 0)
	{
		endGame();
	}
	
	
	
	if(gameObjects[chocoboRow][chocoboColumn] === CHOCOBOEATER)
	{
		var potions = 0;
		var gil = 0;
		var exp = 0;
		var ChocoboHP = 0;
		eaten = true;
		endGame();
	}
	
	render();
}

//Battle Function
function battle()
{
	ChocoboHP -= Math.ceil(Math.random() * 4);
	exp += Math.ceil(Math.random() * 10 + 1);
	gameMessage = "You fought a flan. Battle results:"
	
	//Gets rid of monster
	map[chocoboRow][chocoboColumn] = 0;
	
	if(ChocoboHP <= 1 && potions > 0)
	{
		ChocoboHP += 10;
		potions--;
		gameMessage += "<br>" + "Your Chocobo was running low on HP during that battle and consumed a potion for 10 health.";
	}

	
	if(exp >= lvlup)
	{
		ChocoboMaxHP += 10;
		ChocoboHP = ChocoboMaxHP;
		lvlup = lvlup * 2;
		gameMessage += "<br>" + "You fought a flan and leveled up!"
	}
}	

//Opens a Treasure Chest
function open()
{ 

gil += 50;
gameMessage = "You found 50 gil in the chest!"

//Gets rid of treasure
map[chocoboRow][chocoboColumn] = 0;
}

//End Game Function

function endGame()
{
	if(ChocoboHP <= 0 && !eaten)
	{
		ChocoboHP = 0;
		gameMessage = "You ran out of health, this hunt is over.";		
	}
	
	if(eaten)
	{
		 potions = 0;
		 gil = 0;
		 exp = 0;
		 ChocoboHP = 0;
		gameMessage="You have been eaten by the Chocobo Eater.";
	}
	
	else if(gil == 0)
	{
		gameMessage = "Moogle: You're not very good at this.";
		fflogo.style.display = "block";
		
		clear();
	}
	
	else if(gil == 50)
	{
		gameMessage = "Moogle: Not bad. You get a picture of Steiner!";
		
		steiner.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	else if (gil == 100)
	{
		gameMessage = "Moogle: You did well. You managed to find " + gil + "gil! You get pictures of Vivi and Steiner!";	
		
		steiner.style.display = "block";
		vivi.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	
	else if (gil == 150)
	{
		gameMessage ="Moogle: Pretty good. You get pictures of Vivi, Eiko, and Steiner!";
		
		steiner.style.display = "block";
		vivi.style.display = "block";
		eiko.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	
	else if (gil == 200)
	{
		gameMessage ="Moogle: Pretty good. You get pictures of Quina, Vivi, Eiko, and Steiner!";
		
		steiner.style.display = "block";
		vivi.style.display = "block";
		eiko.style.display = "block";
		quina.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	
	else if (gil == 250)
	{
		gameMessage ="Moogle: Pretty good. You get pictures of Amarant, Vivi, Eiko, Quina, and Steiner!";
		
		steiner.style.display = "block";
		vivi.style.display = "block";
		eiko.style.display = "block";
		quina.style.display = "block";
		amarant.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	
	else if (gil == 300)
	{
		gameMessage ="Moogle: Pretty good. You get pictures of Freya, Amarant, Vivi, Eiko, Quina, and Steiner!";
		
		steiner.style.display = "block";
		vivi.style.display = "block";
		eiko.style.display = "block";
		quina.style.display = "block";
		amarant.style.display = "block";
		freya.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	
	else if (gil == 350)
	{
		gameMessage ="Moogle: Pretty good. You get pictures of Dagger, Freya, Amarant, Vivi, Eiko, Quina, and Steiner!";
		
		steiner.style.display = "block";
		vivi.style.display = "block";
		eiko.style.display = "block";
		quina.style.display = "block";
		amarant.style.display = "block";
		freya.style.display = "block";
		dagger.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	
	else if (gil == 400)
	{
		gameMessage = "Moogle: Wow you got all of the treasure! You get all of the pictures!";
		
		steiner.style.display = "block";
		vivi.style.display = "block";
		eiko.style.display = "block";
		quina.style.display = "block";
		amarant.style.display = "block";
		freya.style.display = "block";
		dagger.style.display = "block";
		zidane.style.display = "block";
		fflogo.style.display = "block";
		
		clear();
	}
	

	
window.removeEventListener("keydown", keydownHandler, false);
}

//Moves Chocobo Eater
function moveChocoboEater()
{
	var UP = 1;
	var DOWN = 2;
	var LEFT = 3;
	var RIGHT = 4;
	
	var validDirections = [];
	
	var direction = undefined;
	
	if(chocoboEaterRow > 0)
	{
		var thingAbove = map[chocoboEaterRow - 1][chocoboEaterColumn];
		
		if(thingAbove === NOTHING)
		{
			validDirections.push(UP)
		}
	}
	
	if (chocoboEaterRow < ROWS - 1)
	{
		var thingBelow = map[chocoboEaterRow + 1][chocoboEaterColumn];
		
		if(thingBelow === NOTHING)
		{
			validDirections.push(DOWN);
		}
	}
	
	if (chocoboEaterColumn > 0)
	{
		var thingToLeft = map[chocoboEaterRow][chocoboEaterColumn - 1];
		
		if(thingToLeft === NOTHING)
		{
			validDirections.push(LEFT);
		}
	}
	
	if (chocoboEaterColumn < COLUMNS - 1)
	{
		var thingToRight = map[chocoboEaterRow][chocoboEaterColumn + 1];
		
		if(thingToRight === NOTHING)
		{
			validDirections.push(RIGHT);
		}
	}
	
	if (validDirections.length !== 0)
	{
		var randomNumber = Math.floor(Math.random() * validDirections.length);
		
		direction = validDirections[randomNumber];
	}
	
	switch(direction)
	{
		case UP:
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = 0;
		
		chocoboEaterRow--;
		
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = CHOCOBOEATER;
		break;
		
		case DOWN:
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = 0;
		
		chocoboEaterRow++;
		
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = CHOCOBOEATER;
		break;
		
		case LEFT:
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = 0;
		
		chocoboEaterColumn--;
		
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = CHOCOBOEATER;
		break;
		
		case RIGHT:
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = 0;
		
		chocoboEaterColumn++;
		
		gameObjects[chocoboEaterRow][chocoboEaterColumn] = CHOCOBOEATER;
		break;
	}
}

//Clears the board of images
function clear()
{
		
	
	for(var i = 0; i < ROWS; i++)
	{
		for(var x = 0; x < COLUMNS; x++)
		{
			map[i][x] = 0;
			gameObjects[i][x] = 0;
		}
	}
}
