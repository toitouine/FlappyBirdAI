class Pipe {

  constructor(tempW, tempS) {
    this.w = tempW;
    this.size = tempS; //taille du trou
    this.x = width;
    this.ySpace = random(10, height - (this.size + 10)); // = topSpace y
    this.velocity = 2;
    
    this.beforeBird = true;
  }

  show() {
    stroke(0);
    fill(97, 57, 14);

    rect(this.x, 0, this.w, this.ySpace);
    //rect(this.x, this.ySpace, this.w, this.size);
    rect(this.x, this.ySpace + this.size, this.w, height - (this.ySpace + this.size));
  }

  move() {
    this.x -= this.velocity;
  }

  hits(bird) {
    this.top = this.ySpace;
    this.bottom = this.ySpace + this.size;
    if (bird.y - bird.radius < this.top || bird.y + bird.radius > this.bottom) {
      if (bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.w) {
        return true;
      }
    }
    return false;
  }
  
  passedBird() {
    //if (this.x + this.w < birdsX + 2*birdsR) {
    if (this.x + this.w <= birdsX - birdsR) {
      return true;
    } else {
      return false;
    }
  }
  
  offScreen() {
    if (this.x + this.w < 0) {
      return true;
    } else {
      return false;
    }
  }

}