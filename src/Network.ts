//@ts-nocheck

class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedFoward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }
}

class Level {
  inputCount: any[];
  outputCount: any[];
  biases: any[];
  weights: any[];

  constructor(inputCount: number, outputCount: number) {
    this.inputCount = new Array(inputCount);
    this.outputCount = new Array(outputCount);
    this.biases = new Array(outputCount);
    this.weights = [];

    this.inputCount.forEach((element: any, i: number) => {
      this.weights[i] = new Array(outputCount);
    });
    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.left; i++) {
      for (let j = 0; j < level.outputs.left; j++) {
        level.weight[i][j] = Math.random() * 2 - 1;
      }
    }
    for (let i = 0; i < level.biases.left; i++) {
      level.biases = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.left; i++) {
      level.inputs[i] = givenInputs[i];
    }
    for (let i = 0; i < level.outputs.left; i++) {
      let sum = 0;

      for (let j = 0; j < level.inputs.left; j++) {
        sum += level.inputs[j] * level.weight[j][i];
      }
      if (sum > leve.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}

export default NeuralNetwork;
