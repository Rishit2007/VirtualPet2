
var dog;
var dogHappy;
var foodS;
var foodStock;
var lastFed;

function preload()
{
  //load images here
  dogImg1 = loadImage("images/dogImg.png");
  dogImg2 = loadImage("images/dogImg1.png");
}

function setup()
{

  database = firebase.database();
  createCanvas(700, 500);

  dog = createSprite(550,260,50,50);
  dog.addImage(dogImg1);
  dog.scale = 0.150;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj = new foodBottle();

  invisibleBase1 = createSprite(525,100,150,20);
  invisibleBase1.visible = false;
  invisibleBase2 = createSprite(525,280,150,20);
  invisibleBase2.visible = false;
  

 
}


function draw() 
{  
  background(46,139,87);
  foodObj.display();

  dog.bounceOff(invisibleBase1);
  dog.collide(invisibleBase2);

  drawSprites();
  //add styles here
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data)
  {
    lastFed = data.val();
  })

  fill(225,225,254);
  textSize(15);
  
  if(lastFed>=12)
  {
    text("Last Feed: "+ lastFed%12+" PM",350,30);
  }
  else if(lastFed==0)
  {
    text("Last Feed: 12 AM",350,30);
  }
  else
  {
    text("Last Feed: "+ lastFed+" AM",350,30)
  }
  
 
}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x)
{
  if (x<=0){
    x = 0;
  }
  else{
    x = x-1;
  }

  database.ref('/').update(
  {
    Food:x
  })
}

function feedDog()
{
  dog.addImage(dogImg2);
  dog.velocityY = -3;
  dog.velocityY = dog.velocityY+1;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food :foodObj.geFoodStock(),
    FeedTime:hour()
 })
}

function addFoods()
{
  foodS++;
  database.ref('/').update(
  {
    Food:foodS
  })
}



