import { ContextMenu, OptionObject } from "./ContextMenu.js";
import { FileObject, FolderObject, SystemObject } from "./Files.js";
import { DialogWindow, WindowObject } from "../gameObjects/Windows.js";

/**
 * Container object of an icon.
 */
export class Icon extends Phaser.GameObjects.Container {
  /**
   * Container object of an icon.
   * @param {Phaser.Scene} scene - Parent scene containing the icon
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {FileObject} file - File or folder related to the icon
   * @param {number} dimensions - Height and width value in pixels of the icon
   * @param {number | Array<number>} padding - Padding of the icon in pixels, either for both axis or [X axis, Y axis]. Default value is 3.
   */
  constructor(scene, x, y, file, dimensions, padding = 3) {
    super(scene, x, y);

    this.file = file;
    this.name = `${file.name}${file.fileType.extension}`;
    
    // Store if the icon is actively selected
    this.isSelected = false;

    // Get texture
    const texture = Array.isArray(file.fileType.texture) ? file.fileType.texture[0] : file.fileType.texture;

    // Get scale value
    const frame = scene.textures.get(texture).getSourceImage();
    const scale = dimensions / Math.max(frame.width, frame.height);

    // Get padding values
    const paddingX = Array.isArray(padding) ? padding[0] * 2 : padding * 2;
    const paddingY = Array.isArray(padding) ? padding[1] * 2 : paddingX;

    // Initiate the icon components
    this.background = scene.add.rectangle(0, 0, dimensions + paddingX, dimensions + paddingY, 0xffffff).setAlpha(0);
    this.icon = scene.add.image(0, 0, texture).setScale(scale);

    // Add components to the icon container
    this.add([this.background, this.icon]);

    // Add the icon to the scene
    scene.add.existing(this);
  }

  /**
   * Set isSelected.
   * @param {boolean} value 
   */
  setSelected(value) {
    this.isSelected = value;
    this.background.setAlpha(value ? 0.5 : 0);
  }

}

// IMPLEMENTER BOUTON AFFICHAGE EXTENSION
/**
 * Container object of a desktop icon.
 */
export class DesktopIcon extends Icon {
  /**
   * Container object of a desktop icon.
   * @param {Phaser.Scene} scene - Parent scene containing the icon
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {FileObject} file - File or folder related to the icon
   * @param {number} dimensions - Height and width value in pixels of the icon. Default value is 64.
   * @param {number | Array<number>} padding - Padding of the icon in pixels, either for both axis or [X axis, Y axis]. Default value is [10, 5].
   */
  constructor(scene, x, y, file, dimensions = 64, padding = [10, 5]) {
    super(scene, x, y, file, dimensions, padding)

    // Set initial state for active texture
    if (file instanceof FolderObject) this.isEmptyFolder = (file.content.length == 0);
    else this.isEmptyFolder = true;

    // Get active texture
    const texture = (file.fileType.type == 'image' && scene.game.textures.exists(file.content)) ? file.content : file.fileType.texture;
    this.textureKeys = Array.isArray(texture) ? texture : [texture, texture];
    const activeTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];

    // Get scale value
    const frame = scene.textures.get(activeTexture).getSourceImage();
    const scale = dimensions / Math.max(frame.width, frame.height);

    // Adjust icon texture
    this.icon.setTexture(activeTexture).setScale(scale);

    // Get padding values
    const paddingX = Array.isArray(padding) ? padding[0] * 2 : padding * 2;
    const paddingY = Array.isArray(padding) ? padding[1] * 2 : paddingX;

    // Initiate additional icon components
    const legendStyle = { fontSize: '16px', align: 'center', wordWrap: { width: dimensions + paddingX, useAdvancedWrap: true } };
    this.iconLegend = scene.add.text(0, 0, file.name, legendStyle).setOrigin(0.5);

    // Get components dimensions
    const iconHeight = this.icon.displayHeight;
    const legendHeight = this.iconLegend.height;
    const totalHeight = iconHeight + legendHeight + paddingY + 5;
    const totalWidth = dimensions + paddingX + 10;

    // Adjust components display
    this.background.setSize(totalWidth, totalHeight);
    this.icon.setY((- totalHeight + paddingY + iconHeight) / 2);
    this.iconLegend.setY((totalHeight - paddingY - legendHeight) / 2);

    // Set up to allow interactivity
    this.setSize(this.background.width, this.background.height);
    this.setInteractive({ draggable: true });

    // Add interactions inputs
    this.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); });
    this.on('pointerover', () => { this.background.setAlpha(0.2); });
    this.on('pointerout', () => { this.background.setAlpha(this.isSelected ? 0.5 : 0); });
    this.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) this.setSelected(true);
      if (pointer.rightButtonDown()) this.spawnMenu(pointer);
    })

    // Add components to the icon container
    this.add(this.iconLegend);

    // Adjust hit area
    // this.input.hitArea.setTo(0, 0, totalWidth, totalHeight);
  }

  /**
   * Set value of isEmptyFolder.
   * @param {boolean} isEmpty - New value to toggle active texture
   */
  setEmptyFolder(isEmpty) {
    if (this.file instanceof FolderObject && this.isEmptyFolder !== isEmpty) {
      this.isEmptyFolder = isEmpty;
      this.updateIconTexture();
    }
  }

  /**
   * Spawn the icon's contextual menu.
   * @param {Phaser.Input.Pointer} pointer 
   */
  spawnMenu(pointer) {
    let posX = pointer.x, posY = pointer.y;

    /**
     * Spawn a dummy dialog window
     */
    const spawnDialog = () => {
      const dialog = new DialogWindow(
        this.scene,
        this.scene.scale.width /2,
        this.scene.scale.height /2,
        500,
        [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tellus libero, maximus in maximus at, molestie sed ligula.',
          'Donec nec turpis placerat, mollis tellus vel, dignissim tellus.'
        ],
        false,
        [
          { label: 'Btn 1', callback: () => { console.log('je suis btn 1'); } },
          { label: 'Btn 2', callback: () => {} },
          { label: 'Btn 3', callback: () => {} },
        ]
      );
    }

    // PLACEHOLDER CONTEXTE MENU
    /*
    const contextual = new ContextMenu(this.scene, posX, posY, [
      new OptionObject('Dialog', spawnDialog),
      new OptionObject('Sous-options', null, [
        new OptionObject('Sous option 1'),
        new OptionObject('Sous option 2'),
      ]),
      new OptionObject('Option vide'),
    ]);
    */
    const contextual = new ContextMenu(this.scene, posX, posY, [
      new OptionObject('Option 1'),
      new OptionObject('Option 2'),
      new OptionObject('Option 3'),
    ]);
    contextual.adjustSelfPosition();

    this.scene.add.existing(contextual);
    //@ts-ignore
    this.scene.CONTEXTUAL_MANAGER.addMenu(contextual, pointer.downTime);
  }

  /**
   * Spawn a window for the icon's content.
   */
  spawnWindow() {
    //@ts-ignore
    const screenCenter = { x: this.scene.scale.width / 2, y: (this.scene.scale.height - this.scene.taskBar.height) / 2 };

    //@ts-ignore
    const contentWindow = new WindowObject(this.scene, screenCenter.x, screenCenter.y, 800, 600, this.file, { isDefault: false }, { isDefault: false })
  }

  /**
   * Set active texture.
   */
  updateIconTexture() {
    const newTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];
    this.icon.setTexture(newTexture);
  }

}

/**
 * Container object of a taskbar pin.
 */
export class TaskBarPin extends Icon {
  /**
   * Container object of a taskbar pin.
   * @param {Phaser.Scene} scene - Parent scene containing the icon
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {FileObject} file - File or folder related to the icon
   * @param {number} dimensions - Height and width value in pixels of the icon. Default set to 40.
   * @param {number | Array<number>} padding - Padding of the icon in pixels, either for both axis or [X axis, Y axis]. Default value set to 3.
   */
  constructor(scene, x, y, file, dimensions = 40, padding = 3) {
    super(scene, x, y, file, dimensions, padding);
    
    // Store if a related window is open
    this.isOpen = false;

    // Get texture
    let texture;
    // @ts-ignore
    if (file instanceof SystemObject) texture = file.texture;
    else texture = Array.isArray(file.fileType.texture) ? file.fileType.texture[0] : file.fileType.texture;

    // Get scale value
    const frame = scene.textures.get(texture).getSourceImage();
    const scale = dimensions / Math.max(frame.width, frame.height);
    this.icon.setTexture(texture).setScale(scale);

    // Set up to allow interactivity
    this.setSize(this.background.width, this.background.height);
    if (file.constructor !== SystemObject) this.setInteractive({ draggable: true });
    else this.setInteractive();

    // Add hover behavior
    this.on('pointerover', () => { this.background.setAlpha(0.2); });
    this.on('pointerout', () => { this.background.setAlpha(this.isSelected ? 0.5 : 0); });

    // Add on click behavior (drag behavior managed by taskbar)
    this.on('pointerdown', (pointer) => {
      // MODIFIER CLICK GAUCHE
      // if (pointer.leftButtonDown()) this.setSelected(true);

      if (pointer.rightButtonDown()) this.spawnMenu(pointer);
    })

    // Add the icon to the scene
    scene.add.existing(this);
  }

  /**
   * Spawn the pin's contextual menu.
   * @param {Phaser.Input.Pointer} pointer
   */
  spawnMenu(pointer) {
    let posX = pointer.x, posY = pointer.y;

    /**
     * Spawn a dummy dialog window
     */
    const spawnDialog = () => {
      const dialog = new DialogWindow(
        this.scene,
        this.scene.scale.width /2,
        this.scene.scale.height /2,
        500,
        [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tellus libero, maximus in maximus at, molestie sed ligula.',
          'Donec nec turpis placerat, mollis tellus vel, dignissim tellus.'
        ],
        false,
        [
          { label: 'Btn 1', callback: () => { console.log('je suis btn 1'); } },
          { label: 'Btn 2', callback: () => {} },
          { label: 'Btn 3', callback: () => {} },
        ]
      );
    }

    // PLACEHOLDER CONTEXTE MENU
    const contextual = new ContextMenu(this.scene, posX, posY, [
      new OptionObject('Option 1'),
      new OptionObject('Option 2'),
      new OptionObject('Option 3'),
    ]);

    // Update menu position to be above taskbar and fully visible
    // @ts-ignore
    const newPosY = this.scene.scale.height - this.scene.taskBar.height - contextual.background.height;
    contextual.adjustSelfPosition(null, newPosY);

    this.scene.add.existing(contextual);
    //@ts-ignore
    this.scene.CONTEXTUAL_MANAGER.addMenu(contextual, pointer.downTime);
  }

}
