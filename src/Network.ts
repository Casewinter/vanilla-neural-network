import { lerp } from "./utils";
class NeuralNetwork {
  levels: Level[];
  constructor(neuronCounts: number[]) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedFoward(givenInputs: number[], network: NeuralNetwork) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }
  static mutate(network: NeuralNetwork, amount: number = 1) {
    network.levels.forEach((level: Level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights.length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

//cada nivel define as camadas de neuronios

export type { Level };
class Level {
  input: number[];
  output: number[];
  biases: number[];
  weights: number[][];

  constructor(inputCount: number, outputCount: number) {
    this.input = new Array(inputCount);
    this.output = new Array(outputCount);
    this.biases = new Array(outputCount);
    this.weights = new Array();

    //cria uma ligacao entre
    //cada neuronio de entrada
    //e uma saida
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level: Level) {
    for (let i = 0; i < level.input.length; i++) {
      for (let j = 0; j < level.output.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs: number[], level: Level) {
    for (let i = 0; i < level.input.length; i++) {
      level.input[i] = givenInputs[i];
    }
    for (let i = 0; i < level.output.length; i++) {
      let sum = 0;

      for (let j = 0; j < level.input.length; j++) {
        sum += level.input[j] * level.weights[j][i];
      }
      if (sum > level.biases[i]) {
        level.output[i] = 1;
      } else {
        level.output[i] = 0;
      }
    }

    return level.output;
  }
}

export default NeuralNetwork;
