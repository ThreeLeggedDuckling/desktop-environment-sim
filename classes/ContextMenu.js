/**
 * Menu contextuel
 */
export class ContextMenu extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Scene
   * @param {number} x - Position horizontale
   * @param {number} y - Position verticale
   * @param {[]} options - Tableau contenant les options du menu au format { name: 'nomOption', subOptions?: [] }
   */
  constructor(scene, x, y, options) {
    super(scene, x, y);

    // A RETRAVAILLER
    for (const elem of options) {
      this.optionTxt = scene.add.text(0, 0, elem)   //REPRENDRE
      this.optionBackground = scene.add.rectangle(0, 0, this.optionTxt.width, this.optionTxt.height, 0xffffff).setAlpha(0.5);

      this.add(this.optionBackground)
      this.add(this.optionTxt);

      this.setSize(this.optionBackground.width, this.optionBackground.height);
      this.setInteractive();

      this.on('pointerover', () => { this.optionBackground.setAlpha(0.2) });
      this.on('pointerout', () => { this.optionBackground.setAlpha(0.5) });
    }
  }
}