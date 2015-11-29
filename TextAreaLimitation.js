var TextAreaLimitation = (function () {
    function TextAreaLimitation(Element, lang) {
        var _this = this;
        if (lang === void 0) { lang = 'en'; }
        this.Element = Element;
        this.lang = lang;
        if (Element.length > 1) {
            Element.each(function (index, element) {
                var d = new TextAreaLimitation($(element));
            });
        }
        else {
            this.textArea = this.Element[0];
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
            Element.keydown(function (e) {
                if (e.ctrlKey)
                    return;
                if (e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18)
                    return;
                if (e.keyCode === 8)
                    return;
                var lines = _this.getInfo();
                var linesValidation = _this.validateLinesLenght(lines, false, e.keyCode);
                if (!linesValidation)
                    return false;
                if (e.keyCode !== 13)
                    return _this.validateText(false, lines);
            });
            Element.change(function () {
                var lines = _this.getInfo();
                var linesValidation = _this.validateLinesLenght(lines, true);
                if (!linesValidation) {
                    _this.displayLinexExceedError(lines.length);
                    return;
                }
                var text = _this.validateText(true, lines);
                if (text && linesValidation)
                    if (_this.isInError) {
                        _this.Element.trigger("cs.TextAreaLimitation", "valid");
                        _this.isInError = false;
                        _this.formGroup.removeClass('has-error');
                        _this.Element.popover('hide');
                    }
            });
        }
    }
    TextAreaLimitation.prototype.hasData = function (Data) {
        if (typeof this.Element.data(Data) !== 'undefined')
            return true;
        return false;
    };
    TextAreaLimitation.prototype.getLineNumber = function () {
        return this.textArea.value.substr(0, this.textArea.selectionStart).split("\n").length;
    };
    TextAreaLimitation.prototype.validateText = function (isFromChange, info) {
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
                this.displayErrorLenghtMessage(i, info[i]);
                return false;
            }
        }
        return true;
    };
    ;
    TextAreaLimitation.prototype.validateLinesLenght = function (lines, isFromChange, keypress) {
        if (this.maxLines == null)
            return true;
        if (lines.length > this.maxLines)
            return false;
        if (keypress != null && keypress === 13 && lines.length + 1 > this.maxLines) {
            return false;
        }
        return true;
    };
    ;
    TextAreaLimitation.prototype.getInfo = function () {
        var val = this.Element.val();
        var lines = val.split('\n');
        return lines;
    };
    ;
    TextAreaLimitation.prototype.displayErrorLenghtMessage = function (lineNumber, lineText) {
        var _this = this;
        var errorMessage = "";
        if (this.lang == "fr") {
            errorMessage = "Chaque ligne ne doit pas dépasser " + this.maxCharPerLines + " caractères par ligne.<br />La ligne " + (lineNumber + 1) + " dépasse ce maximum. Elle a " + lineText.length + " caractères.<br / ><blockquote><p>" + lineText + "</p><footer>" + (this.maxCharPerLines - lineText.length) + " caractères de trop.</foorter></blockquote>";
        }
        else {
            errorMessage = "Each line must not exceed " + this.maxCharPerLines + " characters per line.<br /> Line " + (lineNumber + 1) + " exceeds this maximum.It has " + lineText.length + " characters.<br / ><blockquote><p>" + lineText + "</p><footer>It exceed this limit by " + (this.maxCharPerLines - lineText.length) + ".</foorter></blockquote>";
        }
        this.Element.popover('destroy');
        setTimeout(function () {
            _this.Element.popover({
                html: true,
                content: errorMessage,
                placement: 'top',
                trigger: 'manual'
            });
            _this.Element.popover('show');
        }, 300);
        this.Element.trigger("cs.TextAreaLimitation", "invalid");
    };
    ;
    TextAreaLimitation.prototype.displayLinexExceedError = function (lineCount) {
        var _this = this;
        var errorMessage = "";
        if (this.lang == "fr") {
            errorMessage = "Vous devez entrer un maximum de " + this.maxLines + " lignes.<br />Votre texte  contient " + lineCount.toString() + " lignes.";
        }
        else {
            errorMessage = "You must enter a maximum of " + this.maxLines + " lines. Your text contains " + lineCount.toString() + " lines.";
        }
        this.Element.popover('destroy');
        setTimeout(function () {
            _this.Element.popover({
                html: true,
                content: errorMessage,
                placement: 'top',
                trigger: 'manual'
            });
            _this.Element.popover('show');
        }, 300);
        this.Element.trigger("cs.TextAreaLimitation", "invalid");
    };
    ;
    return TextAreaLimitation;
})();
//# sourceMappingURL=TextAreaLimitation.js.map