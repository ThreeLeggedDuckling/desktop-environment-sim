import { BaseScene } from './BaseScene.js';
import { DesktopIcon } from '../classes/DesktopIcon.js';

export class DragExerciceScene extends BaseScene {
  constructor() {
    super({ key: 'DragExerciceScene' });
  }

  preload() {   // assests à pré-charger
    this.load.image('ducky', 'assets/ducky.png');
  }

  create() {
    super.create();   // création BaseScene

    this.instructions = this.add.text(this.scale.width / 2, 100, 'Déplacer le canard dans le cadre', { fontStyle: 'bold', fontSize: '40px' }).setOrigin(0.5);
    
    this.rightZone = new Phaser.Geom.Rectangle(this.scale.width / 3 * 2, this.scale.height / 3, 400, 600);
    const graphics = this.add.graphics({ lineStyle: { width: 5, color: 0xcd0099 } })
    graphics.strokeRectShape(this.rightZone);
    
    this.duck = new DesktopIcon(this, 300, 300, 'ducky', 'canard.png');
    this.add.existing(this.duck)

    this.input.on('pointerdown', (pointer, position) => {
      let lastclick = position.find(obj => obj instanceof DesktopIcon);
      if (lastclick !== this.duck) this.duck.setSelected(false);
    })

    this.duck.on('dragend', (pointer) => {
      this.duckBounds = this.duck.getBounds();
      this.duckInZone = this.rightZone.contains(this.duckBounds.left, this.duckBounds.top) && this.rightZone.contains(this.duckBounds.right, this.duckBounds.bottom);

      graphics.clear();
      if (this.duckInZone) {
        graphics.lineStyle(5, 0x9dec6c);
        this.add.text(this.scale.width / 2, 150, 'BRAVO', { fontStyle: 'bold', fontSize: '40px', color: '#9dec6c' }).setOrigin(0.5);
        this.duck.removeInteractive();
      }
      else graphics.lineStyle(5, 0xcd0099);
      graphics.strokeRectShape(this.rightZone);
    })

    
    
    // DEV TEST DISPLAY
    this.testInfos = this.add.text(20, 20, '');
    this.duckBounds = this.duck.getBounds();
  }

  // DEV TEST DATA
  testInfos;

  update() {
    // DEV TEST DATA
    this.testInfos.setText([
      'TEST DATA',
      `duck.topLeft in zone : ${this.rightZone.contains(this.duckBounds.left, this.duckBounds.top)}`,
      `duck.bottomRight in zone : ${this.rightZone.contains(this.duckBounds.right, this.duckBounds.bottom)}`,
      `duck in zone : ${this.duckInZone}`,
    ]);
  }

}