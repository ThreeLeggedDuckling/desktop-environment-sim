import { BaseScene } from './BaseScene.js';

export class DragAndDrop extends BaseScene {
  constructor() {
    super({ key: 'DragAndDrop' });
  }

  preload() {
		super.preload();
    this.load.image('ducky', 'assets/misc/ducky.png');
	}

  create() {
    super.create();

    // Create instructions display
    this.instructions = this.add.text(this.scale.width / 2, 100, 'Déplacer le canard dans le cadre', { fontStyle: 'bold', fontSize: '40px' }).setOrigin(0.5);
    
    // Create zone and initial graphics
    this.rightZone = new Phaser.Geom.Rectangle(this.scale.width / 3 * 2, this.scale.height / 3, 400, 600);
    const graphics = this.add.graphics({ lineStyle: { width: 5, color: 0xcd0099 } })
    graphics.strokeRectShape(this.rightZone);
    
    // Create duck
    this.duck = this.add.image(250, 500, 'ducky').setOrigin(0, 0).setInteractive({ draggable: true });

    // Set hover behavior
    this.duck.on('pointerover', (pointer) => { if (!pointer.isDown) this.duck.setAlpha(0.8); });
    this.duck.on('pointerout', () => { this.duck.setAlpha(1); });

    // Set drag behavior
    this.duck.on('drag', (pointer, dragX, dragY) => { this.duck.setPosition(dragX, dragY); })
    this.duck.on('dragstart', () => { this.duck.setAlpha(1); })
    this.duck.on('dragend', () => {
      // Reset alpha as hover value
      this.duck.setAlpha(0.8);

      // Check if dick fully in the zone
      const duckBounds = this.duck.getBounds();
      const duckInZone = this.rightZone.contains(duckBounds.left, duckBounds.top) && this.rightZone.contains(duckBounds.right, duckBounds.bottom);

      if (duckInZone) {
        // Adjust zone graphics if duck is fully inside
        graphics.clear();
        graphics.lineStyle(5, 0x9dec6c);
        // Add success message
        this.add.text(this.scale.width / 2, 150, 'BRAVO', { fontStyle: 'bold', fontSize: '40px', color: '#9dec6c' }).setOrigin(0.5);
        // Remove duck interactivity
        this.duck.setAlpha(1).removeInteractive();
        graphics.strokeRectShape(this.rightZone);
      }
    })
  }

  update() {
  }

}