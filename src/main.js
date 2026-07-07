import { gameConfig } from "./config.js";
import { BootScene } from "./scenes/BootScene.js";
import { IntroScene } from "./scenes/IntroScene.js";

class Game extends Phaser.Game {
  constructor() {
    super(gameConfig);

    this.scene.add("BootScene", BootScene);
    this.scene.add("IntroScene", IntroScene);

    this.scene.start("BootScene");
  }
}

window.addEventListener("load", () => {
  new Game();
});
