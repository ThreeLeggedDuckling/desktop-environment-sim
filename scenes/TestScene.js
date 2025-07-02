import { BaseScene } from "./BaseScene.js";

import { initMenuManger } from "../handlers/MenuManager.js";

import { ContextMenu, OptionObject } from "../gameObjects/ContextMenu.js";
import { DialogWindow, WindowObject } from "../gameObjects/Windows.js";
import { DEFAULT_FILETYPES, FileObject, FileType, FolderObject } from "../gameObjects/Files.js";
import { DesktopIcon, Icon } from "../gameObjects/Icons.js";
import { TaskBar } from "../gameObjects/TaskBar.js";

export class TestScene extends BaseScene {
	constructor() {
		super({ key: 'TestScene' });
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();
		initMenuManger(this);

		const poule = new DesktopIcon(this, 50, 110, new FileObject('test1', DEFAULT_FILETYPES.JPG, 'chickenJPG'));
		const fleurs = new DesktopIcon(this, 150, 110, new FileObject('test2', DEFAULT_FILETYPES.PNG, 'flowersPNG'));
		
		this.taskBar = new TaskBar(this, [
			new FolderObject('Explorateur de fichiers'),
			new FileObject('Photos', DEFAULT_FILETYPES.PNG, 'catG'),
		]);


		/////	 TEST WINDOW	/////
		const testWin1 = new WindowObject(this, 500, 400, 500, 300, new FileObject('test1', DEFAULT_FILETYPES.JPG, 'chickenJPG'));
		//@ts-ignore
		const testWin2 = new WindowObject(this, 1200, 400, 500, 300, new FileObject('test2', DEFAULT_FILETYPES.JPG, 'chickenJPG'), { isDefault: false }, { isDefault: false });

		// @ts-ignore
		console.log(this.openWindows);




		/////	 TEST DIALOG	/////
		/*
		const dialog = new DialogWindow(
			this,
			this.scale.width /2,
			this.scale.height /2,
			500,
			[
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tellus libero, maximus in maximus at, molestie sed ligula.',
				'Donec nec turpis placerat, mollis tellus vel, dignissim tellus.'
			],
			false,
			[
				{ label: 'Btn 1', callback: () => { console.log('Je suis btn 1'); } },
				{ label: 'Btn 2', callback: () => { console.log('Je suis btn 2'); } },
				{ label: 'Btn 3', callback: () => { console.log('Je suis btn 3'); } },
			]
		);

		// dialog.background.width = 700;

		this.children.remove(dialog);
		this.add.existing(dialog);
		*/


		/////	 DEV TEST DISPLAY	/////
		this.testInfos = this.add.text(this.scale.width - 30, 10, '', { align: 'right', lineSpacing: 10 }).setOrigin(1, 0);
	}

	update() {
		const pinnedIconBounds = this.taskBar.taskContainer.getBounds();

		//	DEV TEST DISPLAY
		this.testInfos.setText([
			'TEST DATA',
		]);
	}

	updateWindowsDiplay() {

	}


	/////   CUSTOM   /////

}
