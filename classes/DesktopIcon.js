import { FileObject, FolderObject } from "./FileClasses.js";

export class DesktopIcon extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - Parent scene containing the icon
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {FileObject} file - File or folder related to the icon
   * @param {number} scale - Scale modificator for the icon texture
   */
  constructor(scene, x, y, file, scale = 1) {
    super(scene, x, y);
    this.file = file;

    // Set initial state for active texture
    if (file instanceof FolderObject) this.isEmptyFolder = (file.content.length == 0);
    else this.isEmptyFolder = true;

    // Store if the icon is actively selected
    this.isSelected = false

    // Get active texture
    const texture = (file.fileType.type == 'image' && scene.game.textures.exists(file.content)) ? file.content : file.fileType.texture;
    this.textureKeys = Array.isArray(texture) ? texture : [texture, texture];
    const activeTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];

    // Get active texture dimensions
    const frame = scene.textures.get(activeTexture).getSourceImage();
    const iconWidth = frame.width * scale;
    const iconHeight = frame.height * scale;

    // Initiate the icon components
    this.background = scene.add.rectangle(0, -20, iconWidth + 20, iconHeight + 30, 0xffffff).setAlpha(0);
    this.icon = scene.add.image(0, 0, activeTexture).setScale(scale).setOrigin(0.5, 1);
    this.iconTxt = scene.add.text(0, 10, `${file.name}${file.fileType.extension}`, { fontSize: '12px' }).setOrigin(0.5, 0);

    // Add components to the icon container
    this.add(this.background);
    this.add(this.icon);
    this.add(this.iconTxt);

    // Set up to allow interactivity
    this.setSize(this.background.width, this.background.height);
    this.setInteractive({ draggable: true });

    // Add interactions inputs
    this.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); })
    this.on('pointerover', () => { this.background.setAlpha(0.2); });
    this.on('pointerout', () => { this.background.setAlpha(this.isSelected ? 0.5 : 0); });
    this.on('pointerdown', (pointer) => { if (pointer.leftButtonDown()) this.setSelected(true); })

    // Add the icon to the scene
    scene.add.existing(this);
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
   * Set value of isSelected.
   * @param {boolean} value 
   */
  setSelected(value) {
    this.isSelected = value;
    this.background.setAlpha(value ? 0.5 : 0);
  }

  /**
   * Set active texture.
   */
  updateIconTexture() {
    const newTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];
    this.icon.setTexture(newTexture);
  }

}