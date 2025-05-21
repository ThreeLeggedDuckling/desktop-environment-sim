export class FileObject {
    constructor(name, fileType, content) {
        this.name = name;
        this.fileType = fileType;
        this.content = content;
    }

    rename(name) {
        this.name = name;
    }

}
