/**
 * Bouton de sélection de scene
 */
export class SceneSelectionButton extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Scene (paramètre nécessaire)
   * @param {number} x - Position horizontale dans la scene
   * @param {number} y - Position verticale dans la scene
   * @param {string} target - Clé de la scene cible
   * @param {string} legend - Texte du boutton
   * @param {number} fillColor - Couleur de remplissage du fond, par défaut 0xad5ebe
   */
  constructor(scene, x, y, target, legend, fillColor = 0xad5ebe) {
    super(scene, x, y);

    this.btnBackground = scene.add.rectangle(0, 0, 200, 300, fillColor);
    this.btnLegend = scene.add.text(0, 0, legend).setOrigin(0.5);

    this.add(this.btnBackground);
    this.add(this.btnLegend);

    this.setSize(this.btnBackground.width, this.btnBackground.height);
    this.setInteractive();

    // Ajout interactions
    this.on('pointerover', () => { this.btnBackground.setFillStyle(0xbe5e9f); });
    this.on('pointerout', () => { this.btnBackground.setFillStyle(fillColor); });
    this.on('pointerup', () => { scene.scene.start(target); });

    // Ajout à la scène
    scene.add.existing(this);
  }

}