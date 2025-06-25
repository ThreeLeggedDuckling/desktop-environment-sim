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

		if (pointer.rightButtonDown()) this.destroyMenus(pointer.downTime);
		// else if ()
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
