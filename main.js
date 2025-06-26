/// <reference path="node_modules/phaser/types/phaser.d.ts" />

import { MainMenu, ExercicesMenu } from './scenes/MenuScenes.js'
import { DesktopScene } from './scenes/DesktopScene.js'
import { DragAndDrop } from './scenes/DragAndDrop.js'
import { DoubleClick } from './scenes/DoubleClick.js'
import { TestScene } from './scenes/TestScene.js'
import { BaseScene } from './scenes/BaseScene.js';

let config = {
  type: Phaser.AUTO,
  parent: 'canvas',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: 1920,
    height: 1080,
  },
  // ALL SCENES
  // scene: [MainMenu, ExercicesMenu, DesktopScene, DragAndDrop, DoubleClick]
  scene: [TestScene]  // TEST
  // scene: [DesktopScene]  // SANDBOX
  // scene: [DoubleClick]   // EXERCICE
}

const game = new Phaser.Game(config);
