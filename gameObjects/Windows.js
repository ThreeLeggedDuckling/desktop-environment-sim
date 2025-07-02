import { DEFAULT_FILETYPES, FileObject } from "./Files.js";
import { Icon } from "./Icons.js";

/**
 * Enum for control buttons to skip on window creation.
 */
export const IGNORE_CTRL_BTN = Object.freeze({
  NONE : 0,
  MINIMIZE_RESIZE : 1,
  ALL : 2,
});

/**
 * Container object of a window control button.
 */
class ControlButton extends Phaser.GameObjects.Container {
  /**
   * Container object of a window control button.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {number} headerHeight - Height of the header, used to set background size
   * @param {number} contentHeight - The button's icon dimensions
   * @param {string | Array<string>} texture - Key of the image used as icon
   * @param {string | Array<string>} label - Text to display on hover, describe button function
   * @param {() => void | Array<() => void>} callback - Function called by the button
   * @param {boolean} windowIsMaximized - If the parent window is maximized, default false
   */
  constructor(scene, headerHeight, contentHeight, texture, label, callback, windowIsMaximized = false) {
    super(scene)
    
    this.textureKeys = Array.isArray(texture) ? texture : [texture, texture];
    this.labelKeys = Array.isArray(label) ? label : [label, label];
    this.callbackKeys = Array.isArray(callback) ? callback : [callback, callback];

    const activeTexture = windowIsMaximized ? this.textureKeys[1] : this.textureKeys[0];
    const activeLabel = windowIsMaximized ? this.labelKeys[1] : this.labelKeys[0];
    const activeCallback = windowIsMaximized ? this.callbackKeys[1] : this.callbackKeys[0];

    this.background = scene.add.rectangle(0, 0, headerHeight, headerHeight, 0xc7c7c7).setAlpha(0);
    this.icon = scene.add.image(0, 0, activeTexture).setDisplaySize(contentHeight, contentHeight);
    this.label = scene.add.text(0, 0, activeLabel, { fontSize: '15px', color: '#000000', backgroundColor: '#ffffff' }).setPadding(3);
    this.label.setOrigin(0).setVisible(false);
    this.add([this.background, this.icon, this.label]);
    
    // Add behavior
    this.setSize(headerHeight, headerHeight).setInteractive();
    this.on('pointerover', (pointer) => {
      this.background.setAlpha(0.8);
      this.scene.time.delayedCall(500, () => {
        if (Phaser.Geom.Rectangle.Contains(this.background.getBounds(), pointer.x, pointer.y)) {
          const local = this.getWorldTransformMatrix().applyInverse(pointer.x, pointer.y);
          this.label.setPosition(local.x + 15, local.y + 15).setVisible(true);
        }
      })
    });
    this.on('pointerout', () => {
      this.background.setAlpha(0);
      this.label.setVisible(false);
    });
    this.on('pointerdown', activeCallback);

    scene.add.existing(this);
  }

  /**
   * Update the button's icon, label and callback
   * @param {boolean} windowIsMaximized - If the parent window is maximized
   */
  updateActiveData(windowIsMaximized) {
    const activeTexture = windowIsMaximized ? this.textureKeys[1] : this.textureKeys[0];
    const activeLabel = windowIsMaximized ? this.labelKeys[1] : this.labelKeys[0];
    const activeCallback = windowIsMaximized ? this.callbackKeys[1] : this.callbackKeys[0];

    this.icon.setTexture(activeTexture);
    this.label.setText(activeLabel);
    this.off('pointerdown', this.callbackKeys[windowIsMaximized ? 0 : 1]);
    this.on('pointerdown', activeCallback);
  }

}

/**
 * Container object of a window header.
 */
class WindowHeader extends Phaser.GameObjects.Container {
  /**
   * Container object to create window header.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {WindowObject} parentWindow - Parent window
   * @param {string} title - Custom window title, optional
   * @param {0|1|2} ignoreCtrl - Control buttons to skip (none, minimize and maximize, all)
   */
  constructor(scene, parentWindow, title = null, ignoreCtrl = 0) {
    super(scene);
    this.icon = null;
    this.callbackTarget = parentWindow;
    this.height = 30

    const contentHeight = 24;
    this.setSize(parentWindow.unmaximized.width, this.height);

    // Create header background
    // this.background = scene.add.rectangle(0, 0, parentWindow.unmaximized.width, this.height, 0xf5f5f5).setStrokeStyle(1, 0xededed);
    this.background = scene.add.rectangle(0, 0, parentWindow.unmaximized.width, this.height, 0xaadd44).setStrokeStyle(1, 0xededed);
    this.add(this.background);

    // If not a SYSTEM file, create the window icon based ont the filetype
    if (parentWindow.file.fileType !== DEFAULT_FILETYPES.SYSTEM) {
      this.icon = new Icon(scene, 0, 0, this.callbackTarget.file, contentHeight);
      this.icon.setSize(this.icon.background.width, this.icon.background.height);
      this.add(this.icon);
      Phaser.Display.Align.In.LeftCenter(this.icon, this.background);
    }

    // Create the window title, use the file name if no title passed as parameter
    this.title = scene.add.text(0, 0, title ?? (this.callbackTarget.file.name + this.callbackTarget.file.fileType.extension), { fontSize: '16px', color: '#000' }).setOrigin(0, 0.5);
    this.add(this.title);
    Phaser.Display.Align.In.LeftCenter(this.title, this.background, - this.icon?.width - 10);

    // Create control buttons
    if (ignoreCtrl < IGNORE_CTRL_BTN.ALL) {
      this.btnContainer = new Phaser.GameObjects.Container(scene);

      // If no button skipped, add minimize, maximize/restore buttons
      if (!ignoreCtrl) {
        const minimBtn = new ControlButton(scene, this.height, contentHeight, 'minimize', 'Minimiser', () => { this.minimizeWindow(this.callbackTarget) });
        //@ts-ignore
        const maximBtn = new ControlButton(scene, this.height, contentHeight, ['maximize', 'restore'], ['Maximiser', 'Restaurer'], [() => { this.maximizeWindow(this.callbackTarget); }, () => { this.restoreWindow(this.callbackTarget); }]);
        this.btnContainer.add([minimBtn, maximBtn]);
      }
      
      // Add close button
      const closeBtn = new ControlButton(scene, this.height, contentHeight, 'close', 'Fermer', () => { this.closeWindow(this.callbackTarget) });
      closeBtn.background.fillColor = 0xff0000;
      this.btnContainer.add(closeBtn);

      // Align buttons in a row
      Phaser.Actions.AlignTo(this.btnContainer.list, Phaser.Display.Align.RIGHT_CENTER);

      // Adjust buttons container and setup drag
      this.btnContainer.setSize(this.height * this.btnContainer.list.length, this.height);
      Phaser.Display.Align.In.RightCenter(this.btnContainer, this.background, - (this.btnContainer.width / 2 - 15));

      this.add(this.btnContainer);
    }

    scene.add.existing(this);
  }

  /**
   * Hide a open window, reducing it to an indicator on it's taskbar icon
   * @param {WindowObject} target - The targeted window
   */
  minimizeWindow(target) {// AJOUTER REPRESENTATION ICONE TASKBAR
    target.setVisible(false);
  }

  /**
   * Set the window size and position to fit the screen
   * @param {WindowObject} target - The targeted window
   */
  maximizeWindow(target) {
    const fullWidth = this.scene.scale.width;
    const fullHeight = this.scene.scale.height - 50;
    target.resize(fullWidth / 2, fullHeight / 2, fullWidth, fullHeight);
    target.setMaximized(true);
  }

  /**
   * Reset targeted window to it's previous size and position after being maximized.
   * @param {WindowObject} target - The targeted window
   */
  restoreWindow(target) {
    const tu = target.unmaximized;
    target.resize(tu.x, tu.y, tu.width, tu.height);
    target.setMaximized(false);
  }

  /**
   * Destroy targeted window
   * @param {WindowObject} target - The targeted window
   */
  closeWindow(target) {
    // @ts-ignore
    const i = this.scene.openWindows.indexOf(target);
    // @ts-ignore
    this.scene.openWindows.splice(i, 1);
    target.destroy();
  }

}

/**
 * Container object of a window footer.
 */
class WindowFooter extends Phaser.GameObjects.Container {
  /**
   * Container object of a window footer.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {WindowObject} parentWindow - Parent window
   */
  constructor(scene, parentWindow) {
    super(scene);
    this.height = 20;

    const contentHeight = 18;

    // Create header background
    // this.background = scene.add.rectangle(0, 0, parentWindow.unmaximized.width, this.height, 0xf5f5f5).setStrokeStyle(1, 0xededed);
    this.background = scene.add.rectangle(0, 0, parentWindow.unmaximized.width, this.height, 0xaadd44).setStrokeStyle(1, 0xededed);
    this.add(this.background);

    scene.add.existing(this);
  }
}

class FolderNavigation extends Phaser.GameObjects.Container {
  constructor(scene, parentWindow, ) {
    super(scene)
  }
}
class FolderSidePanel extends Phaser.GameObjects.Container {

}
class FolderContent extends Phaser.GameObjects.Container {

}

/**
 * Container object of a window.
 */
export class WindowObject extends Phaser.GameObjects.Container {
  /**
   * Container object of a window.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {number} width - Width of the window
   * @param {number} height - Height of the window
   * @param {FileObject} file - File associated to the window
   * @param {Object} header - Properties of the window hearder, default null
   * @param {boolean} header.isDefault - Is the default header
   * @param {0 | 1 | 2} header.ignoreCtrl - Control buttons skipped
   * @param {Array<string>} header.inactiveCtrl - Control buttons rendered inactive
   * @param {string} header.title - Header title
   * @param {Object} footer - Properties of the window footer
   * @param {boolean} footer.isDefault - Is the default footer
   * @param {Object} footer.content - The footer content
   * @param {boolean} isMaximized - If the window is maximized, default false
   */
  constructor(scene, x, y, width, height, file, header = null, footer = null, isMaximized = false) {
    super(scene, x, y);

    this.file = file;
    this.isMaximized = isMaximized;
    this.unmaximized = { x: x, y: y, width: width, height: height };
    this.dragParams = { difX : 0, difY : 0, };
    
    // Create background
    this.background = scene.add.rectangle(0, 0, width, height, 0xffffff).setStrokeStyle(1, 0xededed);
    this.add(this.background);

    // Create header
    if (header) {
      if (header.isDefault) this.header = new WindowHeader(scene, this, null);
      else this.header = new WindowHeader(scene, this, header.title, header.ignoreCtrl);

      // Remove interactivity for specified control buttons
      if (header.inactiveCtrl) {
        for (const key of header.inactiveCtrl) {
          //@ts-ignore
          const btn =  this.header.btnContainer.list.find(btn => btn.textureKeys[0] === key);
          btn?.removeInteractive();
          btn?.icon.setTint();
        }
      }
      this.add(this.header);
      Phaser.Display.Align.In.TopCenter(this.header, this.background);
      
      // Add drag behavior to header
      this.header.setInteractive({ draggable: true });
      this.header.on('dragstart', (pointer) => {
        this.dragParams.difX = pointer.x - this.x;
        this.dragParams.difY = pointer.y - this.y;
      })
      this.header.on('drag', (pointer) => {
        if (!this.isMaximized) this.setPosition(pointer.x - this.dragParams.difX, pointer.y - this.dragParams.difY);
      });
      this.header.on('dragend', (pointer) => {
        this.unmaximized.x = this.x;
        this.unmaximized.y = this.y;
      });
    }

    // Create footer
    if (footer) {
      this.footer = new WindowFooter(scene, this);
      this.add(this.footer);
      Phaser.Display.Align.In.BottomCenter(this.footer, this.background);
    }

    //debug
    console.log("fenêtre", this);
    
    // Create content container
    this.bodyPadding = (this.header || this.footer) ? 10 : 20
    const bodyY = this.header ? this.bodyPadding / 2 : 0;
    const bodyHeight = height - this.bodyPadding - (this.header?.height ?? 0) - (this.footer?.height ?? 0);
    
    this.bodyContainer = new Phaser.GameObjects.Container(scene, 0, bodyY).setSize(width - this.bodyPadding, bodyHeight);
    //debug
    this.bodyContainer.add(scene.add.rectangle(0, 0, width - this.bodyPadding, bodyHeight).setStrokeStyle(1, 0xff0000));

    switch (file.fileType.type) {   // CASE LEFT TO IMPLEMENT : 'app', 'system', 'text'
      case 'folder' :
        this.navigationContainer = new Phaser.GameObjects.Container(scene).setSize(this.width, this.header.height);

        this.navigation = new FolderNavigation(scene, this);
        this.sidePanel = new FolderNavigation(scene);
        this.folderContent = new FolderNavigation(scene);

        this.add([this.navigation, this.sidePanel, this.folderContent]);


        break;
        
      case 'image' :
        break;
          
      case 'pdf' :
        break;
        
      // For other types not implemented
      // Create false window explaining purpose of window for that type of file
      default:
        // this.bodyContainer.add()
    }

    this.add(this.bodyContainer);


    // Add window resizability
    this.resizeHandles = {
      // left: scene.add.rectangle(- width / 2, 0, 10, height, 0x000000, 0).setOrigin(0.5),
      right: scene.add.rectangle(width / 2, 0, 10, height, 0x000000, 0).setOrigin(0.5),
      // top: scene.add.rectangle(0, - height / 2, 10, height, 0x000000, 0).setOrigin(0.5),
      // bottom: scene.add.rectangle(0, height / 2, 10, height, 0x000000, 0).setOrigin(0.5),
    }
    for (const handle in this.resizeHandles) {
      // console.log(handle.);
      // this.add(handler);
      // handler.
    }

    // @ts-ignore
    if (!scene.openWindows) scene.openWindows = [];
    // @ts-ignore
    scene.openWindows.push(this);

    scene.add.existing(this);
  }

  resize(x, y, width, height) {
    // Adjust window
    this.setPosition(x, y);
    this.background.setSize(width, height);
    // this.background.setDisplaySize(width, height);
    
    // Adjust header
    if (this.header) {
      this.header.background.setSize(width, 30);
      // this.header.background.setDisplaySize(width, 30);
      Phaser.Display.Align.In.TopCenter(this.header, this.background);
      Phaser.Display.Align.In.LeftCenter(this.header.icon, this.header.background);
      Phaser.Display.Align.In.LeftCenter(this.header.title, this.header.background, - this.header.icon.width - 10);
      if (this.header.btnContainer) {
        Phaser.Display.Align.In.RightCenter(this.header.btnContainer, this.header.background, - (this.header.btnContainer.width / 2 - 15));
      }
    }
    
    // Adjust footer
    if (this.footer) {
      this.footer.background.setSize(width, 20);
      // this.footer.background.setDisplaySize(width, 20);  
      Phaser.Display.Align.In.BottomCenter(this.footer, this.background);
    }
    
    // Adjust content
    const bodyHeight = height - this.bodyPadding - (this.header?.height ?? 0) - (this.footer?.height ?? 0);
    this.bodyContainer.setSize(width - this.bodyPadding, bodyHeight);
  }

  setMaximized(bool) {
    this.isMaximized = bool;
    if (this.header) {
      for (const btn of this.header.btnContainer.list) {
        // @ts-ignore
        btn.updateActiveData(bool);
      }
    }
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
  // constructor(scene, x, y, width, height, file, hasHeader = true, hasFooter = true, isMaximized = false)
  constructor(scene, x, y, width, message, xAxisButtons = false, buttons = [{ label: 'OK', callback: () => {} }]) {
    super(scene, x, y);

    this.dragParams = { difX : 0, difY : 0, };

    // Create background and text
    this.background = scene.add.rectangle(0, 0, width, 300, 0xffffff).setStrokeStyle(1, 0xededed);
    this.text = scene.add.text(0, -70, message, { fontSize: '16px', color: '#000', wordWrap: { width: 460 } }).setOrigin(0.5);
    this.add([this.background, this.text]);

    // Create buttons
    this.btnContainer = new Phaser.GameObjects.Container(scene);
    const btnStyle = {
      fontSize: '14px',
      backgroundColor: '#fdfdfd',
      color: '#000',
      padding: { x: 10, y: 5 },
    }

    for (const btnData of buttons) {
      const btn = scene.add.text(0, 0, btnData.label, btnStyle).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#999' }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#fdfdfd' }));

      // On click, execute button callback then destroy the dialog
      btn.on('pointerdown', () => {
        btnData.callback?.();
        this.destroy();
      });

      this.btnContainer.add(btn);
    }

    Phaser.Actions.AlignTo(this.btnContainer.list, Phaser.Display.Align.RIGHT_CENTER);

    this.add(this.btnContainer);

    // // (??)
    // const buttonY = 40;
    // const spacing = 300 / buttons.length;
    
    // // Create and add the button components
    // buttons.forEach((btnData, i) => {
    //   // Create the button component
    //   const btn = scene.add.text((i - (buttons.length - 1) / 2) * spacing, buttonY, btnData.label, {
    //     fontSize: '14px',
    //     backgroundColor: '#fdfdfd',
    //     color: '#000',
    //     padding: { x: 10, y: 5 },
    //   }).setOrigin(0.5);

    //   btn.setInteractive({ useHandCursor: true });
    //   btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#999' }));
    //   btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#fdfdfd' }));
    //   // On click, execute button callback then destroy the dialog
    //   btn.on('pointerdown', () => {
    //     btnData.callback?.();
    //     this.destroy();
    //   });

    //   this.add(btn);
    // });

    this.setSize(this.background.width, this.background.height);
    this.setInteractive({ draggable: true });
    this.on('drag', (pointer, dragX, dragY) => { this.setPosition(dragX, dragY); });

    scene.add.existing(this);
  }
  
}
