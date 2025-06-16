import { BaseScene } from "./BaseScene.js";

import { initMenuManger } from "../handlers/MenuManager.js";

import { ContextMenu, OptionObject } from "../gameObjects/ContextMenu.js";
import { DialogWindow } from "../gameObjects/DialogWindow.js";
import { DEFAULT_FILETYPES, FileObject, FileType, FolderObject,  } from "../gameObjects/Files.js";
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
		this.testInfos = this.add.text(this.scale.width - 30, 10, '', { align: 'right' }).setOrigin(1, 0);
	}

	update() {
		const pinnedIconBounds = this.taskBar.taskContainer.getBounds();

		//	DEV TEST DISPLAY
		this.testInfos.setText([
			'TEST DATA',
		]);
	}


	/////   CUSTOM   /////

}
