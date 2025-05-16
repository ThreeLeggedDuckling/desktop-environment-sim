import { BaseScene } from './BaseScene.js';

export class MenuScene extends BaseScene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    super.create();   // création BaseScene

    const menuTxt = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      'Menu',
      {
        font: '40px Arial',
        color:'#ffffff'
      }
    )
    .setOrigin(0.5)
    .setInteractive();

    menuTxt.on('pointerup', () => {
      this.scene.start('MainScene');
    });
  }
}