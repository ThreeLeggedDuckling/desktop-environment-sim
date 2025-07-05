import { ContextMenu, OptionObject } from "./ContextMenu.js";
import { DEFAULT_FILETYPES, FileObject, FolderObject, SystemObject } from "./Files.js";
import { TaskBarPin } from "./Icons.js";
import { DialogWindow, WindowObject } from "../gameObjects/Windows.js";

/**
 * Container object of a taskbar.
 */
export class TaskBar extends Phaser.GameObjects.Container {
  /**
   * Container object of a taskbar.
   * @param {Phaser.Scene} scene - Parent scene containing the taskbar
   * @param {Array<FileObject>} taskPins - Array of elemnts pinned to the taskbar
   * @param {boolean} centered - Define the alignement of the pins within the taskbar
   */
	constructor(scene, taskPins = [], centered = true) {
    super(scene, scene.scale.width / 2, scene.scale.height - 25);

    const systemPins = [
      // new SystemObject('Réseau', 'system', 'gestion du son'),
      // new SystemObject('Volume', 'system', 'gestion du son'),
    ]

    // Add menu pin to taskbar
    taskPins.unshift(new SystemObject('Démarrer', 'winMenu', ['option 1', 'option 2', 'option 3']));
    
    // Create background component
    this.background = scene.add.rectangle(0, 0, scene.scale.width, 50, 0xffffff, 0.9).setStrokeStyle(1, 0xbfbfbf);
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
    Phaser.Display.Align.In.RightCenter(this.systemContainer, this.background, - (this.systemContainer.length * 40 + 5));

    // Set up taskbar to allow interactivity
    this.setSize(this.background.width, this.background.height);
    this.setInteractive();

    this.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) this.spawnMenu(pointer);
    })

    // Add taskbar to scene
    scene.add.existing(this);
  }

  /**
   * Spawn taskbar's contextual menu.
   * @param {Phaser.Input.Pointer} pointer - Pointer input, used for positionning
   */
  spawnMenu(pointer) {
    const posX = pointer.x, posY = pointer.y;
    //@ts-ignore
    const screenCenter = { x: this.scene.scale.width / 2, y: (this.scene.scale.height - this.scene.taskBar.height) / 2 };

    /**
     * Spawn a dummy dialog window
     */
    const openTaskManager = () => {
      //@ts-ignore
      const tm = new WindowObject(this.scene, screenCenter.x, screenCenter.y, 700, 500, new FileObject('Gestionnaire des tâches', DEFAULT_FILETYPES.SYSTEM, null), { isDefault: false }, { isDefault: false });
    }

    /**
     * Spawn a dummy dialog window
     */
    const openTaskBarSettings = () => {
      //@ts-ignore
      const tm = new WindowObject(this.scene, screenCenter.x, screenCenter.y, 800, 800, new FileObject('Paramètres', DEFAULT_FILETYPES.SYSTEM, null), { isDefault: false }, { isDefault: false });
    }

    const contextual = new ContextMenu(this.scene, posX, posY, [
      new OptionObject('Gestionnaire des tâches', openTaskManager),
      new OptionObject('Paramètres de la barre des tâches', openTaskBarSettings),
      new OptionObject('Retour au menu principal', () => { this.scene.scene.start('MainMenu') }),
    ]);
    
    // Update menu position to be above taskbar and fully visible
    const newPosY = this.y - this.height / 2 - contextual.background.height;
    contextual.adjustSelfPosition(null, newPosY);

    this.scene.add.existing(contextual);
    //@ts-ignore
    this.scene.CONTEXTUAL_MANAGER.addMenu(contextual, pointer.downTime);
  }

}