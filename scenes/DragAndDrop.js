import { BaseScene } from './BaseScene.js';
import { SceneReturnBtn } from '../gameObjects/Buttons.js';

export class DragAndDrop extends BaseScene {
  constructor() {
    super({ key: 'DragAndDrop' });
  }

  create() {
    super.create();

    //@ts-ignore
    const range = (end, start, step = 100) => Array.from(
      { length: Math.ceil((end - start) / step) },
      (_, i) => i * step + start
    )

    this.round = 0;
    this.presetPositions = {
      x: range(1800, 100),
      y: range(860, 260)
    }
    this.palette = {
      in: 0x9dec6c,
      out: 0xcd0099
    };

    // Initiate end of round message
    this.roundEndMsg = this.add.text(960, 1000, ['BRAVO', 'Préparation d\'une nouvelle zone ...'], { fontStyle: 'bold', fontSize: '40px', color: '#9dec6c', align: 'center' }).setOrigin(0.5).setVisible(false);

    // Initiate graphics and zone
    this.graphics = this.add.graphics();
    this.zone = new Phaser.Geom.Rectangle();

    // Create duck
    this.duck = this.add.image(960, 500, 'duckyGS').setAlpha(0.7).setScale(1.3)
      .setInteractive({ draggable: true, useHandCursor: true })
      // Hover behavior
      .on('pointerover', (pointer) => { if (!pointer.isDown) this.duck.setTexture('ducky'); })
      .on('pointerout', () => { this.duck.setTexture('duckyGS') })
      // Drag behavior
      .on('dragstart', () => { this.duck.setAlpha(1); })
      .on('drag', (pointer, dragX, dragY) => { this.duck.setPosition(dragX, dragY); })
      .on('dragend', () => {
        this.duck.setAlpha(0.7);

        // End round if duck in the zone
        if (this.checkDuckIn()) this.endRound();
      });
    
    // Start round
    this.newRound();

    // Add return to menu button
    const returnBtn = new SceneReturnBtn(this, 'ExercicesMenu', 'Menu exercices').setPosition(200, 200);

    // Display instructions
    const exoData = {
      text: [
        'Cliquez sur le canard et faite le glisser pour le déposer dans le cadre.',
      ],
      style: {
        fontStyle: 'bold',
        fontSize: '40px',
        align: 'center',
        wordWrap: { width: 1000, useAdvancedWrap: true }
      }
    }
    const instructionDisplay = this.add.text(960, 100, exoData.text, exoData.style).setOrigin(0.5);

  }

  /**
   * Check if the duck is fully contained inside the zone.
   * @returns {boolean}
   */
  checkDuckIn() {
    const topLeft = {
      x: this.duck.x - (this.duck.width * this.duck.scale) / 2,
      y: this.duck.y - (this.duck.height * this.duck.scale) / 2
    };
    const bottomRight = {
      x: this.duck.x + (this.duck.width * this.duck.scale) / 2,
      y: this.duck.y + (this.duck.height * this.duck.scale) / 2
    }
    
    return  this.zone.contains(topLeft.x, topLeft.y) && this.zone.contains(bottomRight.x, bottomRight.y);
  }

  /**
   * End round display and setup next round.
   */
  endRound() {
    // Update appearance
    this.graphics.clear().lineStyle(5, this.palette.in).strokeRectShape(this.zone);
    this.duck.disableInteractive(true);
    // Display round end message
    this.roundEndMsg.setVisible(true);
    // Setup new round
    this.time.delayedCall(2000, this.newRound, null, this);
  }

  /**
   * Setup a new zone.
   */
  newRound() {
    // Increment round count
    if (this.round < 9) this.round++;

    // Make zone smaller every 3 rounds
    const dimensions = 400 - 100 * Math.floor(this.round / 3);
    const rangeX = this.presetPositions.x.length - dimensions / 100;
    const rangeY = this.presetPositions.y.length - dimensions / 100;

    // Get new zone position
    let x, y;
    if (this.round === 1) { x = 1200, y = 300; }
    else {
      do {
        x = this.presetPositions.x[Phaser.Math.Between(0, rangeX)];
        y = this.presetPositions.y[Phaser.Math.Between(0, rangeY)];
      }
      while (this.zone.contains(x, y) || this.zone.contains(x + dimensions, y + dimensions))
    }

    // Hide end message
    this.roundEndMsg.setVisible(false);
    
    // Update zone
    this.zone.setTo(x, y, dimensions, dimensions);
    this.graphics.clear().lineStyle(5, this.palette.out).strokeRectShape(this.zone);
    
    // Reactivate duck interactivity
    this.duck.setTexture('duckyGS').setInteractive();
  }

}