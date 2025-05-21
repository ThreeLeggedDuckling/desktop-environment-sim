import { FileObject } from "./FileObject";

export class FolderObject {
    /**
     * 
     * @param {string} name 
     * @param {[FileObject | FolderObject]} content 
     */
    constructor(name, content) {
        this.name = name;
        this.content = content;
    }

    rename(name) {
        this.name = name;
    }

    add(object) {
        if (!this.content.includes(object)) this.content.push(object);
    }

}