/// <reference path="node_modules/phaser/types/phaser.d.ts" />

/**
 * Base pour les scenes du jeu, comprend les fonctionnalités : toggle fullscreen, disable context menu.
 */
class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  create() {
    this.setupFullscreenToggle('SPACE', 'ESC');   // permet l'affichage en mode plein écran
    this.input.mouse.disableContextMenu();    // désactive le comportement clic doit -> menu contextuel
  }

  /**
   * Permet de démarrer et d'arrêter l'affichage en plein écran.
   * @param {string} enterKey - Chaîne de cractères représentant la touche pour activer
   * @param {string} exitKey - Chaîne de cractères représentant la touche pour quitter
   */
  setupFullscreenToggle(enterKey, exitKey) {
    // activer plein écran
    this.input.keyboard?.addKey(enterKey).on('down', () => {
      if (!this.scale.isFullscreen) this.scale.startFullscreen();
    });

    // quitter plein écran
    this.input.keyboard?.addKey(exitKey).on('down', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
    });
  }
}

class DesktopIcon extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene 
   * @param {number} x 
   * @param {number} y 
   * @param {string} texture 
   * @param {string} legend 
   * @param {number} scale 
   */
  constructor(scene, x, y, texture, legend, scale = 1) {
    super(scene, x, y);

    this.isSelected = false    // Variable dernière icône sélectionnée

    // Récupération des dimensions de la texture
    const frame = scene.textures.get(texture).getSourceImage();
    const iconWidth = frame.width * scale;
    const iconHeight = frame.height * scale;

    this.background = scene.add.rectangle(0, -20, iconWidth + 20, iconHeight + 30, 0xffffff).setAlpha(0);
    this.icon = scene.add.image(0, 0, texture).setScale(scale).setOrigin(0.5, 1);
    this.iconTxt = scene.add.text(0, 10, legend, { fontSize: '12px', color:'#ffffff' }).setOrigin(0.5, 0);

    // Ajout des conteneurs
    this.add(this.background);
    this.add(this.icon);
    this.add(this.iconTxt);

    // Ajout intercativité
    this.setSize(this.background.width, this.background.height);
    this.setInteractive({ draggable: true });

    // Ajout interactions
    this.on('pointerover', () => { this.background.setAlpha(0.2); });
    this.on('pointerout', () => { this.background.setAlpha(this.isSelected ? 0.5 : 0); });
    this.on('pointerdown', (pointer) => { if (pointer.leftButtonDown()) this.setSelected(true); })
    this.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); })

    // Ajout à la scène
    scene.add.existing(this);
  }

  setSelected(value) {
    this.isSelected = value;
    this.background.setAlpha(value ? 0.5 : 0);
  }

}


//////////////////////

// Menu principal
class MenuScene extends BaseScene {
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

// Scene desktop
class DesktopScene extends BaseScene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {   // assests à pré-charger
    this.load.image('ducky', 'assets/ducky.png');
    this.load.image('binEmpty', 'assets/recyclebin_empty.png');
    this.load.image('binFull', 'assets/recyclebin_full.png');
  }

  create() {
    super.create();   // création BaseScene

    // DEV : test data display
    this.testInfos = this.add.text(this.scale.width / 2, 15, '', { color: '#ffffff' }).setOrigin(0.5, 0);

    this.icons = [
      this.duckIcon = new DesktopIcon(this, 40, 100, 'ducky', 'canard.png'),
      this.emptyBinIcon = new DesktopIcon(this, 40, 200, 'binEmpty', 'Corbeille'),
    ];
    for (let icon of this.icons) {this.add.existing(icon) }

    this.input.on('pointerdown', (pointer, position) => {
      let clicked = position.find(obj => obj instanceof DesktopIcon);
      this.icons.forEach(icon => {
        if (icon !== clicked || pointer.rightButtonDown()) icon.setSelected(false);
      })
      if (pointer.rightButtonDown()) console.log('context');
    })


    

    // barre tâches => A retravailler pour faire composant !!
    const tasksBar = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 25,
      this.scale.width,
      50,
      0xffffff,
      0.75
    );

  }

  // DEV : test data display
  testInfos;

  update() {
    // récupération valeurs pointer
    // const pointer = this.input.activePointer;

    // DEV : test data display
    this.testInfos.setText([
      'TEST DATA',
      `ducky isSelected : ${this.duckIcon.isSelected}`,
    ]);
  }
}

// configuration jeu
let config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  scene: [DesktopScene]
  // scene: [MenuScene, DesktopScene]
}

// instanciation du jeu
const game = new Phaser.Game(config);
