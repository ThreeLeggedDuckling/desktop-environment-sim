export class BaseScene extends Phaser.Scene {
  /**
   * Base scene implementing needed functions for other scenes : preaload(), setupFullscreenToggle(), returnToMenu(), checkDoubleClick().
   */
  constructor(key) {
    super(key);
  }

  preload() {
    // Icons assets
    this.load.image('binEmpty', 'assets/icons/win_recyclebin_empty.png');
		this.load.image('binFull', 'assets/icons/win_recyclebin_full.png');
		this.load.image('folder', 'assets/icons/folder.png');
		this.load.image('picture', 'assets/icons/picture.png');
		this.load.image('winMenu', 'assets/icons/win_menu.png');
    
    // Placeholder icons
		this.load.image('pixelCatG', 'assets/placeholders/pixelCatGrey.png');
		this.load.image('pixelCatO', 'assets/placeholders/pixelCatOrange.png');
		this.load.image('pixelDuck', 'assets/placeholders/pixelDuck.png');

    // Picture files assets
		this.load.image('astronautJPG', 'assets/pictures/astronaut.jpg');
		this.load.image('chickenJPG', 'assets/pictures/chicken.jpg');
		this.load.image('flowersPNG', 'assets/pictures/flowers.png');
  }
  
  create() {
    // Store click occurence used in checkDoubleClick()
    this.firstClickTime = 0;
    
    // Disable browser right click behavior
    this.input.mouse.disableContextMenu();
    // Allow fullscreen toggle
    this.setupFullscreenToggle('SPACE', 'ESC');
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
    this.input.keyboard?.addKey(key).on('down', () => { this.scene.start('MenuScene') })
  }
  
  /**
   * Detect if two clicks occure within a given interval
   * @param {number} interval - Time in milliseconds. Default set to 500ms.
   * @returns 
   */
  checkDoubleClick(interval = 500) {
    let isDouble = false;
    
    if (this.firstClickTime === 0) {
      this.firstClickTime = Date.now();
      return isDouble;
    }
    
    let delay = Date.now() - this.firstClickTime;
    if (delay < interval) isDouble = true;
    this.firstClickTime = 0
    return isDouble;
  }
  
}
