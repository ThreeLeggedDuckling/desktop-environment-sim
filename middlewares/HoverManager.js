import { OptionContainer } from "../classes/ContextMenu.js";

export class HoverManager {
	/**
	 * 
	 * @param {Phaser.Scene} scene - Context
	 */
	constructor(scene) {
		this.scene = scene;
		this.hoveredOption = null;

		scene.input.on('pointermove', this.handlePointerMove, this);
	}

	handlePointerMove(pointer) {
		// @ts-ignore
		const visibleOptions = (this.scene.contextMenuOptions || []).filter(opt =>
			opt.visible && opt.parentMenu?.visible
		);

		let hovered = null;

		for (const option of visibleOptions) {
			const bounds = option.getBounds();
			if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
				hovered = option;
				//debug
				console.log(`${hovered.label.text} bounds :>>>`, bounds);
				break;
			}
		}

		if (hovered !== this.hoveredOption) {
			this.hoveredOption?.onPointerExit();
			hovered?.onPointerEnter();
			this.hoveredOption = hovered;
		}
	}

}

