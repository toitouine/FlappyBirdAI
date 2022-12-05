function Mountain(x, y) {
  this.x = x;
  this.y = y;

  this.show = function() {
    stroke(7, 163, 43);
    line(this.x, this.y, this.x, height);
  }
  
  this.update = function() {
    this.x -= 1;
  }
}