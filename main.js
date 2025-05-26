/// <reference path="node_modules/phaser/types/phaser.d.ts" />

import { MenuScene } from './scenes/MenuScene.js'
import { DesktopScene } from './scenes/DesktopScene.js'
import { DragExerciceScene } from './scenes/DragExerciceScene.js'
import { TestScene } from './scenes/TestScene.js'

let config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  scene: [TestScene]
  // scene: [MenuScene, DesktopScene, DragExerciceScene]
  // scene: [MenuScene, DesktopScene, DragExerciceScene, TestScene]
  // scene: [DesktopScene]
  // scene: [DragExerciceScene]
}

const game = new Phaser.Game(config);
