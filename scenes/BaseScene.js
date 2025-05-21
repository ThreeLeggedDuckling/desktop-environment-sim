/**
* Base pour les scenes du jeu, comprend les fonctionnalités : toggle fullscreen, disable context menu.
*/
export class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }
  
  create() {
    this.firstClickTime = 0;  // variable pour double click
    
    this.input.mouse.disableContextMenu();  // désactive le comportement clic doit -> menu contextuel
    
    this.setupFullscreenToggle('SPACE', 'ESC');
    this.returnToMenu();
  }
  
  
  // Fonctions additionnelles
  
  /**
  * Permet de démarrer et d'arrêter l'affichage en plein écran.
  * @param {string} enterKey - Chaîne de caractères représentant la touche pour activer
  * @param {string} exitKey - Chaîne de caractères représentant la touche pour quitter
  */
  setupFullscreenToggle(enterKey, exitKey) {
    // activer plein écran
    this.input.keyboard?.addKey(enterKey).on('down', () => {
      if (!this.scale.isFullscreen) this.scale.startFullscreen();
    });
    
    // quitter plein écran
    this.input.keyboard?.addKey(exitKey).on('down', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
    });
  }

  /**
   * Permet de retourner au menu principal
   * @param {string} key - Chaîne de caractères représentant la touche à utiliser
   */
  returnToMenu(key = 'BACKSPACE') {
    this.input.keyboard?.addKey(key).on('down', () => { this.scene.start('MenuScene') })
  }
  
  /**
   * Détermine si un double click survient endéans un certain interval
   * @param {number} interval - Interval exprimé en milisecondes (par défaut 500ms)
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
