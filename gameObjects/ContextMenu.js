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
    this.label = scene.add.text(0, 0, option.label).setPadding(10).setOrigin(0, 0);
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
      const bounds = this.getBounds();
      this.subMenu = new ContextMenu(this.scene, bounds.right, bounds.top, this.option.subOptions, this.parentMenu || this.parentContainer).setVisible(false);
      // this.subMenu = new ContextMenu(this.scene, width, 0, this.option.subOptions, this).setVisible(false);
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
      // let menubefore = this.parentMenu;

      // console.log('menu before');
      // console.log(menu);

      while (menu?.parentMenu) {
        menu = menu.parentMenu;
      }

      // console.log('menu after');
      // console.log(menu);
      // console.log('before = after', menubefore === menu);
      // console.log('menu is menu', menu instanceof ContextMenu);

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

    // Add interactivity to options
    for (const opt of optionContainers) {
      opt.parentMenu = this;
      opt.setupInteractive(maxOptWidth, maxOptHeight);
    }

    this.background = scene.add.rectangle(0, 0, maxOptWidth, lastY + lastHeight, 0xffffff).setAlpha(0.3).setOrigin(0, 0);
    this.addAt(this.background);

    // Add to MenuManager
    // MENUMANAGER.register(this);

    // Add context menu to the scene
    scene.add.existing(this);
  }

  destroyMenuChain() {
    console.log('destroyMenuChain');
    for (const elem of this.list) {
      if (elem instanceof OptionContainer && elem.subMenu) elem.subMenu.destroyMenuChain();
    }
    
    // MENUMANAGER.unregister(this);
    this.destroy();
  }

  getMenuChain() {
    // @ts-ignore
		return [this, ...this.childrenMenus.flatMap(m => m.getMenuChain())];
	}

}
