import { BaseScene } from "./BaseScene.js";

import { FileType, FileObject, FolderObject } from "../classes/FileClasses.js";
import { DesktopIcon } from "../classes/DesktopIcon.js";

/**
 * Classe de test uniquement utile au développement
 */
export class TestScene extends BaseScene {
	constructor() {
		super({ key: 'TestScene' });
	}

	preload() {
		this.load.image('binEmpty', 'assets/recyclebin_empty.png');
		this.load.image('binFull', 'assets/recyclebin_full.png');
		this.load.image('catG', 'assets/pixelCatGrey.png');
		this.load.image('catO', 'assets/pixelCatOrange.png');
		this.load.image('ducky', 'assets/pixelDuck.png');
		this.load.image('folder', 'assets/folder.png');
		this.load.image('picture', 'assets/picture.png');
	}

	create() {
		super.create();   // création BaseScene

		// Types de fichiers
		const pngType = new FileType('image', '.png', 'picture');
		const jpgType = new FileType('image', '.jpg', 'picture');
		const folderType = new FileType('dossier', '', 'folder');
		const recycleBinType = new FileType('dossier', '', ['binEmpty', 'binFull']);

		// Fichiers
		const catJPG = new FileObject('cat', jpgType, 'catG');
		const duckPNG = new FileObject('duck', pngType, 'ducky');
		const imgPNG = new FileObject('bug', pngType, '');
		const folder1 = new FolderObject('Mes images', folderType, [catJPG, duckPNG, imgPNG]);

		// Corbeille
		const recycleBin = new FolderObject('Corbeille', recycleBinType);
		// @ts-ignore	- évite que VSCode rale pour rien
		recycleBin.empty = function() {
			this.content = [];
		}

		const files = [catJPG, duckPNG, imgPNG, folder1, recycleBin];


		this.files = new Array();
		this.icons = new Array();
		for (const f of files) {
			this.files.push(f);
			this.icons.push(new DesktopIcon(this, 40, 100 + (files.indexOf(f) * 100 + 10), f));
		}

		console.log(this.icons);

		
		this.input.on('pointerdown', (pointer, position) => {
      const clicked = position.find(obj => obj instanceof DesktopIcon);   // détermine dernière icône sélectionnée

      for (const icon of this.icons) {
        if (icon !== clicked || pointer.rightButtonDown()) icon.setSelected(false);
        if (icon === clicked && this.checkDoubleClick()) {
          console.log(icon.name, 'opened');
          icon.setSelected(false);
        }
      }
    });

		this.input.on('dragstart', (pointer, desktopIcon) => { this.children.bringToTop(desktopIcon); });

    this.input.on('dragend', (pointer, gameObject) => {
			for (const icon of this.icons) {
				if (icon === gameObject) continue;		// skip self
				const targetBounds = icon.getBounds();
				const draggedBounds = gameObject.getBounds();
				const isOverTarget = Phaser.Geom.Intersects.RectangleToRectangle(draggedBounds, targetBounds);

				if (isOverTarget && icon.file instanceof FolderObject) {
					console.log(`${gameObject.file.name} dropped on ${icon.file.name}`);
					icon.file.add(gameObject.file);		// AJOUTER RETURN POUR ADDCOPY
					icon.setEmptyFolder(false);
					this.icons.splice(this.icons.indexOf(gameObject), 1);
					this.children.remove(gameObject);

					// debug
					console.log(this.icons);
					console.log(icon.file.content);
				}
			}



			// const folderIcon = position.find(obj => obj instanceof FolderObject);
			// console.log(folderIcon);
			// const folderBounds = folderIcon.getBounds();
			// const isOverFolder = Phaser.Geom.Rectangle.Contains(folderBounds, pointer.x, pointer.y);

			// if (isOverFolder && !(desktopIcon.file instanceof FolderObject)) {
			// 	folderIcon.file.add(desktopIcon.file);
			// 	folderIcon.setEmptyFolder(false);
			// 	this.children.remove(desktopIcon);
			// }

			// PREVIOUS VERSION WITH this.recycleBinIcon
      // const recycleBinBounds = this.recycleBinIcon.getBounds();
      // const isOverRecycleBin = Phaser.Geom.Rectangle.Contains(recycleBinBounds, pointer.x, pointer.y);
      // if (isOverRecycleBin && desktopIcon !== this.recycleBinIcon) {
      //   this.recycleBinIcon.setEmptyFolder(false);
      //   this.children.remove(desktopIcon);
      // }
    })

	}

	update() {
			
	}

	/////   CUSTOM   /////

}
