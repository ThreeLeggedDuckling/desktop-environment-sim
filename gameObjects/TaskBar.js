import { MENUMANAGER } from "../handlers/MenuManager.js";

import { ContextMenu, OptionObject } from "./ContextMenu.js";
import { DEFAULT_FILETYPES, FileObject, FolderObject, SystemObject } from "./Files.js";
import { TaskBarPin } from "./Icons.js";

export class TaskBar extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Parent scene containing the taskbar
   * @param {Array<FileObject>} taskPins - Array of elemnts pinned to the taskbar
   * @param {boolean} centered - Define the alignement of the pins within the taskbar
   */
	constructor(scene, taskPins = [], centered = true) {
    super(scene, scene.scale.width / 2, scene.scale.height - 25);

    const systemPins = [
      // new SystemObject('Volume', 'winMenu', 'gestion du son'),
    ]

    // Add menu pin to taskbar
    taskPins.unshift(new SystemObject('Démarrer', 'winMenu', ['option 1', 'option 2', 'option 3']));
    
    // Create background component
    this.background = scene.add.rectangle(0, 0, scene.scale.width, 50, 0xffffff, 0.8)
    this.add(this.background);

    // Create task pins container
    this.taskContainer = new Phaser.GameObjects.Container(scene);
    taskPins.forEach((data, i) => {
      // Create pin component
      const pin = new TaskBarPin(scene, i * 50, 0, data);

      // Add drag behavior
      pin.on('drag', (pointer, dragX) => {
        // Restrict drag area within bounds
        // dragX = Phaser.Math.Clamp(dragX, -100, 100);   A DEFINIR
        pin.x = dragX;
      })

      // Bring pin to the top during drag
      pin.on('dragstart', () => {
        this.taskContainer.bringToTop(pin);
        pin.setScale(1.2)
        // pin.setSelected(false);   // useless? quick fix
      })

      pin.on('dragend', () => {
        pin.setScale(1)
        // pin.setSelected(false);   // useless? terrible quick fix
      })

      // Add pin component to container
      this.taskContainer.add(pin);
    });

    // Add task pins containers to taskbar
    this.add(this.taskContainer);

    // If not centered, align task pins container to the left of the taskbar
    if (!centered) Phaser.Display.Align.In.LeftCenter(this.taskContainer, this.background);
    else Phaser.Display.Align.In.Center(this.taskContainer, this.background);

    // Create system pins container
    this.systemContainer = new Phaser.GameObjects.Container(scene);
    systemPins.forEach((data, i) => {
      // Create pin component
      const pin = new TaskBarPin(scene, i * 50, 0, data);

      // Add pin component to container
      this.systemContainer.add(pin);
    });

    // Add system pins container to taskbar
    this.add(this.systemContainer);

    // Align system pins container to the right of the taskbar
    this.systemContainer.setX(this.background.width / 2 - (this.systemContainer.length * 40 + 10))  // not the cleanest solution but a working one

    // Set up taskbar to allow interactivity
    this.setSize(this.background.width, this.background.height);
    this.setInteractive();

    this.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) {
        // MENUMANAGER.blockNextPointerDown(pointer.event.timeStamp);
        
        // console.log(object);
        let posX = pointer.x, posY = pointer.y;
        
        // alert('yay');
        const contextual = new ContextMenu(scene, posX, posY, [
          new OptionObject('test', null, null),
          new OptionObject('voilà', null, null),
          new OptionObject('ok', null, null),
        ]);
        posY= this.y - this.height / 2 - contextual.background.height;
        contextual.setPosition(posX, posY);
        
        //debug
        console.log('TASKBAR EVENT');
        // console.log('> menuManager.has(menu)', MENUMANAGER.openMenus.has(contextual));

        scene.add.existing(contextual);
        // MENUMANAGER.blockNewMenuDestruction(contextual, pointer.event.timeStamp);
        MENUMANAGER.spawnRootMenu(contextual);
        
        // console.log('TEST NEW MENU');
        // if (scene.children.list.filter(elem => elem instanceof ContextMenu)) console.log('> success');
      }
    })

    // Add taskbar to scene
    scene.add.existing(this);
  }

}