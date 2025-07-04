/**
 * Object representation of a menu's option.
 */
export class OptionObject {
  /**
   * Object representation of a menu's option.
   * @param {string} label - Label of the option
   * @param {Function} callback - Callback triggered by clicking the option, nullable if the option has sub-options
   * @param {Array<OptionObject>} subOptions - Arrays of sub-options linked to the option. Default null.
   */
  constructor(label, callback = null, subOptions = null) {
    this.label = label;
    this.callback = callback;
    this.subOptions = subOptions;
  }
}

/**
 * Container object of a menu option.
 */
export class OptionContainer extends Phaser.GameObjects.Container {
  /**
   * Container object of a menu option.
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
    if (option.subOptions) {
      this.moreCue = scene.add.text(0, 0, '>', { color: '#000' }).setPadding(10).setOrigin(1, 0);
      this.add(this.moreCue);
    }
  }

  /**
   * Adjust container dimensions for interactivity and spawn submenu.
   * @param {number} width - Container width
   * @param {number} height - Container height
   */
  setupContainer(width, height) {
    // Resize background
    this.background.setSize(width, height);
    this.background.setDisplaySize(width, height);
    if (this.moreCue) Phaser.Display.Align.In.RightCenter(this.moreCue, this.background);
      
    // Setup interactivity
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
    this.addInteractions();
    
    // If there is, setup sub-options menu
    if (this.option.subOptions) {
      const bounds = this.getBounds();
      this.subMenu = new ContextMenu(this.scene, bounds.right, bounds.top, this.option.subOptions, this.parentMenu).setVisible(false);

      this.scene.add.existing(this.subMenu);
    }
  }

  /**
   * Add listeners and behavior to the container.
   */
  addInteractions() {
    this.on('pointerover', () => {
      this.background.setAlpha(0.5);
      //@ts-ignore
      this.scene.CONTEXTUAL_MANAGER.setHoveredOption(this);
    });

    this.on('pointerout', (pointer, position) => {
      this.background.setAlpha(0);
      //@ts-ignore
      this.scene.CONTEXTUAL_MANAGER.clearHoveredOption(pointer, position);   // CLEAR HOVERED
    });

    this.on('pointerdown', (pointer) => {
      // Execute option callback
      this.option.callback?.();
    })
  }
}

/**
 * Container object of a contextual menu.
 */
export class ContextMenu extends Phaser.GameObjects.Container {
  /**
   * Container object of a contextual menu.
   * @param {Phaser.Scene} scene - Parent scene
   * @param {number} x - Horizontal position within the scene
   * @param {number} y - Vertical position within the scene
   * @param {Array<OptionObject>} options - Array containing the menu's options
   * @param {ContextMenu} parentMenu - This parent menu if is a submenu, else null
   */
  constructor(scene, x, y, options, parentMenu = null) {
    super(scene, x, y);
    this.parentMenu = parentMenu;
    this.options = [];
    this.childrenMenus = [];

    // Store values for options position and menu dimensions
    let lastY = 0, lastHeight = 0, maxOptWidth = 0, maxOptHeight = 0;
    const optionContainers = [];

    for (const opt of options) {
      // Get y value
      const posY = lastY + lastHeight;

      // Create option object
      const option = new OptionContainer(scene, 0, posY, opt);
      this.options.push(option);
      this.add(option);

      optionContainers.push(option);
      
      // Update stored dimensions values
      let optionWidth = option.moreCue ? option.label.width + option.moreCue.width : option.label.width;
      lastHeight = option.background.height;
      lastY = option.y;
      maxOptWidth = Math.max(maxOptWidth, optionWidth + 30);
      maxOptHeight = Math.max(maxOptHeight, option.label.height);
    }

    for (const opt of optionContainers) {
      // Add option to the menu tree
      opt.parentMenu = this;
      // Add interactivity
      opt.setupContainer(maxOptWidth, maxOptHeight);
    }

    this.background = scene.add.rectangle(0, 0, maxOptWidth, lastY + lastHeight, 0xffffff)
      .setStrokeStyle(1, 0xbfbfbf).setAlpha(0.9)
      .setOrigin(0, 0);
    this.addAt(this.background);

    // @ts-ignore
    if(parentMenu) parentMenu.childrenMenus.push(this);

    // Add context menu to the scene
    scene.add.existing(this);
  }

  /**
   * Adjust the menu position if there not enough space to fit it fully inside the scene, or to hardest values.
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
    if (!y && bottomLimit > this.scene.scale.height) newPosY -= this.background.height; // REPARER DECALAGE QUAND PLUSIEURS OPTIONS

    // Get difference between original and updated position
    const transX = x ? x - this.x : newPosX - this.x;
    const transY = y ? y - this.y : newPosY - this.y;

    // Adjust self and submenus positions
    this.setPosition(x ?? newPosX, y ?? newPosY);
    if (this.childrenMenus.length) this.adjustChildrenPosition(transX, transY);
  }

  /**
   * Adjust submenus position according to parent new position.
   * @param {number} transX - Horizontal translation
   * @param {number} transY - Vertical translation
   */
  adjustChildrenPosition(transX, transY) {
    for (const child of this.childrenMenus) {
      child.setPosition(child.x + transX, child.y + transY);
      child.adjustSelfPosition();
    }
  }

  /**
   * Destroy self and all its submenus.
   */
  destroyMenuChain() {
    for (const elem of this.list) {
      if (elem instanceof OptionContainer && elem.subMenu) elem.subMenu.destroyMenuChain();
    }
    this.destroy();
  }

}
