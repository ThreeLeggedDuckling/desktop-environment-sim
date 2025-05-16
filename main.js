/// <reference path="node_modules/phaser/types/phaser.d.ts" />

import { MenuScene } from './scenes/MenuScene.js'
import { DesktopScene } from './scenes/DesktopScene.js'
import { DragExerciceScene } from './scenes/DragExerciceScene.js'

let config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  // scene: [DesktopScene]
  scene: [MenuScene, DesktopScene, DragExerciceScene]
}

const game = new Phaser.Game(config);
