/**
 * Object representation of file type.
 */
export class FileType {
	/**
	 * Object representation of file type.
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

/**
 * Enum of default file types.
 */
export const DEFAULT_FILETYPES = Object.freeze({
	APP : new FileType('app', '.exe', 'app'),
	FOLDER : new FileType('folder', '', 'folder'),
	JPG : new FileType('image', '.jpg', 'picture'),
	PDF : new FileType('pdf', '.pdf', 'pdf'),
	PNG : new FileType('image', '.png', 'picture'),
	RECYCLEBIN : new FileType('folder', '', ['binEmpty', 'binFull']),
	SYSTEM : new FileType('system', '', 'system'),
	WRITER : new FileType('text', '.doc', 'docWriter'),
});

/**
 * Object representation of file.
 */
export class FileObject {
	/**
	 * Object representation of file.
	 * @param {string} name - Name of the file
	 * @param {FileType} fileType - Type of the file
	 * @param {string | object} content - Content of the file
	 */
	constructor(name, fileType, content) {
		this.name = name;
		this.fileType = fileType;
		this.content = content;
	}

	/**
	 * Set file name
	 * @param {string} name
	 */
	rename(name) {
		this.name = name;
	}

}

/**
 * Object representation of a folder.
 */
export class FolderObject extends FileObject {
	/**
	 * Object representation of a folder.
	 * @param {string} name - Name of the folder
	 * @param {FileType} folderType - Type folder
	 * @param {Array<FileObject>} content - Files and subfolders of the folder
	 */
	constructor(name, folderType = DEFAULT_FILETYPES.FOLDER, content = []) {
		super(name, folderType, content);
	}

	/**
	 * Adds a file to the folder if it not already contained within the folder.
	 * @param {FileObject} file - File to add to the folder
	 * @returns {boolean} - Return false if the folder already contains the file, return true if the file has been added
	 */
	add(file) {
		if (this.content.includes(file)) return false;
		if (this.content.find(f => f.name === file.name && f.fileType === file.fileType)) return false;
		this.content.push(file);
		return true
	}

	/**
	 * Create and add a copy of a file already present in the folder. The name name of the copy has a numeral value added at its end to differentiate between objects.
	 * @param {Phaser.Scene} scene - Parent scene, allows to access the scene's context
	 * @param {FileObject} file - File to add to the folder
	 */
	addCopy(scene, file) {
		let newCopy, i = 1;

		if (file instanceof FolderObject) newCopy = new FolderObject(`${file.name}${i}`, file.fileType, file.content);
		else newCopy = new FileObject(`${file.name}${i}`, file.fileType, file.content);

		while (this.content.some(o => o.name == newCopy.name && o.fileType == newCopy.fileType)) {
			i++;
			newCopy.name = `${file.name}${i}`;
		}

		this.add(newCopy);
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

/**
 * Object representation of a system app.
 */
export class SystemObject extends FileObject {
	/**
	 * Object representation of a system app.
	 * @param {string} name - Name of the element
	 * @param {string} texture - Texture to use for this element
	 * @param {object} content - Content of the element
	 */
	constructor(name, texture, content) {
		super(name, DEFAULT_FILETYPES.SYSTEM, content);
		this.texture = texture;
	}
}
