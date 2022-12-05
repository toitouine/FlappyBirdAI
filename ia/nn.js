class NeuralNetwork {
  constructor(inp, hid, out, ihw = undefined, how = undefined, hb = undefined, ob = undefined) {
    
    //number of neurons
    this.numInput = inp;
    this.numHidden = hid;
    this.numOutput = out;
    let layers = [this.numInput, this.numHidden, this.numOutput];
    this.maxLayer = max(layers);
    
    //initialize weights and biases
    if (ihw == undefined) {
      this.ih_weights = new Matrix(this.numHidden, this.numInput);
      this.ih_weights.randomize(); 
    } else {
      this.ih_weights = ihw;
    }
    if (how == undefined) {
      this.ho_weights = new Matrix(this.numOutput, this.numHidden);
      this.ho_weights.randomize();
    } else {
      this.ho_weights = how;
    }
    
    if (hb == undefined) {
      this.h_bias = new Matrix(this.numHidden, 1);
      this.h_bias.randomize();
    } else {
      this.h_bias = hb;
    }
    
    if (ob == undefined) {
      this.o_bias = new Matrix(this.numOutput, 1);
      this.o_bias.randomize();
    } else {
      this.o_bias = ob;
    }
    
    //learning rate
    this.learning_rate = 0.1;
  }
  
  show(x, y, neuronRadius, neuronSpace, weightsSize) {
    let rectWidth = 6*neuronRadius + 2*weightsSize;
    let rectHeight = neuronSpace*(this.maxLayer-1) + this.maxLayer*neuronRadius*2;
    
    fill(255);
    noStroke();
    rect(x, y, rectWidth, rectHeight);
    
    strokeWeight(1);
    stroke(0);
    fill(255);
    
    //input layer
    for (let i = 0; i < this.numInput; i++) {
      let neuronY = y + neuronRadius + (i * (2*neuronRadius + neuronSpace));
      ellipse(x + neuronRadius, neuronY, neuronRadius, neuronRadius);
    }
    
    //hidden layer
    for (let i = 0; i < this.numHidden; i++) {
      let neuronX = x + neuronRadius*3 + weightsSize;
      let neuronY = y + neuronRadius + (i * (2*neuronRadius + neuronSpace));
      ellipse(neuronX, neuronY, neuronRadius, neuronRadius);
    }
    
    //output layer
    for (let i = 0; i < this.numOutput; i++) {
      let neuronX = x + neuronRadius*5 + weightsSize*2;
      let neuronY = y + neuronRadius + (i * (2*neuronRadius + neuronSpace));
      ellipse(neuronX, neuronY, neuronRadius, neuronRadius);
    }
  }
  
  forwardPropagation(inputsArray) {
    //convert input to matrix
    var inputs = Matrix.fromArray(inputsArray);
    
    //calculate hidden neurons outputs
    var hiddenOutputData = Matrix.multiply(this.ih_weights, inputs);
    hiddenOutputData.add(this.h_bias);
    hiddenOutputData.map(sigmoid);
    
    //calculate neural network outputs (from hidden neurons outputs)
    var outputData = Matrix.multiply(this.ho_weights, hiddenOutputData);
    outputData.add(this.o_bias);
    outputData.map(sigmoid);
    
    return outputData.toArray();
  }
  
  learn(inputsArray, answersArray) {
    //forward propagation
    var inputs = Matrix.fromArray(inputsArray);

    var hiddenOutputData = Matrix.multiply(this.ih_weights, inputs);
    hiddenOutputData.add(this.h_bias);
    hiddenOutputData.map(sigmoid);
    
    var outputs = Matrix.multiply(this.ho_weights, hiddenOutputData);
    outputs.add(this.o_bias);
    outputs.map(sigmoid);
    
    //backpropagation
    
    //calculate errors matrix for output neurons
    var answers = Matrix.fromArray(answersArray);
    var errors_output = Matrix.subtract(answers, outputs);
    
    //calculate errors matrix for hidden neurons
    var ho_weights_t = Matrix.transpose(this.ho_weights);
    var errors_hidden = Matrix.multiply(ho_weights_t, errors_output);

    //calculate change for weights and biases (hidden to output) : gradient descent
    var gradient_descent = Matrix.map(outputs, sigmoid_derivee);
    gradient_descent.multiply(errors_output);
    gradient_descent.multiply(this.learning_rate);
    var change_bias_o = gradient_descent;
    var hidden_transpose = Matrix.transpose(hiddenOutputData);
    var change_weights_ho = Matrix.multiply(gradient_descent, hidden_transpose);

    //calculate change for weights and biases (input to hidden)
    var gd_hidden = Matrix.map(hiddenOutputData, sigmoid_derivee);
    gd_hidden.multiply(errors_hidden);
    gd_hidden.multiply(this.learning_rate);
    var change_bias_h = gd_hidden;
    var inputs_transpose = Matrix.transpose(inputs);
    var change_weights_ih = Matrix.multiply(gd_hidden, inputs_transpose)

    //change weights and biases !!!
    this.ho_weights.add(change_weights_ho);
    this.ih_weights.add(change_weights_ih);
    this.h_bias.add(change_bias_h);
    this.o_bias.add(change_bias_o);
  }
  
  mutate() { //for genetic algorithm
    this.ho_weights.map(mutation);
    this.ih_weights.map(mutation);
    this.h_bias.map(mutation);
    this.o_bias.map(mutation);
  }
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoid_derivee(x) {
  //x already sigmoided !
  return x * (1 - x);
}

function mutation(x) {
  if (random(1) < mutationRate) {
    return x + randomGaussian(0, mutationChange); //??? ou 0.2
  } else {
    return x;
  }
}