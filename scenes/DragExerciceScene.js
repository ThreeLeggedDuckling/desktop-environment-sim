import { BaseScene } from './BaseScene.js';
import { DesktopIcon } from '../classes/DesktopIcon.js';

export class DragExerciceScene extends BaseScene {
  constructor() {
    super({ key: 'DragExerciceScene' });
  }

  preload() {   // assests à pré-charger
    this.load.image('ducky', 'assets/ducky.png');
    this.load.image('binEmpty', 'assets/recyclebin_empty.png');
    this.load.image('binFull', 'assets/recyclebin_full.png');
  }

  create() {
    super.create();   // création BaseScene

    let contextMenu;

    // DEV : test data display
    this.testInfos = this.add.text(this.scale.width / 2, 15, '').setOrigin(0.5, 0);

    this.icons = [
      this.duckIcon = new DesktopIcon(this, 40, 100, 'ducky', 'canard.png'),
      this.emptyBinIcon = new DesktopIcon(this, 40, 200, 'binEmpty', 'Corbeille'),
    ];
    for (let icon of this.icons) {this.add.existing(icon) }

    this.input.on('pointerdown', (pointer, position) => {
      // contextMenu.setActive(false).setVisible(false);
      let clicked = position.find(obj => obj instanceof DesktopIcon);
      this.icons.forEach(icon => {
        if (icon !== clicked || pointer.rightButtonDown()) icon.setSelected(false);
      })
      if (pointer.rightButtonDown()) {
        contextMenu = new Phaser.GameObjects.Text(this, pointer.x, pointer.y, 'contextMenu', { color: '#ffffff' });
        this.add.existing(contextMenu);
      }
    })
  }
}