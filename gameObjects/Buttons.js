/**
 * Container object of a button.
 */
export class ButtonObject extends Phaser.GameObjects.Container {
  /**
   * Container object of a button.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {Object} shape - The button's shape, dimensions and color
   * @param {string} legend - Text displayed on the button
   */
  constructor(scene, legend, shape) {
    super(scene);

    if (shape.rectangle) this.bg = scene.add.rectangle(0, 0, shape.width ?? 100, shape.height ?? 100);
    else this.bg = scene.add.circle(0, 0, shape.radius ?? 50);
    this.bg.setFillStyle(shape.fillColor ?? 0xff0000);

    const labelStyle = { fontSize: '16px', align: 'center', wordWrap: { width: this.bg.width -5, useAdvancedWrap: true } }
    this.label = scene.add.text(0, 0, legend, labelStyle).setOrigin(0.5);

    this.add([this.bg, this.label]);
    scene.add.existing(this);
  }
}

/**
 * Container object of a scene selection button.
 */
export class SceneSelectionBtn extends Phaser.GameObjects.Container {
  /**
   * Container object of a scene selection button.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {string} target - Key of targeted scene
   * @param {string} legend - Button's text
   * @param {number} fillColor - Button's fill color, default 0xad5ebe
   */
  constructor(scene, target, legend, fillColor = 0x00661a) {
    super(scene);

    const width = 200, height = 300;
    this.bg = scene.add.rectangle(0, 0, width, height, fillColor);
    this.label = scene.add.text(0, 0, legend, { fontSize: '18px', align: 'center', wordWrap: { width: this.bg.width -5, useAdvancedWrap: true } }).setOrigin(0.5);
    this.add([this.bg, this.label]);

    this.setSize(width, height).setInteractive()
      .on('pointerover', () => { this.bg.setFillStyle(0x2db300) })    // Add tween ?
      .on('pointerout', () => { this.bg.setFillStyle(fillColor) })    // Add tween ?
      .on('pointerup', () => { scene.scene.start(target) });

    scene.add.existing(this);
  }

}

/**
 * Container object of a scene return button.
 */
export class SceneReturnBtn extends Phaser.GameObjects.Container {
  /**
   * Container object of a scene return button.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {string} target - Key of targeted scene
   * @param {string} legend - Button's text
   */
  constructor(scene, target, legend) {
    super(scene);

    this.icon = scene.add.image(0, 0, 'returnArrow');
    this.label = scene.add.text(0, 0, legend, { font: '20px Arial', color:'#ffffff' });
    this.add([this.icon, this.label]);

    const width = this.icon.width + this.label.width + 10;
    const height = this.icon.height;

    this.setSize(width, height);
    Phaser.Display.Align.In.LeftCenter(this.icon, this);
    Phaser.Display.Align.In.RightCenter(this.label, this);

    this.setInteractive()
      .on('pointerover', () => { this.updateColor(0x33ff33); })
      .on('pointerout', () => { this.updateColor(0xffffff) })
      .on('pointerup', () => { scene.scene.start(target) });
      
    scene.add.existing(this);
  }

  /**
   * Changes the color of the button's components
   * @param {number} color - The color to use
   */
  updateColor(color) {
    this.icon.setTint(color);
    this.label.setTint(color);
  }
}

/*  COLOR PALETTE TEST 
  1. Purple :
    scene btn off :   0xad5ebe    0x9143a3    0x8a0d8c
    scene btn on  :   0xbe5e9f    0xa34384    0xbb1166
    menu return   :   0xee4499    0xee4499    0xee4499
  
  2. Green :
    scene btn off :   0x00661a
    scene btn on  :   0x2db300
    menu return   :   0x33ff33
*/
