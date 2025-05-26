import { FileObject, FolderObject } from "./FileClasses.js";

/**
 * Icône de bureau
 */
export class DesktopIcon extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Scene (paramètre nécessaire).
   * @param {number} x - Position horizontale dans la scene.
   * @param {number} y - Position verticale dans la scene.
   * @param {FileObject} file - Fichier ou dossier auquel se rapporte l'icone.
   * @param {number} scale - Modificateur de l'échelle de l'image.
   */
  constructor(scene, x, y, file, scale = 1) {
    super(scene, x, y);

    this.file = file;
    if (file instanceof FolderObject) this.isEmptyFolder = (file.content.length == 0);
    else this.isEmptyFolder = true;

    this.isSelected = false    // Variable dernière icône sélectionnée

    // Récupération de la texture à appliquer
    const texture = (file.fileType.type == 'image' && scene.game.textures.exists(file.content)) ? file.content : file.fileType.texture;
    this.textureKeys = Array.isArray(texture) ? texture : [texture, texture];
    const activeTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];

    // Récupération des dimensions de la texture
    const frame = scene.textures.get(activeTexture).getSourceImage();
    const iconWidth = frame.width * scale;
    const iconHeight = frame.height * scale;

    this.background = scene.add.rectangle(0, -20, iconWidth + 20, iconHeight + 30, 0xffffff).setAlpha(0);
    this.icon = scene.add.image(0, 0, activeTexture).setScale(scale).setOrigin(0.5, 1);
    this.iconTxt = scene.add.text(0, 10, `${file.name}${file.fileType.extension}`, { fontSize: '12px' }).setOrigin(0.5, 0);

    // Ajout des conteneurs
    this.add(this.background);
    this.add(this.icon);
    this.add(this.iconTxt);

    // Ajout intercativité
    this.setSize(this.background.width, this.background.height);
    this.setInteractive({ draggable: true });

    // Ajout interactions
    this.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); })
    this.on('pointerover', () => { this.background.setAlpha(0.2); });
    this.on('pointerout', () => { this.background.setAlpha(this.isSelected ? 0.5 : 0); });
    this.on('pointerdown', (pointer) => { if (pointer.leftButtonDown()) this.setSelected(true); })

    // Ajout à la scène
    scene.add.existing(this);
  }

  setEmptyFolder(isEmpty) {
    if (this.file instanceof FolderObject && this.isEmptyFolder !== isEmpty) {
      this.isEmptyFolder = isEmpty;
      this.updateIconTexture();
    }
  }

  setSelected(value) {
    this.isSelected = value;
    this.background.setAlpha(value ? 0.5 : 0);
  }

  updateIconTexture() {
    const newTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];
    this.icon.setTexture(newTexture);
  }

}