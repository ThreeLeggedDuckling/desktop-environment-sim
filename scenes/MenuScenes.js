import { BaseScene } from './BaseScene.js';
import { SceneReturnBtn, SceneSelectionBtn } from '../gameObjects/Buttons.js';

const titleStyle = { font: '40px Arial', color:'#ffffff' };

export class MainMenu extends BaseScene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    super.create();

    const screen = this.add.zone(0, 0, this.scale.width, this.scale.height).setOrigin(0);
    const menuTitle = this.add.text(0, 0, 'MENU PRINCIPAL', titleStyle).setPadding(100).setOrigin(0.5);
    const buttons = [
      new SceneSelectionBtn(this, 'DesktopScene', 'Bac à sable'),
      new SceneSelectionBtn(this, 'ExercicesMenu', 'Exercices'),
      // new SceneSelectionButton(this, 'ExercicesMenu', 'Exercices'),
    ];

    // Place items
    Phaser.Display.Align.In.TopCenter(menuTitle, screen);
    Phaser.Actions.GridAlign(buttons, {
      width: 3,
      cellWidth: 250,
      x: 600,
      y: 400
    });
  }
}
    
export class ExercicesMenu extends BaseScene {
  constructor() {
    super({ key: 'ExercicesMenu' });
  }

  create() {
    super.create();

    const screen = this.add.zone(0, 0, this.scale.width, this.scale.height).setOrigin(0);
    const menuTitle = this.add.text(0, 0, 'EXERCICES', titleStyle).setPadding(100).setOrigin(0.5);
    const buttons = [
      new SceneSelectionBtn(this, 'DragAndDrop', 'Glisser - Déposer'),
      new SceneSelectionBtn(this, 'DoubleClick', 'Double Clic'),
      // new SceneSelectionBtn(this, '', '[placeholder]'),
      // new SceneSelectionBtn(this, '', '[placeholder]'),
      // new SceneSelectionBtn(this, '', '[placeholder]'),
    ];

    // Place items
    Phaser.Display.Align.In.TopCenter(menuTitle, screen);
    Phaser.Actions.GridAlign(buttons, {
      width: 5,
      cellWidth: 250,
      x: 370,
      y: 400
    });

    // Add return to menu button
    const returnBtn = new SceneReturnBtn(this, 'MainMenu', 'Menu principal').setPosition(200, 200);
  }
}