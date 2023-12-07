class Controls {
  direction: string;
  turn: string;

  type: string;

  constructor(type: string) {
    this.type = type;

    this.direction = "stop";
    this.turn = "center";

    switch (this.type) {
      case "KEYS":
        this.#addkeyboardListeners();
        break;
      case "DUMMY":
        this.direction = "foward";
        break;
    }
  }

  #addkeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.turn = "left";
          break;
        case "ArrowRight":
          this.turn = "right";
          break;
        case "ArrowUp":
          this.direction = "foward";
          break;
        case "ArrowDown":
          this.direction = "reverse";
          break;
      }

      document.onkeyup = (event) => {
        switch (event.key) {
          case "ArrowLeft":
            this.turn = "center";
            break;
          case "ArrowRight":
            this.turn = "center";
            break;
          case "ArrowUp":
            this.direction = "stop";
            break;
          case "ArrowDown":
            this.direction = "stop";
            break;
        }
      };
    };
  }
}

export default Controls;
