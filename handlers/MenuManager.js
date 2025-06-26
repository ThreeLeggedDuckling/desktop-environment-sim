export class MenuManager {
	constructor(scene) {
		this.scene = scene;
		this.openMenus = [];

		this.scene.input.on('pointerdown', this.handlePointerDown, this);
	}
	
	addMenu(menu, eventTime) {
		this.openMenus.push({ menu: menu, spawnTime: eventTime });
	}
	
	destroyMenus(eventTime) {
		let garbage = [];

		for (const elem of this.openMenus) {
			// Skip newly spawned menu tree
			if (elem.spawnTime === eventTime) continue;
			// Store reference
			garbage.push(elem);
			// Destroy previous menu tree
			elem.menu.destroyMenuChain();
		}

		// Update openMenus
		// @ts-ignore
		this.openMenus = this.openMenus.filter(elem => !garbage.includes(elem))
	}

	handlePointerDown(pointer) {
		//debug
		console.log('MENU MANAGER');

		// If right click, stop destruction of spawned menus
		if (pointer.rightButtonDown()) this.destroyMenus(pointer.downTime);

		// IMPLEMENTER CLIC SUR OPTION AVEC SOUS OPTION
		// If left click on an option with a submenu, do nothing
		// else if ()

		// If left click anywhere else, destroy all menus
		else this.destroyMenus();


		// for (const elem of this.openMenus) {
		// 	console.log(elem.menu);
		// }

	}

}

export let MENUMANAGER = null;

export function initMenuManger(scene) {
	if (!MENUMANAGER) MENUMANAGER = new MenuManager(scene);
}
