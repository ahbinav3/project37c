var dog,database,position,food;
var foodS,foodstock;

var dogImg,dogImg1;
var garden,bedroom,washroom;
var foodObj;
var fedTime,lastFed,currentTime;
var feed,addFood;
var gameState,readState;

function preload() {
  dogImg=loadImage("images/dogimg.png");
  dogImg1=loadImage("images/dogimg1.png");
garden=loadImage("images/Garden.png");
bedroom=loadImage("images/BedRoom.png");
washroom=loadImage("images/WashRoom.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500, 500);

  fedTime=database.ref('FeedTime'); 
  foodObj=new Food();
  fedTime.on("value",function(data){ 
    lastFed=data.val();
   }); 
   
   //read game state from database
    readState=database.ref('gameState');
     readState.on("value",function(data){
        gameState=data.val();
       }) ;
      
  dog=createSprite(250,300,150,150)
dog.addImage(dogImg);
dog.scale=0.2;
foodstock=database.ref('Food');
foodstock.on("value",readStock);
feed=createButton("Feed the dog");
 feed.position(700,95);
  feed.mousePressed(feedDog);
  addFood=createButton("Add Food");
   addFood.position(800,95);
    addFood.mousePressed(addFoods);
}


function draw() {  
background("green");
currentTime=hour();
 if(currentTime==(lastFed+1)){ update("Playing");
  foodObj.garden();
 }
 else if(currentTime==(lastFed+2)){ update("Sleeping");
  foodObj.bedroom(); 
}
else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ update("Bathing");
 foodObj.washroom(); 
}
else{ update("Hungry")
 foodObj.display();
 }
  if(gameState!="Hungry"){ feed.hide();
     addFood.hide();
      dog.remove();
     }
     else{ feed.show();
       addFood.show();
        dog.addImage(dogImg);
       }
       drawSprites();

}
function readStock(data){
  foodS=data.val();
   foodObj.updateFoodStock(foodS);
   }
    //function to update food stock and last fed time 
    function feedDog(){ 
      dog.addImage(dogImg1);
       foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
       database.ref('/').update({ Food:foodObj.getFoodStock(), FeedTime:hour(), gameState:"Hungry" })
       } 
       //function to add food in stock 
       function addFoods(){ 
         foodS++;
          database.ref('/').update({ Food:foodS })
         } 
         //update gameState
          function update(state){ 
            database.ref('/').update({ gameState:state })
           }


