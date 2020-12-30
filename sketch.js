var dog, happyDog;
var dogs, happyDogs
var database;
var foodS, foodStock;

var milk, milkImg

var feed, addFood
var fedTime, lastFed
var foodObj

var bedroomImg, gardenImg, washroomImg, sadDogimg

var readState

var currentTime

var gameState

function preload() {
  dogs = loadImage("dogImg.png");
  happyDogs = loadImage("dogImg1.png");
  bedroomImg = loadImage("Bed Room.png");
  gardenImg = loadImage("Garden.png");
  washroomImg = loadImage("Wash Room.png")
  sadDogimg = loadImage("deadDog.png")

}


function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}


function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {

  if (x <= 0) {
    x = 0;

  }

  else {
    x = x - 1;
  }

  database.ref('/').update({
    Food: x
  })
}




function setup() {
  createCanvas(1000, 700);

  dog = createSprite(850, 350, 10, 10);
  dog.addImage(dogs);

  //foodS = 20

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  feed = createButton("Feed the Dog");
  feed.position(500, 100)
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(500, 120);
  addFood.mousePressed(addFoods)

  readState = database.ref('gameState ').on("value", (data) => {
    gameState = data.val();
  })


 

}

function feedDog() {
  dog.addImage(happyDogs);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    fedTime: hour()
  })
}

function update(state) {
  database.ref('/').update({
    gameState: state
  });
}


function draw() {
  background(46, 139, 87)  //maybe add rgb() if this doesn't work
  currentTime = hour();
  dog.scale = (0.25)
  feed = createButton("Feed the Dog");
  feed.position(500, 100)
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(500, 120);
  addFood.mousePressed(addFoods)

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })
  // milk.addImage(milkImg)
  if (foodS <= 0) {
    dog.addImage(dogs);
    textSize(20);
    fill("red");
    stroke(2);
    text("You ran out of food!", 200, 100)
  }
  foodObj.display();
  drawSprites();
  //add styles here
  textSize(40);
  fill("red")
  stroke(2);
  text("Food Remaining: " + foodS, 300, 100);

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed: " + lastFed % 12 + "PM", 350, 30)
  }
  else if (lastFed === 0) {
    text("Last Feed: 12 AM", 350, 50);
  }
  else {
    text("Last Feed: " + lastFed + "AM", 350, 50);

  }


  if (gameState != "hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();

  }

  else {
    feed.show();
    addFood.show();
    dog.addImage(sadDogimg);
  }

  if (currentTime === (lastFed + 1)) {
    update("Playing");
    foodObj.garden();
  }

  else if (currentTime === (lastFed + 2)) {
    update("Sleeping");
    foodObj.bedroom();
  }

  else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
    update("Bathing");
    foodObj.washroom();
  }

  else {
    foodObj.display();
    update("Hungry");
  }

}







