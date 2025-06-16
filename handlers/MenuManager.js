/*
export class MenuManager {
	constructor(scene) {
		this.scene = scene;
		// @ts-ignore
		this.openMenus = new Set();
		// this.openMenus = [];
		// this.lastSpawn = null;

		// @ts-ignore
		this.spawnedThisEvent = new Set();
		this.currentEventDownTime = null;

		this.scene.input.on('pointerdown', this.handlePointerDown, this);
	}

	blockNewMenuDestruction(menu, downTime) {
		if (this.currentEventDownTime !== downTime) {
			this.spawnedThisEvent.clear();
			this.currentEventDownTime = downTime;
		}

		this.spawnedThisEvent.add(menu);

		// this.lastSpawn = { 'menu': menu, 'spawnTime': eventTime };
	}
	
	// destroyAllExcept(exception = null) {
	// @ts-ignore
	destroyAllExcept(exception = new Set()) {
		for (const menu of this.openMenus) {
			if (!exception.has(menu)) menu.destroyMenuChain();
		}
		this.openMenus.clear();

		// //debug
		// console.log('DESTROY FUNCTION');

		// for (const menu of this.openMenus) {
		// 	const idX = menu.x === exception?.x;
		// 	const idY = menu.y === exception?.y;

		// 	//debug
		// 	console.log('> idX', idX);
		// 	console.log('> idY', idY);
		// 	if (!idX || !idY) console.log('> destroying menu');;

		// 	if (!idX || !idY) menu.destroyMenuChain();
		// }

		// this.openMenus.clear();
		// // this.openMenus = [];
	}

	handlePointerDown(pointer) {
		console.log('POINTER DOWN');
		if (pointer.leftButtonDown()) console.log('left click');
		if (pointer.rightButtonDown()) console.log('right click');

		const downTime = pointer.downTime;

		if (this.currentEventDownTime === downTime) {
			this.currentEventDownTime = null;
			this.spawnedThisEvent.clear();
			return;
		}

		let clickedInsideMenu = false;
		for (const menu of this.openMenus) {
			const bounds = menu.getBounds();
			if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
				clickedInsideMenu = true;
				break;
			}
		}

		if (!clickedInsideMenu) this.destroyAllExcept();

		// //debug
		// console.log('MANAGER POINTER DOWN HANDLER');
		// console.log('> lastSpawn', this.lastSpawn);

		// if (this.lastSpawn && this.lastSpawn?.spawnTime === pointer.event.timeStamp) {
		// 	this.lastSpawn = null;
		// 	//debug
		// 	console.log('> early stop ...');
		// 	return;
		// }

		// let clickedInsideMenu = false;

		// for (const menu of this.openMenus) {
		// 	const bounds = menu.getBounds();
		// 	if(Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
		// 		clickedInsideMenu = true;
		// 		break;
		// 	}
		// }

		// //debug
		// console.log('> lastSpawn.spwanTime === event.timeStamp', this.lastSpawn?.spawnTime === pointer.event.timeStamp);

		// if (!clickedInsideMenu) {
		// 	//debug
		// 	console.log('> destruction');
		// 	this.destroyAllExcept(this.lastSpawn?.menu);
		// }

		// // this.lastSpawn = null;
	}

	register(menu) {
		this.openMenus.add(menu);
		// this.openMenus.push(menu);
	}

	unregister(menu) {
		this.openMenus.delete(menu);
		// this.openMenus = this.openMenus.splice(this.openMenus.indexOf(menu), 1);
	}

}
*/

export class MenuManager {
	constructor(scene) {
		this.scene = scene;
		this.rootMenu = null;

		this.scene.input.on('pointerdown', this.handlePointerDown, this);
	}

	spawnRootMenu(menu) {
		// Destroy previous menu chain
		if (this.rootMenu && this.rootMenu !== menu) {
			this.rootMenu.destroyMenuChain?.();
		}
		this.rootMenu = menu;
	}

	handlePointerDown(pointer) {
		if (!this.rootMenu) return;

		// Check if pointer is inside any menu (root or its submenus)
		const allMenus = this.rootMenu.getMenuChain?.() || [this.rootMenu];
		const insideAny = allMenus.some(menu => {
			const bounds = menu.getBounds();
			return Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y);
		});

		if (!insideAny) {
			this.rootMenu.destroyMenuChain?.();
			this.rootMenu = null;
		}
	}
}

export let MENUMANAGER = null;

export function initMenuManger(scene) {
	if (!MENUMANAGER) {
		MENUMANAGER = new MenuManager(scene);
	}
}
