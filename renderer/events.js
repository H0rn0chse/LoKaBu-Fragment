import { folder } from "./folder.js";
import { fragment } from "./fragment.js";

class EventManager {
    constructor () {
        this.handlerList = [{
            event: "folder.open",
            handler: folder.open,
            scope: folder
        }, {
            event: "folder.showPrev",
            handler: folder.showPrev,
            scope: folder
        }, {
            event: "folder.showNext",
            handler: folder.showNext,
            scope: folder
        }, {
            event: "fragment.change",
            handler: fragment.change,
            scope: fragment
        }, {
            event: "fragment.save",
            handler: fragment.save,
            scope: fragment
        }];
    }

    raise (event, ...args) {
        this.handlerList.reduce((acc, entry) => {
            if(entry.event === event) {
                acc.push(entry);
            }
            return acc;
        }, []).forEach(entry => {
            entry.handler.call(entry.scope, ...args);
        });
    }
}

export var events = new EventManager();

window.addEventListener("keyup", (evt) => {
    if (evt.altKey && evt.key === "ArrowRight") {
        events.raise("folder.showNext", evt);
    }
    if (evt.altKey && evt.key === "ArrowLeft") {
        events.raise("folder.showPrev", evt);
    }
})