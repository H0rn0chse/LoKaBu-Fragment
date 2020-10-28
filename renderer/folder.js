import { fragment } from "./fragment.js";
import { image } from "./image.js";

const path = require('path');
const glob = require('glob');

const { dialog } = require('electron').remote;

class FolderManager {
    constructor () {
        this.files = [];
        this.next = 0;
        this.elem = document.getElementById("fileList");
    }
    open () {
        const folder = dialog.showOpenDialog({
            title: "Open Folder",
            properties: [
                "openDirectory"
            ]
        }).then(result => {
            if (Array.isArray(result.filePaths)) {
                return this.findFiles(result.filePaths[0]);
            }
        }).then(() => {
            this.buildList();
        }).then(() => {
            this.showNext();
        });
    }

    findFiles (path) {
        return new Promise((resolve, reject) => {
            glob(path + '/**/*.fragment.xml', {}, (err, files) => {
                if (err) {
                    return reject(err);
                }
                this.files = files;
                this.next = 0;
                resolve();
            })
        });
    }

    buildList () {
        this.elem.innerHTML = "";

        this.files.forEach(file => {
            const entry = document.createElement("li");
            const parts = path.parse(file)
            entry.innerText = parts.base.split(".fragment.xml")[0];
            this.elem.appendChild(entry);
        })
    }

    showPrev () {
        const file = this.getPrev();
        if (file) {
            const parts = file.split("_");
            parts.pop();
            image.show(parts.join("_"));
            fragment.show(file);

            this.highlightCurrent();
        }
    }

    getPrev () {
        if (this.next >= 0) {

            const entry = this.files[this.next - 2];
            if (this.next > 0) {
                this.next--;
            }
            return entry;
        }
    }

    showNext () {
        const file = this.getNext();
        if (file) {
            const parts = file.split("_");
            parts.pop();
            image.show(parts.join("_"));
            fragment.show(file);

            this.highlightCurrent();
        }
    }

    getNext () {
        if (this.next < this.files.length) {
            const entry = this.files[this.next];
            this.next++;
            return entry;
        }
    }

    highlightCurrent () {
        const elems = this.elem.querySelectorAll("li");
        elems.forEach((elem, index) => {
            if (index === this.next - 1) {
                elem.classList.add("current");
            } else {
                elem.classList.remove("current");
            }
        })
    }
}

export const folder = new FolderManager;