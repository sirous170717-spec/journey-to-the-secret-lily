export class ForestScene extends Phaser.Scene {
  constructor() {
    super("ForestScene");

    this.player = null;
    this.cursors = null;
    this.leftPressed = false;
    this.rightPressed = false;
    this.groundY = 0;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.groundY = height - 120;

    // پس‌زمینه اصلی
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x08101a, 0x08101a, 0x03060c, 0x03060c, 1);
    bg.fillRect(0, 0, width, height);

    // مه/نور پشت صحنه
    this.add.circle(width * 0.18, height * 0.22, 180, 0x6f5cff, 0.08);
    this.add.circle(width * 0.78, height * 0.28, 220, 0xa56eff, 0.06);
    this.add.circle(width * 0.55, height * 0.82, 260, 0x4f6cff, 0.05);

    // ماه
    this.add.circle(width - 130, 110, 48, 0xf6f0ff, 0.9);
    this.add.circle(width - 115, 100, 42, 0xd8d1ff, 0.12);

    // ستاره‌ها
    for (let i = 0; i < 28; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(20, width - 20),
        Phaser.Math.Between(20, Math.floor(height * 0.5)),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.85)
      );

      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: Phaser.Math.FloatBetween(0.1, 1) },
        duration: Phaser.Math.Between(1400, 2600),
        yoyo: true,
        repeat: -1
      });
    }

    // لایه‌های درخت
    this.drawForestLayer(height, 0.18, 0x0a1624, 16, 1.0);
    this.drawForestLayer(height + 20, 0.28, 0x0d1d2b, 12, 1.25);
    this.drawForestLayer(height + 40, 0.42, 0x132535, 10, 1.45);

    // زمین
    const ground = this.add.graphics();
    ground.fillStyle(0x101820, 1);
    ground.fillRect(0, this.groundY, width, height - this.groundY);

    const groundTop = this.add.graphics();
    groundTop.fillStyle(0x182331, 1);
    groundTop.fillRect(0, this.groundY - 10, width, 10);

    // گل‌های کوچک لیلیوم/نور
    for (let i = 0; i < 18; i++) {
      const x = Phaser.Math.Between(30, width - 30);
      const y = Phaser.Math.Between(this.groundY + 8, height - 12);
      this.add.circle(x, y, Phaser.Math.Between(2, 4), 0xd8d1ff, 0.55);
    }

    // ساخت رز
    this.player = this.createRoseCharacter(170, this.groundY - 12);

    // راهنمای مرحله
    this.add.text(width / 2, 38, "مرحله ۱ — جنگل رازآلود", {
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: Math.max(18, width * 0.016) + "px",
      color: "#f5efff"
    }).setOrigin(0.5);

    this.add.text(width / 2, 74, "رز باید راهش را از میان جنگل پیدا کند...", {
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: Math.max(13, width * 0.011) + "px",
      color: "#c9bbf4"
    }).setOrigin(0.5);

    // کنترل کیبورد برای تست روی PC
    this.cursors = this.input.keyboard.createCursorKeys();

    // کنترل لمسی موبایل
    this.createMobileControls();

    // وقتی سایز عوض شد، صحنه رفرش شود
    this.scale.on("resize", this.handleResize, this);
  }

  update() {
    if (!this.player) return;

    let movingLeft = false;
    let movingRight = false;

    if (this.cursors?.left?.isDown || this.leftPressed) movingLeft = true;
    if (this.cursors?.right?.isDown || this.rightPressed) movingRight = true;

    if (movingLeft && !movingRight) {
      this.movePlayer(-1);
    } else if (movingRight && !movingLeft) {
      this.movePlayer(1);
    } else {
      this.idlePlayer();
    }
  }

  movePlayer(dir) {
    const speed = 3.2;
    this.player.x += dir * speed;

    // محدودیت حرکت
    const minX = 40;
    const maxX = this.scale.width - 40;
    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);

    // برگرداندن صورت
    this.player.setScale(dir < 0 ? -1 : 1, 1);

    // انیمیشن ساده راه رفتن
    if (!this.player.walkTween || !this.player.walkTween.isPlaying()) {
      this.player.walkTween = this.tweens.add({
        targets: this.player.list,
        y: "-=4",
        duration: 180,
        yoyo: true,
        repeat: -1
      });
    }
  }

  idlePlayer() {
    if (this.player?.walkTween) {
      this.player.walkTween.stop();
      this.player.walkTween = null;
    }

    // برگرداندن اجزای کاراکتر به حالت عادی
    this.player.list.forEach((part) => {
      if (part.baseY !== undefined) {
        part.y = part.baseY;
      }
    });
  }

  createRoseCharacter(x, y) {
    const container = this.add.container(x, y);

    // سایه زیر پا
    const shadow = this.add.ellipse(0, 6, 48, 14, 0x000000, 0.25);
    shadow.baseY = shadow.y;

    // پاها
    const legL = this.add.rectangle(-10, -8, 14, 38, 0x92a0b8, 1);
    legL.baseY = legL.y;
    const legR = this.add.rectangle(10, -8, 14, 38, 0x8b99b1, 1);
    legR.baseY = legR.y;

    // کفش‌ها
    const shoeL = this.add.ellipse(-10, 14, 24, 10, 0xf2f2f2, 1);
    shoeL.baseY = shoeL.y;
    const shoeR = this.add.ellipse(10, 14, 24, 10, 0xf2f2f2, 1);
    shoeR.baseY = shoeR.y;

    // هودی/لباس سفید لش
    const body = this.add.rectangle(0, -44, 68, 82, 0xf2f3f7, 1);
    body.setStrokeStyle(2, 0xd9dce4, 0.8);
    body.baseY = body.y;

    // آستین‌ها
    const armL = this.add.rectangle(-36, -42, 18, 56, 0xf2f3f7, 1);
    armL.setRotation(0.08);
    armL.baseY = armL.y;

    const armR = this.add.rectangle(36, -42, 18, 56, 0xf2f3f7, 1);
    armR.setRotation(-0.08);
    armR.baseY = armR.y;

    // گردن
    const neck = this.add.rectangle(0, -88, 16, 12, 0xf0c9b8, 1);
    neck.baseY = neck.y;

    // سر
    const head = this.add.circle(0, -108, 28, 0xf0c9b8, 1);
    head.baseY = head.y;

    // مو
    const hair = this.add.ellipse(0, -116, 62, 52, 0x3a251f, 1);
    hair.baseY = hair.y;

    const hairFrontL = this.add.ellipse(-18, -104, 18, 34, 0x3a251f, 1);
    hairFrontL.setRotation(0.25);
    hairFrontL.baseY = hairFrontL.y;

    const hairFrontR = this.add.ellipse(18, -104, 18, 34, 0x3a251f, 1);
    hairFrontR.setRotation(-0.25);
    hairFrontR.baseY = hairFrontR.y;

    // صورت
    const eyeL = this.add.circle(-9, -110, 2.2, 0x2c2c2c, 1);
    eyeL.baseY = eyeL.y;
    const eyeR = this.add.circle(9, -110, 2.2, 0x2c2c2c, 1);
    eyeR.baseY = eyeR.y;

    const smile = this.add.arc(0, -98, 8, 20, 160, false, 0x9b6a74, 1);
    smile.baseY = smile.y;

    container.add([
      shadow,
      legL, legR,
      shoeL, shoeR,
      body, armL, armR,
      neck, head,
      hair, hairFrontL, hairFrontR,
      eyeL, eyeR, smile
    ]);

    return container;
  }

  drawForestLayer(height, alpha, color, treeCount, scaleY = 1) {
    const width = this.scale.width;
    const g = this.add.graphics();
    g.fillStyle(color, alpha);

    for (let i = 0; i < treeCount; i++) {
      const x = (width / (treeCount - 1)) * i + Phaser.Math.Between(-25, 25);
      const trunkW = Phaser.Math.Between(16, 26);
      const trunkH = Phaser.Math.Between(150, 260) * scaleY;
      const trunkY = height - trunkH;

      // تنه
      g.fillRect(x, trunkY, trunkW, trunkH);

      // تاج/برگ
      g.fillEllipse(x + trunkW / 2, trunkY + 20, 90, 120);
      g.fillEllipse(x - 18, trunkY + 44, 70, 90);
      g.fillEllipse(x + 28, trunkY + 42, 74, 94);
    }
  }

  createMobileControls() {
    const width = this.scale.width;
    const height = this.scale.height;

    const y = height - 72;
    const leftX = 92;
    const rightX = 222;

    this.leftBtn = this.createControlButton(leftX, y, "◀");
    this.rightBtn = this.createControlButton(rightX, y, "▶");

    this.leftBtn.on("pointerdown", () => {
      this.leftPressed = true;
    });
    this.leftBtn.on("pointerup", () => {
      this.leftPressed = false;
    });
    this.leftBtn.on("pointerout", () => {
      this.leftPressed = false;
    });

    this.rightBtn.on("pointerdown", () => {
      this.rightPressed = true;
    });
    this.rightBtn.on("pointerup", () => {
      this.rightPressed = false;
    });
    this.rightBtn.on("pointerout", () => {
      this.rightPressed = false;
    });
  }

  createControlButton(x, y, label) {
    const container = this.add.container(x, y);

    const glow = this.add.circle(0, 0, 42, 0x9b7bff, 0.12);
    const bg = this.add.circle(0, 0, 36, 0x181427, 0.92);
    bg.setStrokeStyle(3, 0x8f78ff, 0.9);

    const text = this.add.text(0, -1, label, {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff"
    }).setOrigin(0.5);

    container.add([glow, bg, text]);
    container.setSize(72, 72);
    container.setInteractive(new Phaser.Geom.Circle(0, 0, 36), Phaser.Geom.Circle.Contains);

    return container;
  }

  handleResize() {
    this.scene.restart();
  }
}
