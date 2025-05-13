// intellisens pour le développement
/// <reference path="node_modules/phaser/types/phaser.d.ts" />

/**
 * Affichage plein écran
 * @param {Phaser.Scene} scene - Scene à laquelle s'applique la fonction
 * @param {string} enterKey - String représentant la touche pour activer le plein écran
 * @param {string} exitKey - String représentant la touche pour quitter le plein écran
 */
function fullscreenToggle(scene, enterKey, exitKey) {
  /*  test "bouton" plein écran
  const fsBtn = this.add.text(700, 20, 'fullscreen', {
    font: '40px Arial',
    color: '#ffffff',
    padding: { x: 10, y: 5 }
  })
    .setInteractive()
    .setScrollFactor(0)
    .setDepth(1000); // z-index

  fsBtn.on('pointerup', () => {
    if (this.scale.isFullscreen) this.scale.stopFullscreen();
    else this.scale.startFullscreen();
  });
  */
 
  // activer plein écran
  scene.input.keyboard?.addKey(enterKey).on('down', () => {
    if (!scene.scale.isFullscreen) scene.scale.startFullscreen();
  });

  // quitter plein écran
  scene.input.keyboard?.addKey(exitKey).on('down', () => {
    if (scene.scale.isFullscreen) scene.scale.stopFullscreen();
  });
}


// scene menu
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    fullscreenToggle(this, 'SPACE', 'ESC');

    const menuTxt = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      'Menu',
      {
        font: '40px Arial',
        color:'#000000'
      }
    )
    .setOrigin(0.5)
    .setInteractive();

    menuTxt.on('pointerup', () => {
      this.scene.start('MainScene');
    });
  }
}


// scene principale
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // logique
  }

  create() {
    fullscreenToggle(this, 'SPACE', 'ESC');

    // barre tâches
    const tasksBar = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 25,
      this.scale.width,
      50,
      0xe3eefa,
      0.75
    );
  }

  update() {
    // logique
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
    backgroundColor: '#b6d1e5',
    scene: [MainScene]
    // scene: [MenuScene, MainScene]
}

// instanciation du jeu
const game = new Phaser.Game(config);
