
class TextAreaLimitation {
    maxLines: number;
    maxCharPerLines: number;
    isInError: boolean;
    formGroup: JQuery;
    textArea: HTMLTextAreaElement;
   
    constructor(public Element: JQuery, public lang: string = 'en') {

        if (Element.length > 1) {
            Element.each((index, element) => {
                var d = new TextAreaLimitation($(element));
            });
        }
        else {
            this.textArea = <HTMLTextAreaElement>this.Element[0];
            if (this.hasData('maxlines'))
                this.maxLines = parseInt(Element.data('maxlines'));
            if (this.hasData('charperline'))
                this.maxCharPerLines = parseInt(Element.data('charperline'));
            var parrent = Element.parent();
            if (parrent.hasClass('form-group') == false) {
                Element.wrap("<div class='form-group'></div>");
            }
            if (Element.hasClass('form-control') == false)
                Element.addClass('form-control');
            this.formGroup = Element.closest('.form-group');

            Element.keydown((e) => {
                if (e.ctrlKey)
                    return;
                if (e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18) // ARROWS and others non caractrers keys
                    return;
                if (e.keyCode === 8) //backspace
                    return;
                var lines = this.getInfo();
                var linesValidation = this.validateLinesLenght(lines, false, e.keyCode);
                if (!linesValidation)
                    return false;
                if (e.keyCode !== 13)
                    return this.validateText(false, lines);
            });
            Element.change(() => {
                var lines = this.getInfo();
                var linesValidation = this.validateLinesLenght(lines, true);
                if (!linesValidation) {
                    this.displayLinesExceedError(lines.length);
                    return;
                }
                var text = this.validateText(true, lines);
                if (text && linesValidation)
                    if (this.isInError) {
                        this.Element.trigger("cs.TextAreaLimitation", ["valid"]);
                        this.Element.removeClass("cs-invalid");
                        this.isInError = false;
                        this.formGroup.removeClass('has-error');
                        this.Element.popover('hide');
                    }
            });
        }

    }
    hasData(Data) {
        if (typeof this.Element.data(Data) !== 'undefined')
            return true;
        return false;

    }
    getLineNumber(): number {
        return this.textArea.value.substr(0, this.textArea.selectionStart).split("\n").length;
    }
    validateText(isFromChange: boolean, info: Array<string>): boolean {
        if (this.maxCharPerLines == null)
            return true;
        var l = 0;
        var currentLine = this.getLineNumber() - 1;
        for (var i = 0; i < info.length; i++) {
            l = info[i].length;
            if (!isFromChange && l + 1 > this.maxCharPerLines && currentLine == i)
                return false;
            if ((isFromChange && l > this.maxCharPerLines)) {
                this.isInError = true;
                this.formGroup.addClass('has-error');
                this.Element.addClass("cs-invalid");
                this.displayErrorLenghtMessage(i, info[i]);
                return false;
            }
        }


        return true;
    };
    validateLinesLenght(lines: Array<string>, isFromChange: boolean, keypress?: number): boolean {

        if (this.maxLines == null)
            return true;
       
        if ((lines.length > this.maxLines) || (keypress != null && keypress === 13 && lines.length + 1 > this.maxLines)) {
            if (isFromChange)
            {
                this.isInError = true;
                this.formGroup.addClass('has-error');
                this.Element.addClass("cs-invalid");
                this.displayLinesExceedError(lines.length);
            }
            return false;
        }
        return true;
    };
    getInfo(): Array<string> {
        var val = this.Element.val();
        var lines: Array<string> = val.split('\n');
        return lines;
    };
    displayErrorLenghtMessage(lineNumber: number, lineText: string) {

        var errorMessage = "";
        if (this.lang == "fr") {
            errorMessage = "Chaque ligne ne doit pas dépasser " + this.maxCharPerLines + " caractères par ligne.<br />La ligne " + (lineNumber + 1) + " dépasse ce maximum. Elle a " + lineText.length + " caractères.<br / ><blockquote><p>" + lineText + "</p><footer>" + (this.maxCharPerLines - lineText.length) + " caractères de trop.</foorter></blockquote>"
        }
        else {
            errorMessage = "Each line must not exceed " + this.maxCharPerLines + " characters per line.<br /> Line " + (lineNumber + 1) + " exceeds this maximum.It has " + lineText.length + " characters.<br / ><blockquote><p>" + lineText + "</p><footer>It exceed this limit by " + (this.maxCharPerLines - lineText.length) + ".</foorter></blockquote>";
        }
        this.Element.popover('destroy');
        setTimeout(() => {
            this.Element.popover({
                html: true,
                content: errorMessage,
                placement: 'top',
                trigger: 'manual'
            });
            this.Element.popover('show');
        }, 300);
        this.Element.trigger("cs.TextAreaLimitation", ["invalid"]);
    };
    displayLinesExceedError(lineCount: number) {
        var errorMessage = "";
        if (this.lang == "fr") {
            errorMessage = "Vous devez entrer un maximum de " + this.maxLines + " lignes.<br />Votre texte  contient " + lineCount.toString() + " lignes.";
        }
        else {
            errorMessage = "You must enter a maximum of " + this.maxLines + " lines. Your text contains " + lineCount.toString() + " lines.";
        }
        this.Element.popover('destroy');
        setTimeout(() => {
            this.Element.popover({
                html: true,
                content: errorMessage,
                placement: 'top',
                trigger: 'manual'
            });
            this.Element.popover('show');
        }, 300);
        this.Element.trigger("cs.TextAreaLimitation", ["invalid"]);

    };
} 