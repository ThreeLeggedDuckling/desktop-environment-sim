import { FolderObject } from "./FolderObject";
import { FileObject } from "./FileObject";

export class RecycleBin extends FolderObject {
    /**
     * 
     * @param {string} name 
     * @param {[FileObject | FolderObject]} content 
     */
    constructor(name, content) {
        super(name, content)
    }

    

    empty() {
        this.content = [];
    }
}