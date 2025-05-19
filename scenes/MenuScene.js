import { BaseScene } from './BaseScene.js';
import { SceneSelectionButton } from '../classes/SceneSelectionButton.js';

export class MenuScene extends BaseScene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    super.create();   // création BaseScene

    const menuTxt = this.add.text( this.scale.width / 2, 200, 'Menu', { font: '40px Arial', color:'#ffffff' } )
    .setOrigin(0.5);

    const selections = [
      new SceneSelectionButton(this, this.scale.width / 4, 500, 'DesktopScene', 'Bac à sable'),
      new SceneSelectionButton(this, this.scale.width / 2, 500, 'DragExerciceScene', 'Exercice drag'),
    ]

    // for (const elem of selections) {
    //   this.tweens.add({
    //     targets: elem,
        
    //   })
    // }
    
  }
}