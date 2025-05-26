export class FileType {
	/**
	 * @param {string} type - Type de fichier ('dossier', 'image', 'texte', ... )
	 * @param {string} extension - Extension du type ('', '.pgn', '.doc', ... )
	 * @param {string | Array<string>} texture - Clé ou tableau de clés des images de l'icône associée au type. Dans le cas d'un tableau, le format doit être [vide, rempli].
	 */
	constructor(type, extension, texture) {
		this.type = type;
		this.extension = extension;
		this.texture = texture;
	}
}

export class FileObject {
	/**
	 * @param {string} name - Nom du fichier
	 * @param {FileType} fileType - Type du fichier
	 * @param {string | object} content - Contenu du fichier (clé d'une image, objet simulant un contenu complexe)
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
	 * @param {string} name - Nom du dossier
	 * @param {FileType} folderType - Type folder
	 * @param {Array<FileObject>} content - Fichiers et sous-dossiers contenus dans le dossier
	 */
	constructor(name, folderType, content = []) {
		super(name, folderType, content);
	}

	add(object) {
		if (!this.contains(object)) this.content.push(object);
	}

	addCopy(scene, object) {
		const isFolder = object instanceof FolderObject;
		let tempObj;
		let i = 1;

		do {
			if (isFolder) tempObj = new FolderObject(`${object.name}${i}`, object.fileType, object.content);
			else tempObj = new FileObject(`${object.name}${i}`, object.fileType, object.content);
			i++;
		}
		while (this.content.some(o => o.name == tempObj.name));

		scene.files.push(tempObj);
		this.add(tempObj);
	}

	contains(object) {
		return this.content.includes(object);
	}


	remove(object) {
		const index = this.content.indexOf(object);
		if (index > -1) this.content.splice(index, 1);
	}

}