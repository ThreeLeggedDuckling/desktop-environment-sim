/**
 * Base pour les scenes du jeu, comprend les fonctionnalités : toggle fullscreen, disable context menu.
 */
export class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  create() {
    this.setupFullscreenToggle('SPACE', 'ESC');   // permet l'affichage en mode plein écran
    this.input.mouse.disableContextMenu();    // désactive le comportement clic doit -> menu contextuel
  }

  /**
   * Permet de démarrer et d'arrêter l'affichage en plein écran.
   * @param {string} enterKey - Chaîne de cractères représentant la touche pour activer
   * @param {string} exitKey - Chaîne de cractères représentant la touche pour quitter
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
}