export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // بعداً اینجا عکس‌ها و آهنگ‌های بازی لود می‌شن
  }

  create() {
    this.scene.start("IntroScene");
  }
}
