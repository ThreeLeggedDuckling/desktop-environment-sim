import { BaseScene } from "./BaseScene.js";

import { DEFAULT_FILETYPES, FileObject, FileType, FolderObject,  } from "../classes/Files.js";
import { DesktopIcon, Icon } from "../classes/Icons.js";
import { DialogWindow } from "../classes/DialogWindow.js";
import { TaskBar } from "../classes/TaskBar.js";

/**
 * Classe de test uniquement utile au développement
 */
export class TestScene extends BaseScene {
	constructor() {
		super({ key: 'TestScene' });
	}

	preload() {
		this.load.image('binEmpty', 'assets/icons/recyclebin_empty.png');
		this.load.image('binFull', 'assets/icons/recyclebin_full.png');
		this.load.image('catG', 'assets/icons/pixelCatGrey.png');
		this.load.image('catO', 'assets/icons/pixelCatOrange.png');
		this.load.image('ducky', 'assets/icons/pixelDuck.png');
		this.load.image('folder', 'assets/icons/folder.png');
		this.load.image('picture', 'assets/icons/picture.png');

		this.load.image('astronautJPG', 'assets/misc/astronaut.jpg');
		this.load.image('chickenJPG', 'assets/misc/chicken.jpg');
		this.load.image('flowersPNG', 'assets/misc/flowers.png');
	}

	create() {
		super.create();   // création BaseScene

		const taskBar = new TaskBar(this);
		
		// const testIcon = new Icon(this, 50, 110, new FileObject('test icon', DEFAULT_FILETYPES.JPG, ''), 64);
		const pouleShort = new DesktopIcon(this, 50, 110, new FileObject('test1', DEFAULT_FILETYPES.JPG, 'chickenJPG'));
		const pouleLong = new DesktopIcon(this, 150, 110, new FileObject('UnePoulePasSurUnMurEtSansPainDur', DEFAULT_FILETYPES.JPG, 'chickenJPG'));
		const fleurShort = new DesktopIcon(this, 250, 110, new FileObject('test2', DEFAULT_FILETYPES.PNG, 'flowersPNG'));
		const fleurLong = new DesktopIcon(this, 350, 110, new FileObject('nomBeaucoupTropLongMerciBeaucoup', DEFAULT_FILETYPES.PNG, 'flowersPNG'));

		const emptyBin = new DesktopIcon(this, 50, 200, new FolderObject('poubelle vide', DEFAULT_FILETYPES.RECYCLEBIN));
		const fullBin = new DesktopIcon(this, 150, 200, new FolderObject('poubelle pleine', DEFAULT_FILETYPES.RECYCLEBIN, [new FolderObject('jhdkqdh')]));

		// debug
		// console.log('testDI2');
		// console.log('icon.displayHeight :>> ', fleurShort.icon.displayHeight);
		// console.log('icon.y :>> ', fleurShort.icon.y);
		// console.log('testDI3');
		// console.log('icon.displayHeight :>> ', fleurLong.icon.displayHeight);
		// console.log('icon.y :>> ', fleurLong.icon.y);

		










		/////	 TEST DIALOG	/////
		/*
		const dialog = new DialogWindow(
			this,
			this.scale.width /2,
			this.scale.height /2,
			500,
			`Lorem ipsum dolor sit amet.`,
			false,
			[
				{ label: 'Btn 1', callback: () => {} },
				{ label: 'Btn 2', callback: () => {} },
				{ label: 'Btn 3', callback: () => {} },
			]
		);

		dialog.background.width = 700;

		this.children.remove(dialog);
		this.add.existing(dialog);
		*/

		/////	 DEV TEST DISPLAY	/////
    this.testInfos = this.add.text(20, 20, 'Modified version');
	}

	update() {
	}

	/////   CUSTOM   /////

}
