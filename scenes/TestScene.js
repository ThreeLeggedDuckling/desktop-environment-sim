import { BaseScene } from "./BaseScene.js";

/**
 * Classe de test uniquement utile au développement
 */
export class TestScene extends BaseScene {
	constructor() {
		super({ key: 'TestScene' });
	}

	preload() {
		this.load.image('ducky', 'assets/ducky.png');
	}

	create() {
	}

	update() {
			
	}

	/////   CUSTOM   /////

}
