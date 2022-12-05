function nextGeneration() {
  
  normalizeFitness();
  
  for (let i = 0; i < populationSize; i++) {
    let child = new Bird();
    let c = pickBird(saveBirds).cerveau;
    let datas = [c.ih_weights.duplicate(), c.ho_weights.duplicate(), c.h_bias.duplicate(), c.o_bias.duplicate()];
    child.setGenes(datas[0], datas[1], datas[2], datas[3]);
    birds[i] = child;
    birds[i].cerveau.mutate();
  }
  saveBirds = [];
  
  gen++;
  let elt = document.getElementById('generation');
  elt.innerHTML = "Generation : " + gen;
}

function normalizeFitness() {
  let sum = 0;
  
  for (let i = 0; i < populationSize; i++) {
    saveBirds[i].fitness = exp(saveBirds[i].fitness);
    sum += saveBirds[i].fitness;
  }

  for (let i = 0; i < populationSize; i++) {
    saveBirds[i].fitness = saveBirds[i].fitness/sum;
  }
}

function pickBird(pop) {
  var index = 0;
  var rand = random(1);
  
  while(rand > 0) {
    rand = rand - pop[index].fitness;
    index++;
  }
  
  index--;
  return pop[index];
}