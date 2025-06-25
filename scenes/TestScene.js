import { BaseScene } from "./BaseScene.js";

import { initMenuManger } from "../handlers/MenuManager.js";

import { ContextMenu, OptionObject } from "../gameObjects/ContextMenu.js";
import { DialogWindow, WindowObject } from "../gameObjects/Windows.js";
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


	/////   CUSTOM   /////

}
