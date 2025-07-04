/**
 * Base scene implementing needed functions for other scenes : preaload(), setupFullscreenToggle(), returnToMenu(), checkDoubleClick().
 */
export class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    // Icons assets
    this.load.image('binEmpty', 'assets/icons/win_recyclebin_empty.png');
		this.load.image('binFull', 'assets/icons/win_recyclebin_full.png');
		this.load.image('close', 'assets/icons/closeWindow.png');
		this.load.image('folder', 'assets/icons/folder.png');
		this.load.image('picture', 'assets/icons/picture.png');
		this.load.image('maximize', 'assets/icons/maximizeWindow.png');
		this.load.image('minimize', 'assets/icons/minimizeWindow.png');
		this.load.image('restore', 'assets/icons/restoreWindow.png');
		this.load.image('winMenu', 'assets/icons/win_menu.png');
    
    // Misc
		this.load.image('astronautJPG', 'assets/pictures/astronaut.jpg');
		this.load.image('chickenJPG', 'assets/pictures/chicken.jpg');
    this.load.image('desktopBg', 'assets/pictures/leafs.jpg');
    this.load.image('ducky', 'assets/misc/ducky.png');
    this.load.image('duckyGS', 'assets/misc/duckyGS.png');
		this.load.image('flowersPNG', 'assets/pictures/flowers.png');
    this.load.image('returnArrow', 'assets/misc/returnArrowWhite.png');
    
    // Placeholder icons
    this.load.image('pixelCatG', 'assets/placeholders/pixelCatGrey.png');
    this.load.image('pixelCatO', 'assets/placeholders/pixelCatOrange.png');
    this.load.image('pixelDuck', 'assets/placeholders/pixelDuck.png');
  }
  
  create() {
    // Store click occurence used in checkDoubleClick()
    this.firstClickTime = null;
    
    // Disable browser right click behavior
    this.input.mouse.disableContextMenu();
    // Allow fullscreen toggle
    this.setupFullscreenToggle('SPACE', 'ESC');

    // DEV NEEDS
    // Allow keyboard shortcut to go to main menu scene
    this.returnToMainMenu();
    
  }
  
  /**
   * Enter and exit fullscreen mode.
   * @param {string} enterKey - Key to enter fullscreen
   * @param {string} exitKey - Key to exit fullscreen
  */
  setupFullscreenToggle(enterKey, exitKey) {
    // Enter mode
    this.input.keyboard?.addKey(enterKey).on('down', () => {
      if (!this.scale.isFullscreen) this.scale.startFullscreen();
    });
    
    // Exit mode
    this.input.keyboard?.addKey(exitKey).on('down', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
    });
  }

  /**
   * Allow quick navigation to main menu scene
   * @param {string} key
   */
  returnToMainMenu(key = 'BACKSPACE') {
    this.input.keyboard?.addKey(key).on('down', () => { this.scene.start('MainMenu') })
  }
  
  /**
   * Detect if two clicks occure within a given interval
   * @param {number} interval - Time in milliseconds. Default set to 500ms.
   * @returns {boolean}
   */
  checkDoubleClick(interval = 500) {
    if (!this.firstClickTime) {
      this.firstClickTime = Date.now();
      return false;
    }
    
    if (Date.now() - this.firstClickTime >= interval) {
      this.firstClickTime = Date.now();
      return false;
    }
    
    this.firstClickTime = null;
    return true;
  }
  
}
