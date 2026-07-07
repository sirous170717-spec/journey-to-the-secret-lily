export const gameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#0a0913",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  render: {
    antialias: true,
    pixelArt: false
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  }
};
