import { BaseScene } from "./BaseScene.js";

import { initContextualManager } from "../handlers/MenuManager.js";

import { ContextMenu, OptionObject } from "../gameObjects/ContextMenu.js";
import { DialogWindow } from "../gameObjects/Windows.js";
import { DEFAULT_FILETYPES, FileObject, FileType, FolderObject,  } from "../gameObjects/Files.js";
import { DesktopIcon, Icon } from "../gameObjects/Icons.js";
import { TaskBar } from "../gameObjects/TaskBar.js";

export class DesktopScene extends BaseScene {
  constructor() {
    super({ key: 'DesktopScene' });
  }

  create() {
    super.create();
    // Add handlers
    initContextualManager(this);

    this.displayExtension = false;    // Store if icon's legend should include extension
    this.files = new Array();   // Store the scene's File objects
    this.icons = new Array();   // Store the scene's Icon objects

    let startPosition;    // Store original position of dragged elements

    // Add pre-existing files and folders
    this.files.push(
      new FolderObject('Corbeille', DEFAULT_FILETYPES.RECYCLEBIN),
      new FileObject('Dessin fleurs', DEFAULT_FILETYPES.JPG, ''),
      new FileObject('Canard pixel', DEFAULT_FILETYPES.PNG, ''),
      new FolderObject('Mes images', DEFAULT_FILETYPES.FOLDER, [
        new FileObject('Canard pixel', DEFAULT_FILETYPES.PNG, ''),
        new FileObject('Dessin fleurs', DEFAULT_FILETYPES.PNG, ''),
        new FileObject('fleurs', DEFAULT_FILETYPES.PNG, ''),
      ]),
    );
    // Adding empty() method to the recycle bin folder
    this.files[0].empty = function() { this.content = []; };

    // Create background context menu options
    this.extOption = new OptionObject('Afficher extensions de noms de fichiers', () => { this.toggleExtensions(this.extSwitch) });
    const desktopBgContextOpt = [
      new OptionObject('Affichage', null, [   // A IMPLEMENTER
        // new OptionObject('Grandes icônes', null),
        // new OptionObject('Icônes moyennes', null),
        // new OptionObject('Petites icônes', null),
        this.extOption,
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
    ];

    // Add desktop background
    const desktopBackground = this.add.image(0,0,'desktopBg').setOrigin(0);
    desktopBackground.setInteractive().on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) {
        let posX = pointer.x, posY = pointer.y;
        const contextual = new ContextMenu(this, posX, posY, desktopBgContextOpt);
        contextual.adjustSelfPosition();
    
        this.add.existing(contextual);
        //@ts-ignore
        this.CONTEXTUAL_MANAGER.addMenu(contextual, pointer.downTime);
      }
    })

    // Add button to toggle display of file extensions
    this.extSwitch = this.add.text(1900, 20, 'Afficher extensions', { backgroundColor: '#b30000', fontSize: '15px', align: 'center', wordWrap: { width: 100, useAdvancedWrap: true } }).setPadding(5).setAlpha(0.7).setOrigin(1,0);
    this.extSwitch.setInteractive()
      .on('pointerover', () => { this.extSwitch.setAlpha(1); })
      .on('pointerout', () => { this.extSwitch.setAlpha(0.7); })
      .on('pointerdown', () => { this.toggleExtensions(this.extSwitch) });

    // Create icons for each file and add it to the list of icons
    for (const f of this.files) {
      this.icons.push(new DesktopIcon(this, 0, 0, f));
    }

    // Place icons in a grid
    Phaser.Actions.GridAlign(this.icons, {
      height: 8,
      cellWidth: 110,
      cellHeight: 120
    });

    // On click, get the last selected icon
    // Check if is the same object instance
    this.input.on('pointerdown', (pointer, position) => {
      let previouslyClicked = position.find(obj => obj instanceof DesktopIcon);
      
      for (let icon of this.icons) {
        // If the icon left-clicked on isn't the previously selected one or if the last click is the mouse right button
        // set the icon isSelected property to false
        if (icon !== previouslyClicked || pointer.rightButtonDown()) icon.setSelected(false);

        // If the icon left-clicked is the previously selected one and constitute a double click
        // open the corresponding window and set the icon isSelected property to false
        if (icon === previouslyClicked && pointer.leftButtonDown() && this.checkDoubleClick()) {
          icon.spawnWindow();
          icon.setSelected(false);
        }
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


    // DEV : test data display
    // this.testInfos = this.add.text(120, 50, ['[placeholder]','','','',''], { fontSize: '18px', backgroundColor: '#990000' })
    //   .setPadding(5).setOrigin(0);

  }
  
  /**
   * Toggle the display of files extensions on icons label.
   * @param {Phaser.GameObjects.Text} btn - Toggle button
   */
  toggleExtensions(btn) {
    // Toggle displayExtension
    //@ts-ignore
    btn.scene.displayExtension = !this.displayExtension;

    // Update contextual option
    this.extOption.label = `${this.displayExtension ? 'Masquer' : 'Afficher'} extensions de noms de fichiers`;

    // Update button
    btn.setStyle({ backgroundColor: this.displayExtension ? '#33cc33' : '#b30000' });
    btn.setText(this.displayExtension ? 'Masquer extensions' : 'Afficher extensions');

    // Update icons
    // @ts-ignore
    for (const i of btn.scene.icons) {
      i.iconLegend.text = `${i.file.name}${this.displayExtension ? i.file.fileType.extension : ''}`;
    }
  }

}
