import { BaseScene } from "./BaseScene.js";

import { initMenuManger, MENUMANAGER } from "../handlers/MenuManager.js";

import { ContextMenu, OptionObject } from "../gameObjects/ContextMenu.js";
import { DialogWindow } from "../gameObjects/Windows.js";
import { DEFAULT_FILETYPES, FileObject, FileType, FolderObject,  } from "../gameObjects/Files.js";
import { DesktopIcon, Icon } from "../gameObjects/Icons.js";
import { TaskBar } from "../gameObjects/TaskBar.js";

export class DesktopScene extends BaseScene {
  constructor() {
    super({ key: 'DesktopScene' });
  }

  preload() {
		super.preload();
    this.load.image('desktopBg', 'assets/pictures/leafs.jpg');
	}

  create() {
    super.create();
    initMenuManger(this);

    // Store original position of dragged elements
    let startPosition;

    // The scene's file and Icon objects
    this.files = new Array();
    this.icons = new Array();

    // Add pre-existing files and folders
    this.files.push(
      new FolderObject('Corbeille', DEFAULT_FILETYPES.RECYCLEBIN),
      new FileObject('Chat gris', DEFAULT_FILETYPES.JPG, 'catG'),
      new FileObject('Canard', DEFAULT_FILETYPES.PNG, 'ducky'),
      new FolderObject('Mes images', DEFAULT_FILETYPES.FOLDER, [
        new FileObject('Chat gris', DEFAULT_FILETYPES.PNG, 'catG'),
        new FileObject('Chat orange', DEFAULT_FILETYPES.PNG, 'catO'),
        new FileObject('Canard', DEFAULT_FILETYPES.PNG, 'ducky'),
      ]),
    );

    // Adding empty() method to the recycle bin folder
    this.files[0].empty = function() { this.content = []; };

    // Create background context menu options
    const desktopBgContextOpt = [
      new OptionObject('Affichage', null, [   // A IMPLEMENTER
        new OptionObject('Grandes icônes', null),
        new OptionObject('Icônes moyennes', null),
        new OptionObject('Petites icônes', null),
      ]),
      new OptionObject('Trier par', null, [   // A IMPLEMENTER
        new OptionObject('Nom', null),
        new OptionObject('Type d\'élement', null),
      ]),
      new OptionObject('Nouveau', null, [     // A IMPLEMENTER
        new OptionObject('Dossier', null),
        new OptionObject('Document Word', null),
        new OptionObject('Présentation PowerPoint', null),
        new OptionObject('Document texte', null),
        new OptionObject('Feuille de calcul', null),
      ]),
      new OptionObject('Paramètres d\'affichage', null),    // A IMPLEMENTER
      new OptionObject('Ouvrir dans le Terminal', null),    // A IMPLEMENTER
      new OptionObject('Afficher plus d\'options', null),   // A IMPLEMENTER
    ];

    // Add desktop background
    const desktopBackground = this.add.image(0,0,'desktopBg').setOrigin(0);
    desktopBackground.setInteractive().on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) {
        let posX = pointer.x, posY = pointer.y;
        const contextual = new ContextMenu(this, posX, posY, desktopBgContextOpt);
        contextual.adjustSelfPosition();
    
        this.add.existing(contextual);
        MENUMANAGER.addMenu(contextual, pointer.downTime);
      }
    })


    // Create icons for each file and add it to the list of icons
    this.files.forEach((file, i) => { this.icons.push(new DesktopIcon(this, 40, 100 + (i * 100 + 10), file)); });

    // Define mouse click interactions
    this.input.on('pointerdown', (pointer, position) => {
      // Get the last selected icon
      let previouslyClicked = position.find(obj => obj instanceof DesktopIcon);

      for (let icon of this.icons) {
        // If the icon left-clicked on isn't the previously selected one or if the last click is the mouse right button
        // set the icon isSelected property to false
        if (icon !== previouslyClicked || pointer.rightButtonDown()) icon.setSelected(false);

        // If the icon left-clicked is the previously selected one and constitute a double click
        // open the corresponding "window" and set the icon isSelected property to false
        if (icon === previouslyClicked && this.checkDoubleClick()) {
          // ICI IMPLMENTER DOUBLE CLICK
          console.log(icon.name, 'opened');
          icon.setSelected(false);
        }
      }
      
      // On right button click, open the pointer's target context menu
      if (pointer.rightButtonDown()) {
        // ICI IMPLEMENTER MENU CONTEXTUEL
      }

    });

    // When beginning drag on dragable element, 
    this.input.on('dragstart', (pointer, gameObject) => {
      // Store original position
      startPosition = { x: gameObject.x, y: gameObject.y };

      // Bring dragged element to the forefront
      this.children.bringToTop(gameObject);
    });

    // When ending drag on dragable element
    this.input.on('dragend', (pointer, gameObject) => {
      // Check if drag ends with pointer over an other icon
      for (const icon of this.icons) {
				// Skip self
				if (icon === gameObject) continue;

        // Check if pointer inside icon bounds
				const targetBounds = icon.getBounds();
        const isOverTarget = Phaser.Geom.Rectangle.Contains(targetBounds, pointer.x, pointer.y);

        if (isOverTarget) {
          // If the icon is for a folder and not the recycle bin
          if (icon.file instanceof FolderObject && gameObject.file.fileType !== DEFAULT_FILETYPES.RECYCLEBIN) {
            // Try adding the file to the folder's content
            let fileAdded = icon.file.add(gameObject.file);

            // If it succeeds, update the icon's active texture and remove the icon from the scene
            if (fileAdded) {
              icon.setEmptyFolder(false);
              this.icons.splice(this.icons.indexOf(gameObject), 1);
              this.children.remove(gameObject);
            }

            // Else spawn dialog window with action choices
            else {
              const dialogOptions = [
               {
                  label: 'Remplacer',
                  callback: () => {
                    const i = this.files.indexOf(gameObject.file);
                    this.files.splice(i, 1);
                    gameObject.file.destr
                    gameObject.destroy();
                  }
                },
                { 
                  label: 'Ignorer',
                  callback: () => {}
                },
                { 
                  label: 'Comparer',
                  callback: () => {}
                }, 
              ]

              // PLACEHOLDER CHOIX
              const dialog = new DialogWindow(
                this,
                this.scale.width /2,
                this.scale.height /2,
                500,  // A MODIFIER
                `La destination comprend déjà un fichier nommé « ${gameObject.file.name}${gameObject.file.fileType.extension} ».`,
                true,
                dialogOptions
              );
            }
          }

          // If dragged object still on display, reset its position to before the drag
          // @ts-ignore
          console.log('children includes dragged', this.children.list.includes(gameObject));
          // @ts-ignore
          if (this.children.list.includes(gameObject)) gameObject.setPosition(startPosition.x, startPosition.y);
        }

			}
    })


    // PLACEHOLDER TASKBAR
    this.taskBar = new TaskBar(this, [
      new FolderObject('Explorateur de fichiers'),
      new FileObject('Photos', DEFAULT_FILETYPES.PNG, 'catG'),
    ]);

  }

  update() {

  }
}
