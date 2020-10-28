class ImageManager {
    constructor () {
        this.elem = document.getElementById("image");
    }
    show (image) {
        this.elem.src = image;
    }
}

export const image = new ImageManager;