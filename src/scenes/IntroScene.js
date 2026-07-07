export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // پس‌زمینه
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x120f1d, 0x120f1d, 0x05060b, 0x05060b, 1);
    bg.fillRect(0, 0, width, height);

    // هاله‌های نور
    this.add.circle(width * 0.2, height * 0.25, 180, 0x8a5cff, 0.08);
    this.add.circle(width * 0.8, height * 0.3, 220, 0xff7ad9, 0.06);
    this.add.circle(width * 0.5, height * 0.85, 260, 0x6c5ce7, 0.05);

    // ستاره‌ها
    for (let i = 0; i < 35; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.25, 0.9)
      );

      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: Phaser.Math.FloatBetween(0.15, 1) },
        duration: Phaser.Math.Between(1400, 2800),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }

    // عنوان
    this.add.text(width / 2, height * 0.23, "Journey to the Secret Lily", {
      fontFamily: "Georgia, Tahoma, serif",
      fontSize: Math.max(28, width * 0.035) + "px",
      color: "#f8f3ff",
      align: "center"
    }).setOrigin(0.5);

    // زیرعنوان فارسی
    this.add.text(width / 2, height * 0.33, "یک سفر داستانی برای رسیدن به تو...", {
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: Math.max(16, width * 0.016) + "px",
      color: "#d8cfff",
      align: "center"
    }).setOrigin(0.5);

    // توضیح
    this.add.text(
      width / 2,
      height * 0.41,
      "رز باید از میان جنگل، معماها، پل و باغ لیلیوم عبور کند تا به تو برسد.",
      {
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: Math.max(14, width * 0.0125) + "px",
        color: "#a89bcf",
        align: "center",
        wordWrap: { width: width * 0.75, useAdvancedWrap: true }
      }
    ).setOrigin(0.5);

    // دکمه شروع
    const buttonWidth = Math.min(320, width * 0.42);
    const buttonHeight = 70;
    const buttonX = width / 2;
    const buttonY = height * 0.68;

    const button = this.add.container(buttonX, buttonY);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x171327, 0.95);
    btnBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 22);
    btnBg.lineStyle(2, 0x9a84ff, 0.9);
    btnBg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 22);

    const btnGlow = this.add.graphics();
    btnGlow.fillStyle(0xb388ff, 0.08);
    btnGlow.fillRoundedRect(-buttonWidth / 2 - 8, -buttonHeight / 2 - 8, buttonWidth + 16, buttonHeight + 16, 28);

    const btnText = this.add.text(0, 0, "شروع سفر", {
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: "28px",
      color: "#f8f3ff"
    }).setOrigin(0.5);

    button.add([btnGlow, btnBg, btnText]);
    button.setSize(buttonWidth, buttonHeight);
    button.setInteractive({ useHandCursor: true });

    button.on("pointerover", () => {
      this.tweens.add({
        targets: button,
        scaleX: 1.03,
        scaleY: 1.03,
        duration: 150
      });
    });

    button.on("pointerout", () => {
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 150
      });
    });

    button.on("pointerdown", () => {
      this.startTransition();
    });

    this.add.text(width / 2, height * 0.9, "نسخه آزمایشی فاز ۱", {
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: Math.max(12, width * 0.01) + "px",
      color: "#7f74a8"
    }).setOrigin(0.5);

    this.scale.on("resize", this.handleResize, this);
  }

  startTransition() {
    const width = this.scale.width;
    const height = this.scale.height;

    const fade = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
    this.tweens.add({
      targets: fade,
      alpha: 1,
      duration: 900,
      onComplete: () => {
        this.scene.restart();
      }
    });
  }

  handleResize() {
    this.scene.restart();
  }
                           }
