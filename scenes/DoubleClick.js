import { BaseScene } from './BaseScene.js';

export class DoubleClick extends BaseScene {
  constructor() {
    super({ key: 'DoubleClick' });
  }

  preload() {
		super.preload();
    this.load.image('ducky', 'assets/misc/ducky.png');
    this.load.image('duckyGS', 'assets/misc/duckyGS.png');
    }

  create() {
    super.create();

    const instructionsTxt = [
			'Faites deux cliques rapides successifs sur le canard pour lui rendre ses couleurs.',
    ]
    const instructionsStyle = {
      fontStyle: 'bold',
      fontSize: '40px',
      align: 'center',
      wordWrap: { width: 1000, useAdvancedWrap: true }
    }

    // Create instructions display
    const instructions = this.add.text(this.scale.width / 2, 100, instructionsTxt, instructionsStyle).setOrigin(0.5);

		// Creat visual help
    const visualCue = this.add.circle(this.scale.width / 2 - 200, this.scale.height / 2, 100, 0xffaa44).setAlpha(0.2);
    
    // Create visual help button
    const cueBtnTxt = [ 'Activer aide', 'Désactiver aide' ];
    const cueBtnStyle = {
      fontSize: '20px',
      backgroundColor: '#66d42a',
      align: 'center',
      wordWrap: { width: 120, useAdvancedWrap: true }
    }
    const cueBtn = this.add.text(this.scale.width / 2 - 200, this.scale.height / 2 + 150, cueBtnTxt[0]).setStyle(cueBtnStyle).setPadding(10).setOrigin().setInteractive().setState('0');
    
    let blinkInterval;

    // On click, if double click end game
    cueBtn.on('pointerdown', () => {
      // Update state
      // @ts-ignore
      cueBtn.setState((cueBtn.state + 1) % 2);
      const s = cueBtn.state;
      
      // Update appearance
      cueBtn.setText(s ? cueBtnTxt[s] : cueBtnTxt[s]);
      cueBtn.setStyle({ backgroundColor: s ? '#d42a2a' : '#66d42a' });

      // (De)Activate visual cue
      if (!s) clearInterval(blinkInterval);
      else {
        blinkInterval = setInterval(() => {
          visualCue.setAlpha(1);
          let blinkOff = setTimeout(() => { visualCue.setAlpha(0.2) }, 500);
        }, 4000);
      }
    })
    
    // Create duck
    const duck = this.add.image(this.scale.width / 2 + 200, this.scale.height / 2, 'duckyGS').setInteractive();

    // Set hover behavior
    duck.on('pointerdown', () => {
			if (!this.checkDoubleClick()) return;

      // Update appearances
			duck.setTexture('ducky');
      clearInterval(blinkInterval);
      visualCue.setFillStyle(0x545454);
      cueBtn.setStyle({ backgroundColor: '#545454' });

      // Remove interactions
			duck.removeInteractive();
      cueBtn.removeInteractive();

			// Add success message
			this.add.text(this.scale.width / 2, 1000, 'BRAVO', { fontStyle: 'bold', fontSize: '40px', color: '#9dec6c' }).setOrigin(0.5);
		});
		
  }

}
