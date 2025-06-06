/**
 * Base scene implementing needed functions for other scenes :
 * - preaload()
 * - setupFullscreenToggle()
 * - returnToMenu()
 * - checkDoubleClick()
 */
export class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    // Icons assets
    this.load.image('binEmpty', 'assets/icons/recyclebin_empty.png');
		this.load.image('binFull', 'assets/icons/recyclebin_full.png');
		this.load.image('catG', 'assets/icons/pixelCatGrey.png');
		this.load.image('catO', 'assets/icons/pixelCatOrange.png');
		this.load.image('ducky', 'assets/icons/pixelDuck.png');
		this.load.image('folder', 'assets/icons/folder.png');
		this.load.image('picture', 'assets/icons/picture.png');

    // Misc assets
		this.load.image('astronautJPG', 'assets/misc/astronaut.jpg');
		this.load.image('chickenJPG', 'assets/misc/chicken.jpg');
		this.load.image('flowersPNG', 'assets/misc/flowers.png');
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
