import { BaseScene } from './BaseScene.js';
import { SceneReturnBtn } from '../gameObjects/Buttons.js';

export class DoubleClick extends BaseScene {
  constructor() {
    super({ key: 'DoubleClick' });
  }

  create() {
    super.create();

    // Blinking event data
    this.blinkIntervals = { count: 0, limit: 4 };
    this.blinkEvent = new Phaser.Time.TimerEvent({
			callback: this.blink,
			callbackScope: this,
			delay: 500,
			loop: true
		});

    // Creat visual help
    this.visualCue = this.add.circle(700, 440, 75, 0xffaa44).setAlpha(0.2);

    // Create visual help button
    const cueBtnData = {
      text: [ 'Activer aide', 'Désactiver aide' ],
      style: {
        fontSize: '20px',
        backgroundColor: '#d42a2a',
        align: 'center',
        wordWrap: { width: 120, useAdvancedWrap: true }
      }
    }
    this.cueBtn = this.add.text(700, 570, cueBtnData.text[0]).setStyle(cueBtnData.style).setPadding(15, 10)
      .setAlpha(0.7).setOrigin().setState(0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => { this.cueBtn.setAlpha(1) })
      .on('pointerout', () => { this.cueBtn.setAlpha(this.cueBtn.state ? 1 : 0.5) })
      .on('pointerdown', () => {
        // Update button state
        this.cueBtn.setState((this.cueBtn.state + 1) % 2);
        const s = this.cueBtn.state ? true : false;

        // Update button appearance
        this.cueBtn
          .setText(s ? cueBtnData.text[1] : cueBtnData.text[0])
          .setStyle({ backgroundColor: s ? '#66d42a' : '#d42a2a' });

        // (De)Activate blinkEvent
        this.activateVisualCue(s);
      });

    // Create duck
    this.duck = this.add.image(1200, 460, 'duckyGS').setScale(1.3)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (!this.checkDoubleClick()) return;

        this.activateVisualCue(false);
        this.endExo();
		  });

    // Display instructions
    const exoData = {
      text: [
        'Faites deux clics rapides successifs sur le canard pour lui rendre ses couleurs.',
      ],
      style: {
        fontStyle: 'bold',
        fontSize: '40px',
        align: 'center',
        wordWrap: { width: 1000, useAdvancedWrap: true }
      }
    }
    const instructionDisplay = this.add.text(960, 100, exoData.text, exoData.style).setOrigin(0.5);

    // Add navigation return button
    const returnBtn = new SceneReturnBtn(this, 'ExercicesMenu', 'Menu exercices').setPosition(200, 200);

  }

  /**
   * (De)Activate interactivity for cue button and duck.
   * @param {boolean} bool 
   */
  activateInteractions(bool) {
    if (bool) {
      this.duck.setInteractive().setTexture('duckyGS');
      this.cueBtn.setInteractive().setStyle({ backgroundColor: '#d42a2a' });
      this.visualCue.setFillStyle(0xffaa44);
    }
    else {
      this.duck.disableInteractive(true);
      this.cueBtn.disableInteractive().setStyle({ backgroundColor: '#545454' });
      this.visualCue.setFillStyle(0x545454);
    }
  }

  /**
   * (De)Active visual cue.
   * @param {boolean} bool
   */
  activateVisualCue(bool) {
    if (bool) this.time.addEvent(this.blinkEvent);
    else {
      this.time.removeEvent(this.blinkEvent);
      // Reset blinking data and visual cue appearance
      this.blinkIntervals.count = 0;
      this.visualCue.setAlpha(0.2);
    }
  }

  /**
   * Create visual cue blinking effect.
   */
  blink() {
    this.blinkIntervals.count++;
    
    if (this.blinkIntervals.count % (this.blinkIntervals.limit + 1) === 1) this.visualCue.setAlpha(1);
    else this.visualCue.setAlpha(0.2);
  }

  /**
   * End of exercice display.
   */
  endExo() {
    // Update display
    this.duck.setTexture('ducky');
    this.activateInteractions(false)

    // Add success message
    const endMsgStyle = { fontStyle: 'bold', fontSize: '40px', align: 'center' };
    const gg = this.add.text(960, 800, 'BRAVO!', endMsgStyle).setOrigin(0.5);
    const tryAgain = this.add.text(960, 880, 'Encore une fois ?', endMsgStyle).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => { tryAgain.setStyle({ color: '#f0c419' }) })
      .on('pointerout', () => { tryAgain.setStyle({ color: '#ffffff' }) })
      .on('pointerdown', () => {
        this.activateInteractions(true);
        gg.destroy();
        tryAgain.removeInteractive().destroy();
      })

    
  }

}
