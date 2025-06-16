class HoverManager {
	constructor() {
		this.hoveredOption = null;
		this.lastHovered = null;
		this.scene = null;

		setInterval(() => this.update(), 50);
		// scene.input.on('pointermove', this.handlePointerMove, this);
	}

	init(scene) {
		this.scene = scene;
	}

	update() {
		if (!this.scene) return;
		const pointer = this.scene.input.activePointer;
		
		if (!this.hoveredOption && this.lastHovered?.subMenu?.visible) {
			const menuBounds = this.lastHovered.subMenu.getBounds();
			const optionBounds = this.lastHovered.getBounds();

			const isOverMenu = Phaser.Geom.Rectangle.Contains(menuBounds, pointer.worldX, pointer.worldY);
			const isOverOption = Phaser.Geom.Rectangle.Contains(optionBounds, pointer.worldX, pointer.worldY);

			if (!isOverMenu && !isOverOption) this.lastHovered.subMenu.setVisible(false);
		}
	}

	setHoveredOption(option) {
		if (this.hoveredOption !== option) {
			if (this.hoveredOption?.subMenu) this.hoveredOption.subMenu.setVisible(false);
			this.lastHovered = this.hoveredOption;
			this.hoveredOption = option;
		}
	}

	clearHoveredOption(option) {
		if ((this.hoveredOption === option)) {
			this.lastHovered = option;
			this.hoveredOption = null;
		}
	}

	// handlePointerMove(pointer) {
	// 	// @ts-ignore
	// 	const visibleOptions = (this.scene.contextMenuOptions || []).filter(opt =>
	// 		opt.visible && opt.parentMenu?.visible
	// 	);

	// 	let hovered = null;

	// 	for (const option of visibleOptions) {
	// 		const bounds = option.getBounds();
	// 		if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
	// 			hovered = option;
	// 			//debug
	// 			console.log(`${hovered.label.text} bounds :>>>`, bounds);
	// 			break;
	// 		}
	// 	}

	// 	if (hovered !== this.hoveredOption) {
	// 		this.hoveredOption?.onPointerExit();
	// 		hovered?.onPointerEnter();
	// 		this.hoveredOption = hovered;
	// 	}
	// }

}

export const HOVERMANAGER = new HoverManager();