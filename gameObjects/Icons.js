import { MENUMANAGER } from "../handlers/MenuManager.js";

import { ContextMenu, OptionObject } from "./ContextMenu.js";
import { DEFAULT_FILETYPES, FileObject, FolderObject, SystemObject } from "./Files.js";

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

    // Set associated file
    this.file = file;
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
    this.iconLegend = scene.add.text(
      0,
      0,
      `${file.name}${file.fileType.extension}`,
      { fontSize: '16px', align: 'center', wordWrap: { width: dimensions + paddingX, useAdvancedWrap: true } }
    ).setOrigin(0.5, 0.5);

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

  spawnMenu(pointer) {
    let posX = pointer.x, posY = pointer.y;

    // PLACEHOLDER CONTEXTE MENU
    const contextual = new ContextMenu(this.scene, posX, posY, [
      new OptionObject('option 1', null),
      new OptionObject('option 2', null),
      new OptionObject('option 3', null, [
        new OptionObject('aaaaaa', null),
        new OptionObject('aaaaaa', null),
        new OptionObject('aaaaaa', null),
        new OptionObject('aaaaaa', null),
        new OptionObject('aaaaaa', null),
      ]),
    ]);
    contextual.adjustSelfPosition();

    this.scene.add.existing(contextual);
    MENUMANAGER.addMenu(contextual, pointer.downTime);
  }

  /**
   * Set active texture.
   */
  updateIconTexture() {
    const newTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];
    this.icon.setTexture(newTexture);
  }

}

export class TaskBarPin extends Icon {
  /**
   * 
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

    this.on('pointerdown', (pointer) => {
      // MODIFIER CLICK GAUCHE
      // if (pointer.leftButtonDown()) this.setSelected(true);

      if (pointer.rightButtonDown()) {
        let posX = pointer.x, posY = pointer.y;

        // PLACEHOLDER CONTEXTE MENU
        const contextual = new ContextMenu(scene, posX, posY, [
          new OptionObject('option 1', null),
          new OptionObject('option 2', null),
          new OptionObject('option 3', null, [ new OptionObject('a', null) ]),
        ]);

        scene.add.existing(contextual);
        MENUMANAGER.addMenu(contextual, pointer.downTime);
      }
    })

    // Drag behavior managed inside TaskBar

    // Add the icon to the scene
    scene.add.existing(this);
  }

}
