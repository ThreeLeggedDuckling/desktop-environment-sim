/**
 * Icône de bureau
 */
export class DesktopIcon extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Scene (paramètre nécessaire).
   * @param {number} x - Position horizontale dans la scene.
   * @param {number} y - Position verticale dans la scene.
   * @param {string | string[]} texture - Clé ou tableau de clés des images de l'icône. Dans le cas d'un tableau, le format doit être [vide, rempli].
   * @param {string} legend - Texte de l'icône
   * @param {boolean} isEmptyFolder - Etat permettant de sélectionner la texture à appliquer.
   * @param {number} scale - Modificateur de l'échelle de l'image.
   */
  constructor(scene, x, y, texture, legend, isEmptyFolder = true, scale = 1) {
    super(scene, x, y);

    this.name = legend;
    this.isEmptyFolder = isEmptyFolder;
    this.isSelected = false    // Variable dernière icône sélectionnée

    // Récupération de la texture à appliquer
    this.textureKeys = Array.isArray(texture) ? texture : [texture, texture];
    const activeTexture = this.isEmptyFolder ? this.textureKeys[0] : this.textureKeys[1];

    // Récupération des dimensions de la texture
    const frame = scene.textures.get(activeTexture).getSourceImage();
    const iconWidth = frame.width * scale;
    const iconHeight = frame.height * scale;

    this.background = scene.add.rectangle(0, -20, iconWidth + 20, iconHeight + 30, 0xffffff).setAlpha(0);
    this.icon = scene.add.image(0, 0, activeTexture).setScale(scale).setOrigin(0.5, 1);
    this.iconTxt = scene.add.text(0, 10, legend, { fontSize: '12px' }).setOrigin(0.5, 0);

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
    if (this.isEmptyFolder !== isEmpty) {
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