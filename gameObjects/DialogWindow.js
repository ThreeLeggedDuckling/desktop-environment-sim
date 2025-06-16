export class DialogWindow extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene to add the dialog to
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {string} message - Message to display
   * @param {boolean} xAxisButtons - Set the buttons direction as following the X or Y axis. By default, the direction is horizontal (Y axis).
   * @param {Array<{ label : string, callback: () => void }>} buttons - Array of buttons' label and callback
   */
  constructor(scene, x, y, width, message, xAxisButtons = false, buttons = [{ label: 'OK', callback: () => {} }]) {
    super(scene, x, y);

    // Initiate the dialog components
    this.background = scene.add.rectangle(0, 0, width, 300, 0xffffff);
    //   .setOrigin(0.5)
    //   .setStrokeStyle(2, 0xffffff);
    this.text = scene.add.text(0, -70, message, { fontSize: '16px', color: '#000', wordWrap: { width: 460 } }).setOrigin(0.5);

    // Add components to the dialog container
    this.add(this.background);
    this.add(this.text);

    // (??)
    const buttonY = 40;
    const spacing = 300 / buttons.length;
    
    // Create and add the button components
    buttons.forEach((btnData, i) => {
      // Create the button component
      const btn = scene.add.text((i - (buttons.length - 1) / 2) * spacing, buttonY, btnData.label, {
        fontSize: '14px',
        backgroundColor: '#fdfdfd',
        color: '#000',
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5);

      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#999' }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#fdfdfd' }));
      // On click, execute button callback then destroy the dialog
      btn.on('pointerdown', () => {
        btnData.callback?.();
        this.destroy();
      });

      this.add(btn);
    });

    this.setSize(this.background.width, this.background.height);
    this.setInteractive({ draggable: true });
    this.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); });

    scene.add.existing(this);
  }
  
}
