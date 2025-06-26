import { HOVERMANAGER } from "../handlers/HoverManager.js";
import { MenuManager, MENUMANAGER } from "../handlers/MenuManager.js"

export class OptionObject {
  /**
   * Object representation of a menu's option
   * @param {string} label - Label of the option
   * @param {Function | null} callback - Callback triggered by clicking the option, nullable if the option has sub-options
   * @param {Array<OptionObject> | null} subOptions - Arrays of sub-options linked to the option. Default null.
   */
  constructor(label, callback, subOptions = null) {
    this.label = label;
    this.callback = callback;
    this.subOptions = subOptions;
  }
}

export class OptionContainer extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Parent scene
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {OptionObject} option - Option data
   */
  constructor(scene, x, y, option) {
    super(scene, x, y);
    this.option = option;
    this.parentMenu = null;
    this.subMenu = null;

    // Create components
    this.label = scene.add.text(0, 0, option.label, { color: '#000' }).setPadding(10).setOrigin(0, 0);
    this.background = scene.add.rectangle(0, 0, 100, this.label.height, 0x9dec6c).setAlpha(0).setOrigin(0, 0);
    this.add([this.label, this.background]);
  }

  setupInteractive(width, height) {
    // Resize background
    this.background.setDisplaySize(width, height);
      
    // Setup interactivity
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
    this.addInteractions();
    
    // If there is, setup sub-options menu
    if (this.option.subOptions) {
      //debug
      console.log('... create submenu ...');

      const bounds = this.getBounds();
      this.subMenu = new ContextMenu(this.scene, bounds.right, bounds.top, this.option.subOptions, this.parentMenu).setVisible(false);
      // this.subMenu = new ContextMenu(this.scene, bounds.right, bounds.top, this.option.subOptions, this.parentMenu);
      //debug
      console.log('> submenu', this.subMenu);

      this.scene.add.existing(this.subMenu);
    }
  }

  addInteractions() {
    this.on('pointerover', () => {
      this.background.setAlpha(0.5);
      HOVERMANAGER.setHoveredOption(this);

      // On hover, display sub menu if present
      this.subMenu?.setVisible(true);
    });

    this.on('pointerout', (pointer) => {
      this.background.setAlpha(0);
      HOVERMANAGER.clearHoveredOption(this);
    });

    this.on('pointerdown', () => {
      this.option.callback?.();
      
      let menu = this.parentMenu;
      while (menu?.parentMenu) {
        menu = menu.parentMenu;
      }

      //debug
      console.log('MOVE TO PARENT DESTROY');
      menu.destroyMenuChain();
    })
  }
}

export class ContextMenu extends Phaser.GameObjects.Container {
  /**
   * 
   * @param {Phaser.Scene} scene - Parent scene
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {Array<OptionObject>} options - Array containing the menu's options
   * @param {ContextMenu} parentMenu - This parent menu if is a submenu, else null
   */
  constructor(scene, x, y, options, parentMenu = null) {
    super(scene, x, y);
    HOVERMANAGER.init(scene);
    this.parentMenu = parentMenu;
    this.childrenMenus = [];

    // Store values for options position and menu dimensions
    let lastY = 0, lastHeight = 0, maxOptWidth = 0, maxOptHeight = 0;
    const optionContainers = [];

    for (const opt of options) {
      // Get y value
      const posY = lastY + lastHeight;

      // Create option object
      const option = new OptionContainer(scene, 0, posY, opt);
      this.add(option);
      optionContainers.push(option);
      
      // Update stored dimensions values
      lastHeight = option.background.height;
      lastY = option.y;
      maxOptWidth = Math.max(maxOptWidth, option.label.width);
      maxOptHeight = Math.max(maxOptHeight, option.label.height);
    }

    for (const opt of optionContainers) {
      // Add option to the menu tree
      opt.parentMenu = this;
      // Add interactivity
      opt.setupInteractive(maxOptWidth, maxOptHeight);
    }

    this.background = scene.add.rectangle(0, 0, maxOptWidth, lastY + lastHeight, 0xffffff).setAlpha(0.8).setOrigin(0, 0);
    this.addAt(this.background);

    // @ts-ignore
    if(parentMenu) parentMenu.childrenMenus.push(this);

    // Add context menu to the scene
    scene.add.existing(this);
  }

  /**
   * Adjust the menu position if there not enough space to fit it fully inside the scene
   * @param {number} x - Hardset horizontal position
   * @param {number} y - Hardset vertical position
   */
  adjustSelfPosition(x = null, y = null) {
    // Get menu dimensions
    const rightLimit = this.x + this.background.width + 20;
    const bottomLimit = this.y + this.background.height + 10;

    // Get updated x and y
    let newPosX = this.x, newPosY = this.y;
    if (!x && rightLimit > this.scene.scale.width) newPosX -= this.background.width + (this.parentMenu ? this.parentMenu.background.width : 0);
    // REPARER DECALAGE QUAND PLUSIEURS OPTIONS
    if (!y && bottomLimit > this.scene.scale.height) newPosY -= this.background.height;

    // Get difference between original and updated position
    const transX = x ? x - this.x : newPosX - this.x;
    const transY = y ? y - this.y : newPosY - this.y;

    //debug
    console.log('_____');
    console.log('parent hardset', { x: x, y: y });
    console.log('parent ogPos', { x: this.x, y: this.y });
    console.log('parent translate values', { x: transX, y: transY});

    // Adjust position
    this.setPosition(x ?? newPosX, y ?? newPosY);

    // Adjust submenus position
    if (this.childrenMenus.length) this.adjustChildrenPosition(transX, transY);
  }

  /**
   * Adjust submenus position
   * @param {number} transX - Horizontal translation
   * @param {number} transY - Vertical translation
   */
  adjustChildrenPosition(transX, transY) {
    for (const child of this.childrenMenus) {
      //debug
      const ogPos = { x: child.x, y: child.y };
      const upPos = { x: child.x + transX, y: child.y + transY};
      console.log('child ogPos', ogPos);
      console.log('child upPos', upPos);

      child.setPosition(child.x + transX, child.y + transY);
      child.adjustSelfPosition();
    }
  }

  destroyMenuChain() {
    //debug
    console.log('destroyMenuChain');

    for (const elem of this.list) {
      if (elem instanceof OptionContainer && elem.subMenu) elem.subMenu.destroyMenuChain();
    }
    this.destroy();
  }

}
