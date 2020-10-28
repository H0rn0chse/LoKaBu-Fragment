const fs = require('fs').promises;

class FragmentManager {
    constructor () {
        this.elem = document.getElementById("fragment");
        this.name = null;
        this.receipt = null;
        this.parser = new DOMParser();
    }

    show (fragment) {

        fs.readFile(fragment, "utf-8")
            .then(this._fragmentToObject.bind(this))
            .then(receipt => {
                const date = new Date(parseInt(receipt.lines[0].Date, 10) || 0);
                this.elem.querySelector(".date").value = date.toISOString().substring(0, 10);

                this.elem.querySelector(".date").blur();
                this.elem.querySelector(".date").focus();
            })
            .then(() => {
                this.name = fragment;
            });
    }

    change () {
        const date = this.elem.querySelector(".date").value;
        this.receipt.lines.forEach(line => {
            line.Date = new Date(date).getTime().toString();
        });
        this.save()
    }

    save () {
        if (this.name) {
            const text = this._objectToFragment(this.receipt);
            return fs.writeFile(this.name, text, "utf8")
                .then(() => {
                    console.log("save successful");
                })
                .catch(console.error);
        }
    }

    _fragmentToObject (fragmentText) {
        const text = `<Receipt>${fragmentText}</Receipt>`.replace(/\n/g, "");

        const xmlDoc = this.parser.parseFromString(text, "text/xml");

        var receipt = {
            lines: []
        };

        if (xmlDoc) {
            const aLines = Array.from(xmlDoc.documentElement.childNodes);
            aLines.forEach(xmlLine => {
                const line = {};
                const lineProps = Array.from(xmlLine.childNodes);
                lineProps.forEach(xmlProp => {
                    line[xmlProp.nodeName] = xmlProp.textContent;
                });
                receipt.lines.push(line);
            });
        }
        this.receipt = receipt;
        return receipt;
    }

    _objectToFragment (fragment) {
        const lines = fragment.lines.map(line => {
            let lineText = this._addTag(line.Date, "Date");
			lineText += this._addTag(line.ID, "ID");
			lineText += this._addTag(line.Store, "Store");
			lineText += this._addTag(line.SourceAccount, "SourceAccount");
			lineText += this._addTag(line.TargetAccount, "TargetAccount");
			lineText += this._addTag(line.Value, "Value");
			lineText += this._addTag(line.Person, "Person");
			lineText += this._addTag(line.Type, "Type");

			return this._addTag(lineText, "Line");
        });
        return lines.join("\n");
    }

    _addTag (value, tag) {
        return `<${tag}>${value}</${tag}>`;
    }
}

export const fragment = new FragmentManager();