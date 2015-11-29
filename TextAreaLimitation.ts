interface ITextAreaLimitationOption {
    popOverPosition?: string;
    onInvalid?(state: string): void;
    onInvalidLineLength?(lineNumber: number, lineText: string): void;
    onInvalidLines?(lineCount: string): void;
    usePopOver?: boolean;
    lang?: string;
    maxLines: number;
    maxCharPerLines: number;
}
class TextAreaLimitation {

    isInError: boolean;
    formGroup: JQuery;
    textArea: HTMLTextAreaElement;

    constructor(public Element: JQuery, public param?: ITextAreaLimitationOption) {

        if (Element.length > 1) {
            Element.each((index, element) => {
                var d = new TextAreaLimitation($(element));
            });
        }
        else {

            this.textArea = <HTMLTextAreaElement>this.Element[0];
            
            var parrent = Element.parent();
            if (parrent.hasClass('form-group') == false) {
                Element.wrap("<div class='form-group'></div>");
            }
            if (Element.hasClass('form-control') == false)
                Element.addClass('form-control');
            this.formGroup = Element.closest('.form-group');
            this.setDefaultValues();
            this.registerEvents();

        }

    }
    registerEvents() {
        this.Element.keydown((e) => {
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
        this.Element.change(() => {
            var lines = this.getInfo();
            var linesValidation = this.validateLinesLenght(lines, true);
            if (!linesValidation) {
                this.displayLinesExceedError(lines.length);
                return;
            }
            var text = this.validateText(true, lines);
            if (text && linesValidation)
                if (this.isInError) {
                    this.Element.trigger("cs.TextAreaLimitation.Invalid", ["valid"]);
                    if (this.param.onInvalid != null && $.isFunction(this.param.onInvalid))
                        this.param.onInvalid.call(this.Element, "valid");
                    this.Element.removeClass("cs-invalid");
                    this.isInError = false;
                    this.formGroup.removeClass('has-error');
                    this.Element.popover('hide');
                }
        });
    }
    setDefaultValues()
    {
        if (this.param == null)
            this.param = {
                lang: 'en',
                maxCharPerLines: null,
                maxLines: null,
                popOverPosition: 'top'

            };
        else
        {
            if (this.param.lang == null)
                this.param.lang = 'en';
            if (this.param.popOverPosition == null)
                this.param.popOverPosition = 'top';
        }
        if (this.hasData('maxlines'))
            this.param.maxLines = parseInt(this.Element.data('maxlines'));
        if (this.hasData('maxcharperlines'))
            this.param.maxCharPerLines = parseInt(this.Element.data('maxcharperlines'));
        if (this.hasData('popoverposition'))
            this.param.popOverPosition = this.Element.data('popoverposition');
        if (this.hasData('lang'))
            this.param.lang = this.Element.data('lang');
        if (this.hasData('usepopover'))
            this.param.usePopOver = ("" + this.Element.data('usepopover')).toLowerCase() == "true";

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
        if (this.param.maxCharPerLines == null)
            return true;
        var l = 0;
        var currentLine = this.getLineNumber() - 1;
        for (var i = 0; i < info.length; i++) {
            l = info[i].length;
            if (!isFromChange && l + 1 > this.param.maxCharPerLines && currentLine == i)
                return false;
            if ((isFromChange && l > this.param.maxCharPerLines)) {
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

        if (this.param.maxLines == null)
            return true;

        if ((lines.length > this.param.maxLines) || (keypress != null && keypress === 13 && lines.length + 1 > this.param.maxLines)) {
            if (isFromChange) {
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
        if (this.param.usePopOver) {
            var errorMessage = "";
            if (this.param.lang == "fr") {
                errorMessage = "Chaque ligne ne doit pas dépasser " + this.param.maxCharPerLines + " caractères par ligne.<br />La ligne " + (lineNumber + 1) + " dépasse ce maximum. Elle a " + lineText.length + " caractères.<br / ><blockquote><p>" + lineText + "</p><footer>" + (this.param.maxCharPerLines - lineText.length) + " caractères de trop.</foorter></blockquote>"
            }
            else {
                errorMessage = "Each line must not exceed " + this.param.maxCharPerLines + " characters per line.<br /> Line " + (lineNumber + 1) + " exceeds this maximum.It has " + lineText.length + " characters.<br / ><blockquote><p>" + lineText + "</p><footer>It exceed this limit by " + (this.param.maxCharPerLines - lineText.length) + ".</foorter></blockquote>";
            }
            this.Element.popover('destroy');
            setTimeout(() => {
                this.Element.popover({
                    html: true,
                    content: errorMessage,
                    placement: this.param.popOverPosition,
                    trigger: 'manual'
                });
                this.Element.popover('show');
            }, 300);
        }
        this.Element.trigger("cs.TextAreaLimitation.Invalid", ["invalid"]);
        this.Element.trigger("cs.TextAreaLimitation.InvalidLineLength", [lineNumber, lineText]);
        if (this.param.onInvalid != null && $.isFunction(this.param.onInvalid))
            this.param.onInvalid.call(this.Element, "invalid");

        if (this.param.onInvalidLineLength != null && $.isFunction(this.param.onInvalidLineLength))
            this.param.onInvalidLineLength.call(this.Element, lineNumber, lineText);


    };
    displayLinesExceedError(lineCount: number) {
        if (this.param.usePopOver) {

            var errorMessage = "";
            if (this.param.lang == "fr") {
                errorMessage = "Vous devez entrer un maximum de " + this.param.maxLines + " lignes.<br />Votre texte  contient " + lineCount.toString() + " lignes.";
            }
            else {
                errorMessage = "You must enter a maximum of " + this.param.maxLines + " lines. Your text contains " + lineCount.toString() + " lines.";
            }
            this.Element.popover('destroy');
            setTimeout(() => {
                this.Element.popover({
                    html: true,
                    content: errorMessage,
                    placement: this.param.popOverPosition,
                    trigger: 'manual'
                });
                this.Element.popover('show');
            }, 300);
        }
        this.Element.trigger("cs.TextAreaLimitation.Invalid", ["invalid"]);
        this.Element.trigger("cs.TextAreaLimitation.InvalidLines", [lineCount]);

        if (this.param.onInvalid != null && $.isFunction(this.param.onInvalid))
            this.param.onInvalid.call(this.Element, "invalid");

        if (this.param.onInvalidLines != null && $.isFunction(this.param.onInvalidLines))
            this.param.onInvalidLines.call(this.Element, lineCount);
    };
} 