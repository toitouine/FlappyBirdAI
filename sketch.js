let birds = [];
let saveBirds = [];
let pipes = [];
let mountains = [];

let nnI = 4;
let nnH = 5;
let nnO = 1;

let populationSize = 500;
let mutationRate = 0.1;
let mutationChange = 0.2;
let bestBird;

let birdsX = 50
let birdsR = 15;
let gapSize = 150; //150
let pipeDelay = 100; //100

let time = 0;
let iteration = 0;

let mode = 0; //0 = train; 1 = load recorded best

let slider; //le retour du vecteur vitesse
let vv;
let modeButton;

let gen = 1;
let score = 0;
let bestScore = 0;

function setup() {
  createCanvas(400, 400);
  
  slider = createSlider(1, 300, 1);
  slider.position(10, 460);
  slider.size(200, 20);
  vv = createP("Vecteur vitesse : " + slider.value());
  vv.position(240, 444);
  /*
  modeButton = createButton("Spawn recorded best bird");
  modeButton.position(10, 500);
  modeButton.mousePressed(changeMode);
  */
  
  for (let i = 0; i < populationSize; i++) {
    birds[i] = new Bird(); 
  }
  
  pipes[0] = new Pipe(50, gapSize);
  
  for (let i = 0; i < width+1; i++) {
    let y =  map(noise(iteration), 0, 1, 200, height);
    mountains.push(new Mountain(i, y)); 
    iteration += 0.005;
    mountains[i].show();
  }
}

function draw() {
  
  vv.html("Vecteur vitesse : " + slider.value());
  
  for (let n = 0; n < slider.value(); n++) {
    time++;

    //actions
    if (time % pipeDelay == 0) {
      pipe = new Pipe(50, gapSize);
      pipes.push(pipe);
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      let pipe = pipes[i];
      pipe.move();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipe.hits(birds[j])) {
          //birds[j].calculateFitness(pipe);
          saveBirds.push(birds.splice(j, 1)[0]);
          if (birds.length == 0) restartGame();
        }
      }

      if (pipe.beforeBird && pipe.passedBird()) {
        pipe.beforeBird = false;
        score++;
      }
      if (pipe.offScreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = birds.length-1; i >= 0; i--) {
      let bird = birds[i];
      bird.decide();
      bird.update();

      if (bird.y - birdsR <= 0 || bird.y + birdsR >= height) {
        saveBirds.push(birds.splice(i, 1)[0]);
        if (birds.length == 0) restartGame();
      }
    }
  }
  
  background(0, 220, 255);
  shows();
  //birds[0].cerveau.show(10, 10, 10, 5, 10);
}

function changeMode() {
  if (mode == 0) {
    mode = 1;
  } else if (mode == 1) {
    mode = 0;
  }
}

function keyPressed() {
  if (key == 'a') noLoop();
}

function shows() {
  //score
  noStroke();
  textAlign(CENTER, CENTER);
  if (score < 100) textSize(300);
  else if (score < 1000) textSize(240);
  else if (score < 10000) textSize(180);
  else if (score < 100000) textSize(140);
  fill(0, 0, 0, 25);
  text(score, width/2, height/1.81);
  
  //soleil
  noStroke();
  fill(250, 230, 55);
  ellipse(335, 60, 55, 55);
  
  //montagnes
  for (var i = 0; i < mountains.length; i++) {
    var m = mountains[i];
    m.show();
    m.update();
    if (m.x < 0) mountains.splice(i, 1);
  }
  var y = map(noise(iteration), 0, 1, 200, height);
  mountains.push(new Mountain(width, y));
  iteration += 0.005;
  
  for (let pipe of pipes) {
    pipe.show();
  }
  
  for (let bird of birds) {
    bird.show();
  }
}

function restartGame() {
  background(0, 220, 255);
  mountains = [];
  time = 0;
  if (score > bestScore) {
    bestScore = score;
    let elt = document.getElementById('best');
    elt.innerHTML = "Best score : " + bestScore;
    bestBird = saveBirds[saveBirds.length - 1];
    bestBird.recordedBest = score;
    console.log(bestBird);
  }
  score = 0;
  
  nextGeneration();
  
  for (let i = pipes.length-1; i >= 0; i--) pipes.splice(i, 1);
  pipes[0] = new Pipe(50, gapSize);
  
  for (let i = 0; i < width+1; i++) {
    mountains.push(new Mountain(i, map(noise(iteration), 0, 1, 200, height))); 
    iteration += 0.005;
    mountains[i].show();
  }
}