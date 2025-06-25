import { Icon } from "./Icons.js";

class HeaderObject {
  /**
   * 
   * @param {?Icon} icon - 
   * @param {?string} title - 
   * @param {Array<{ texture : ?string, label : string, callback: () => void }>} buttons - 
   */
  constructor(icon = null, title = null, buttons = []) {
    this.icon = icon;
    this.title = title;
    this.buttons = buttons;
  }
}

/*
class FooterObject {
  constructor(icon = null, title = null, buttons = []) {
    this.icon = icon;
    this.title = title;
    this.buttons = buttons;
  }
}
*/

class WindowHeader extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - 
   * @param {number} width - 
   * @param {number} height - 
   * @param {?HeaderObject} content - 
   */
  constructor(scene, width, height = 30, content = null) {
    super(scene, 0, 0);
    this.icon = null;
    this.title = null;
    this.buttons = [];

    this.background = scene.add.rectangle(0, 0, width, height, 0xff55bb);
    this.add(this.background);

    if (content) {
      if (content.icon) {
        this.icon = content.icon;
        this.add(this.icon);
        Phaser.Display.Align.In.TopLeft(this.icon, this.background);
      }
      if (content.title) {
        this.title = scene.add.text(0, 0, content.title, { fontSize: '16px', color: '#000' }).setOrigin(0, 0.5);
        this.add(this.title);
        // this.title.setPosition()
      }
      if (content.buttons) {
        for (const elem of content.buttons) {
          const btn = new Phaser.GameObjects.Container(scene);
          if (elem.texture) {
            const icon = scene.add.image(0, 0, elem.texture).setScale(25);

            btn.add(icon)
          }
          // else const btn = scene.add.text(0, 0, elem.label);
        }
      }
    }
  }
}

class WindowFooter extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - 
   * @param {number} width - 
   * @param {number} height - 
   * @param {?HeaderObject} content - 
   */
  constructor(scene, width, height = 30, content = null) {
    super(scene, 0, 0);

    this.background = scene.add.rectangle(0, 0, width, height, 0xaa33cc);
    this.add(this.background);
  }
}

export class WindowObject extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, header = null, footer = null) {
    super(scene, x, y);
    this.dragParams = {
      difX : 0,
      difY : 0,
    }

    this.background = scene.add.rectangle(0, 0, width, height, 0xffffff).setStrokeStyle(2, 0x000000);

    // if (header)
    this.header = scene.add.rectangle(0, 0, width, 20, 0xff55bb).setOrigin(0.5, 0);
    this.footer = scene.add.rectangle(0, 0, width, 20, 0xaa33cc).setOrigin(0.5, 1);
    this.add([this.background, this.header, this.footer]);
    
    // Align header and footer
    Phaser.Display.Align.In.TopCenter(this.header, this.background);
    Phaser.Display.Align.In.BottomCenter(this.footer, this.background);

    // this.setSize(width, height);
    this.header.setSize(width, 20).setInteractive({ draggable: true });
    // this.header.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); });
    this.header.on('dragstart', (pointer) => {
      this.dragParams.difX = pointer.x - this.x;
      this.dragParams.difY = pointer.y - this.y;
    })
    this.header.on('drag', (pointer) => { this.setPosition(pointer.x - this.dragParams.difX, pointer.y - this.dragParams.difY); });

    scene.add.existing(this);
  }
}

export class DialogWindow extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene to add the dialog to
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {string | Array<string>} message - Message to display
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
    this.add([this.background, this.text]);

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
