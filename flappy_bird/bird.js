class Bird {

  constructor() {
    this.x = birdsX;
    this.y = height / 2;
    this.gravity = 0.3;
    this.velocity = 1;
    this.lift = -10;
    this.radius = birdsR;
    this.color = color(random(50, 255), random(50, 255), random(50, 255));
    
    this.recordedBest = 0;

    this.fitness = 0; //totalDistance
    this.cerveau = new NeuralNetwork(nnI, nnH, nnO);
  }

  show() {
    //imageMode(CENTER);
    //image(img, this.x, this.y,this.radius * 2, this.radius * 2);
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
  
  decide() {
    //trouve le prochain obstacle
    let pipe;
    if (pipes[0].beforeBird) pipe = pipes[0];
    else pipe = pipes[1];
    
    let inputs = [];
    inputs[0] = this.y / height; //y de l'oiseau
    inputs[1] = pipe.x / width; //x de l'obstacle
    inputs[2] = (pipe.ySpace + pipe.size/2) / height; //milieu du trou
    inputs[3] = map(this.velocity, -30, 30, -1, 1); //vélocité
    
    var jump = this.cerveau.forwardPropagation(inputs);
    if (jump[0] >= 0.5) this.up();
  }

  up() {
    this.velocity += this.lift;
  }
  
  setGenes(d1, d2, d3, d4) {
    this.cerveau = new NeuralNetwork(nnI, nnH, nnO, d1, d2, d3, d4);
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
    
    this.fitness += 1;
  }
  
  calculateFitness(pipeHit) {
    //calculate fitness when the bird hits the pipe ???
    let distance = 1 * ((pipeHit.ySpace + pipeHit.size/2) - this.y);
    if (distance < 0) distance = -distance;
    this.fitness -= distance;
    
    if (this.fitness <= 0) this.fitness = 1;
  }
}