/**
 * Icône de bureau
 */
export class DesktopIcon extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Scene (paramètre nécessaire)
   * @param {number} x - Position horizontale dans la scene
   * @param {number} y - Position verticale dans la scene
   * @param {string} texture - Clé de l'image de l'icône
   * @param {string} legend - Texte de l'icône
   * @param {number} scale - Modificateur de l'échelle de l'image
   */
  constructor(scene, x, y, texture, legend, scale = 1) {
    super(scene, x, y);

    this.isSelected = false    // Variable dernière icône sélectionnée

    // Récupération des dimensions de la texture
    const frame = scene.textures.get(texture).getSourceImage();
    const iconWidth = frame.width * scale;
    const iconHeight = frame.height * scale;

    this.background = scene.add.rectangle(0, -20, iconWidth + 20, iconHeight + 30, 0xffffff).setAlpha(0);
    this.icon = scene.add.image(0, 0, texture).setScale(scale).setOrigin(0.5, 1);
    this.iconTxt = scene.add.text(0, 10, legend, { fontSize: '12px' }).setOrigin(0.5, 0);

    // Ajout des conteneurs
    this.add(this.background);
    this.add(this.icon);
    this.add(this.iconTxt);

    // Ajout intercativité
    this.setSize(this.background.width, this.background.height);
    this.setInteractive({ draggable: true });

    // Ajout interactions
    this.on('pointerover', () => { this.background.setAlpha(0.2); });
    this.on('pointerout', () => { this.background.setAlpha(this.isSelected ? 0.5 : 0); });
    this.on('pointerdown', (pointer) => { if (pointer.leftButtonDown()) this.setSelected(true); })
    this.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); })

    // Ajout à la scène
    scene.add.existing(this);
  }

  setSelected(value) {
    this.isSelected = value;
    this.background.setAlpha(value ? 0.5 : 0);
  }

}