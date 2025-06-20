import { BaseScene } from './BaseScene.js';
import { SceneSelectionButton } from '../gameObjects/SceneSelectionButton.js';

export class MainMenu extends BaseScene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    super.create();   // création BaseScene

    const menuTxt = this.add.text( this.scale.width / 2, 200, 'MENU PRINCIPAL', { font: '40px Arial', color:'#ffffff' } )
    .setOrigin(0.5);

    const selections = [
      new SceneSelectionButton(this, this.scale.width / 4, 500, 'DesktopScene', 'Bac à sable'),
      new SceneSelectionButton(this, this.scale.width / 2, 500, 'ExercicesMenu', 'Exercices'),
      new SceneSelectionButton(this, this.scale.width / 4 * 3, 500, 'TestScene', 'dev test'),
    ]

    // for (const elem of selections) {
    //   this.tweens.add({
    //     targets: elem,
        
    //   })
    // }
    
  }
}

export class ExercicesMenu extends BaseScene {
  constructor() {
    super({ key: 'ExercicesMenu' });
  }

  create() {
    super.create();   // création BaseScene
    console.log('select exo');

    const menuTxt = this.add.text( this.scale.width / 2, 200, 'EXERCICES', { font: '40px Arial', color:'#ffffff' } )
    .setOrigin(0.5);

    const selections = [
      new SceneSelectionButton(this, this.scale.width / 4, 500, 'DragAndDrop', 'Glisser - Déposer'),
      new SceneSelectionButton(this, this.scale.width / 2, 500, 'DoubleClick', 'Double Clic'),
      // new SceneSelectionButton(this, this.scale.width / 4 * 3, 500, '', ''),
    ]
    
  }
}