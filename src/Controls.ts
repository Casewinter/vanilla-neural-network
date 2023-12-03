class Controls {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;

  direction: string;
  turn: string;

  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
    this.#addkeyboardListeners();

    this.direction = "stop"
    this.turn = 'center'
  }
  #addkeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.turn = "left"
          break;
        case 'ArrowRight':
          this.turn = "right"
          break;
        case 'ArrowUp':
          this.direction = "foward"
          break;
        case 'ArrowDown':
          this.direction = "reverse"
          break;
      }
      document.onkeyup = (event) => {
        switch (event.key) {
          case 'ArrowLeft':
            this.turn = 'center';
            break;
          case 'ArrowRight':
            this.turn = 'center';
            break;
          case 'ArrowUp':
            this.direction = "stop"
            break;
          case 'ArrowDown':
            this.direction = "stop"
            break;
        }
      };
    };
  }
}

export default Controls;
