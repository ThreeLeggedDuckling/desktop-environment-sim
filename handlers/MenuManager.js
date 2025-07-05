import { ContextMenu, OptionContainer } from "../gameObjects/ContextMenu.js";

/**
 * Handler for contextual menus destruction on clic.
 */
export class ContextualManager {
	/**
	 * Handler for contextual menus destruction on clic.
	 * @param {Phaser.Scene} scene - Parent scene
	 */
	constructor(scene) {
		this.scene = scene;
		this.openMenus = [];
		this.updateHoverData = new Phaser.Time.TimerEvent({
			callback: this.checkHover,
			callbackScope: this,
			delay: 50,
			loop: true,
			paused: true
		});
		this.activeHover = null;
		this.lastHover = null;
		this.visibleSubMenu = null;

		this.scene.time.addEvent(this.updateHoverData);
		this.scene.input.on('pointerdown', this.handlePointerDown, this);
	}
	
	/**
	 * Store last opened menu by its timing.
	 * @param {ContextMenu} menu - Opened menu
	 * @param {number} eventTime - Timestamp of the triggering input
	 */
	addMenu(menu, eventTime) {
		this.openMenus.push({ menu: menu, spawnTime: eventTime });
	}
	
	/**
	 * Destroy all open menus except menus opened by the same input.
	 * @param {number} eventTime - Timestamp of the triggering input
	 */
	destroyMenus(eventTime = 0) {
		let garbage = [];

		for (const elem of this.openMenus) {
			// Skip newly spawned menu tree
			if (elem.spawnTime === eventTime) continue;
			// Store reference for openMenus update
			garbage.push(elem);
			// Destroy previous menu tree
			elem.menu.destroyMenuChain();
		}

		// Update openMenus
		// @ts-ignore
		this.openMenus = this.openMenus.filter(elem => !garbage.includes(elem))
	}

	/**
	 * Handles input trigger.
	 * @param {Phaser.Input.Pointer} pointer - Triggering input
	 */
	handlePointerDown(pointer, position) {
		// Store if click occured on an option
		let optionClicked = position.find(obj => obj instanceof OptionContainer);

		//@ts-ignore
		if (this.openMenus.length) this.startHoverCheck();
		
		// If right click, stop destruction of spawned menus
		if (pointer.rightButtonDown()) this.destroyMenus(pointer.downTime);
		// If left click on an option with a submenu, do nothing
		else if (optionClicked?.subMenu) return;
		// Anywhere else, destroy all menus
		else this.destroyMenus();

		//@ts-ignore
		if (!this.openMenus.length) this.stopHoverCheck();
	}

	checkHover() {
		//debug
		// console.log('... HM running');

		// Get active pointer
		// const pointer = this.scene.input.activePointer;
		const activeSubOption = this.lastHover?.subMenu?.options.includes(this.activeHover)

		//debug
		//@ts-ignore
		// this.scene.testInfos.setText([
		// 	`activeHover : ${this.activeHover?.option.label}`,
		// 	`lastHover  : ${this.lastHover?.option.label}`,
		// 	`active is last suboption : ${activeSubOption}`,
		// ]);

		// Hide all submenu except stored
		if (!activeSubOption) {
			for (const opt of this.openMenus[0].menu.options) {
				if (opt !== this.activeHover) opt.subMenu?.setVisible(false);
				else opt.subMenu?.setVisible(true);
			}
		}

	}

	setHoveredOption(option) {
		// If option not part of stored submenu, update stored submenu
		if (option.parentMenu !== this.visibleSubMenu) this.visibleSubMenu = option.subMenu;

		const activeSubOption = this.lastHover?.subMenu?.options.includes(option)
		
		// Update active hover
		if (!activeSubOption && this.activeHover !== option) this.activeHover = option;
	}

	clearHoveredOption() {
		this.lastHover = this.activeHover;
	}

	// RECUP VERSION ABANDONNEE
	// handlePointerMove(pointer) {
	// 	//debug
	// 	// console.log('COUCOU');
		
	// 	// if ()

	// 	// // @ts-ignore
	// 	// const visibleOptions = (this.scene.contextMenuOptions || []).filter(opt =>
	// 	// 	opt.visible && opt.parentMenu?.visible
	// 	// );

	// 	// let hovered = null;

	// 	// for (const option of visibleOptions) {
	// 	// 	const bounds = option.getBounds();
	// 	// 	if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
	// 	// 		hovered = option;
	// 	// 		//debug
	// 	// 		console.log(`${hovered.label.text} bounds :>>>`, bounds);
	// 	// 		break;
	// 	// 	}
	// 	// }

	// 	// if (hovered !== this.hoveredOption) {
	// 	// 	this.hoveredOption?.onPointerExit();
	// 	// 	hovered?.onPointerEnter();
	// 	// 	this.hoveredOption = hovered;
	// 	// }
	// }

	startHoverCheck() {
		// console.log('HOVER CHECK START');
		this.updateHoverData.paused = false;
	}

	stopHoverCheck() {
		// console.log('HOVER CHECK STOP');
		this.updateHoverData.paused = true;
	}

}


/**
 * Add new menu handler to the scene.
 * @param {Phaser.Scene} scene 
 */
export function initContextualManager(scene) {
	//@ts-ignore
	scene.CONTEXTUAL_MANAGER = new ContextualManager(scene);
}
