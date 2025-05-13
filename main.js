// intellisens pour le développement
/// <reference path="node_modules/phaser/types/phaser.d.ts" />

// scene principale
class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // logic
  }

  create() {
    // test fullscreen toggle "btn"
    /*
    const fsBtn = this.add.text(700, 20, 'fullscreen', {
      font: '20px Arial',
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

    // activer plein écran avec 'ESPACE'
    this.input.keyboard?.addKey('SPACE').on('down', () => {
      if (!this.scale.isFullscreen) this.scale.startFullscreen();
    });

    // quitter plein écran avec 'ECHAP'
    this.input.keyboard?.addKey('ESC').on('down', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
    });

    // barre tâches
    const tasksBar = this.add.rectangle(100, 200, 100, 200, 0xe3eefa);
  }

  update() {
    // logic
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
}

// instanciation du jeu
const game = new Phaser.Game(config);
