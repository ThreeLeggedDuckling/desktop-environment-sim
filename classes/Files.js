export class FileType {
	/**
	 * @param {string} type - The type of file ('folder', 'image', 'text', ... )
	 * @param {string} extension - File extension ('', '.pgn', '.doc', ... )
	 * @param {string | Array<string>} texture - Key(s) of the picture(s) associated with the type
	 */
	constructor(type, extension, texture) {
		this.type = type;
		this.extension = extension;
		this.texture = texture;
	}
}

// Default file types
export const DEFAULT_FILETYPES = {
	'APP' : new FileType('app', '.exe', 'app'),
	'FOLDER' : new FileType('folder', '', 'folder'),
	'JPG' : new FileType('image', '.jpg', 'picture'),
	'PDF' : new FileType('pdf', '.pdf', 'pdf'),
	'PNG' : new FileType('image', '.png', 'picture'),
	'RECYCLEBIN' : new FileType('folder', '', ['binEmpty', 'binFull']),
	'WRITER' : new FileType('text', '.doc', 'docWriter'),
}

export class FileObject {
	/**
	 * 
	 * @param {string} name - Name of the file
	 * @param {FileType} fileType - Type of the file
	 * @param {string | object} content - Content of the file
	 */
	constructor(name, fileType, content) {
		this.name = name;
		this.fileType = fileType;
		this.content = content;
	}

	rename(name) {
		this.name = name;
	}

}

export class FolderObject extends FileObject {
	/**
	 * @param {string} name - Name of the folder
	 * @param {FileType} folderType - Type folder
	 * @param {Array<FileObject>} content - Files and subfolders of the folder
	 */
	constructor(name, folderType = DEFAULT_FILETYPES.FOLDER, content = []) {
		super(name, folderType, content);
	}

	/**
	 * Adds a file to the folder if it not already contained within the folder
	 * @param {FileObject} object - File to add to the folder
	 * @returns {boolean} - Return false if the folder already contains the file, return true if the file has been added
	 */
	add(object) {
		if (this.content.includes(object)) return false;
		this.content.push(object);
		return true
	}

	/**
	 * Create and add a copy of a file already present in the folder. The name name of the copy has a numeral value added at its end to differentiate between objects.
	 * @param {Phaser.Scene} scene - Parent scene, allows to access the scene's context
	 * @param {FileObject} object - File to add to the folder
	 */
	addCopy(scene, object) {
		const isFolder = object instanceof FolderObject;
		let tempObj;
		let i = 1;

		do {
			if (isFolder) tempObj = new FolderObject(`${object.name}${i}`, object.fileType, object.content);
			else tempObj = new FileObject(`${object.name}${i}`, object.fileType, object.content);
			i++;
		}
		while (this.content.some(o => o.name == tempObj.name && o.fileType == tempObj.fileType));

		// @ts-ignore
		scene.files.push(tempObj);
		this.add(tempObj);
	}

	/**
	 * Removes an object from the folder if present.
	 * @param {FileObject} object - Object to remove from the folder
	 */
	remove(object) {
		const index = this.content.indexOf(object);
		if (index > -1) this.content.splice(index, 1);
	}

}
