import Phaser, { Scene } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
  },
  backgroundColor: '#2ecc71',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

// préchargement assets
function preload(this: Phaser.Scene) {
  // logic
}

// scene de base
function create(this: Phaser.Scene) {
  // test fullscreen toggle F
  this.input.keyboard?.addKey('F').on('down', () => {
    if (this.scale.isFullscreen) this.scale.stopFullscreen();
    else this.scale.startFullscreen();
  })

  // test fullscreen toggle btn
  // const fsBtn = this.add.text(700, 20, 'fullscreen', {
  //   font: '20px Arial',
  //   color: '#ffffff',
  //   padding: { x: 10, y: 5 }
  // })
  //   .setInteractive()
  //   .setScrollFactor(0)
  //   .setDepth(1000);  // z-index
  
  // fsBtn.on('pointerup', () => {
  //   if (this.scale.isFullscreen) this.scale.stopFullscreen();
  //   else this.scale.startFullscreen();
  // })
}

// màj scene
function update(this: Phaser.Scene) {
  // logic
}
