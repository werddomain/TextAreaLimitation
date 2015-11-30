var TextAreaLimitation = (function () {
    function TextAreaLimitation(Element, param) {
        this.Element = Element;
        this.param = param;
        if (Element.length > 1) {
            Element.each(function (index, element) {
                var d = new TextAreaLimitation($(element));
            });
        }
        else {
            this.textArea = this.Element[0];
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
    TextAreaLimitation.prototype.registerEvents = function () {
        var _this = this;
        var KeyUpCancelText = null;
        this.Element.keydown(function (e) {
            if (e.ctrlKey)
                return;
            if (e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18)
                return;
            if (e.keyCode === 8)
                return;
            var lines = _this.getInfo();
            var linesValidation = _this.validateLinesLenght(lines, false, e.keyCode);
            var valide = true;
            if (!linesValidation)
                valide = false;
            if (e.keyCode !== 13) {
                var valideText = _this.validateText(false, lines);
                if (!valideText)
                    valide = false;
            }
            if (!valide) {
                KeyUpCancelText = _this.Element.val();
                setTimeout(function () {
                    //run this in a timeout to prevent wait to long before returning the false.
                    //here if we wait to long, the keydown is not canceled.
                    _this.Element.trigger("cs.TextAreaLimitation.KeyDownCanceled", ["valid"]);
                    if (_this.param.onKeyDownCanceled != null && $.isFunction(_this.param.onKeyDownCanceled))
                        _this.param.onKeyDownCanceled.call(_this.Element);
                }, 100);
                e.preventDefault();
                e.returnValue = false;
                //alert('KeyDown cancelled');
                return false;
            }
        });
        this.Element.keyup(function (e) {
            //A hack for mobile. Some mobile dont take the cancel on keyDown
            if (KeyUpCancelText != null && _this.Element.val() != KeyUpCancelText)
                _this.Element.val(KeyUpCancelText);
            KeyUpCancelText = null;
        });
        this.Element.change(function () {
            var lines = _this.getInfo();
            var linesValidation = _this.validateLinesLenght(lines, true);
            if (!linesValidation) {
                _this.displayLinesExceedError(lines.length);
                return;
            }
            var text = _this.validateText(true, lines);
            if (text && linesValidation)
                if (_this.isInError) {
                    _this.Element.trigger("cs.TextAreaLimitation.Invalid", ["valid"]);
                    if (_this.param.onInvalid != null && $.isFunction(_this.param.onInvalid))
                        _this.param.onInvalid.call(_this.Element, "valid");
                    _this.Element.removeClass("cs-invalid");
                    _this.isInError = false;
                    _this.formGroup.removeClass('has-error');
                    _this.Element.popover('hide');
                }
        });
    };
    TextAreaLimitation.prototype.setDefaultValues = function () {
        if (this.param == null)
            this.param = {
                lang: 'en',
                maxCharPerLines: null,
                maxLines: null,
                popOverPosition: 'top'
            };
        else {
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
    };
    TextAreaLimitation.prototype.hasData = function (Data) {
        if (typeof this.Element.data(Data) !== 'undefined')
            return true;
        return false;
    };
    TextAreaLimitation.prototype.getLineNumber = function () {
        return this.textArea.value.substr(0, this.textArea.selectionStart).split("\n").length;
    };
    TextAreaLimitation.prototype.validateText = function (isFromChange, info) {
        if (this.param.maxCharPerLines == null)
            return true;
        var l = 0;
        var currentLine = this.getLineNumber() - 1;
        for (var i = 0; i < info.length; i++) {
            l = info[i].length;
            if (!isFromChange && l + 1 > this.param.maxCharPerLines && currentLine == i) {
                //alert("max text reach");
                return false;
            }
            if ((isFromChange && l > this.param.maxCharPerLines)) {
                //alert("max text reach");
                this.isInError = true;
                this.formGroup.addClass('has-error');
                this.Element.addClass("cs-invalid");
                this.displayErrorLenghtMessage(i, info[i]);
                return false;
            }
        }
        return true;
    };
    ;
    TextAreaLimitation.prototype.validateLinesLenght = function (lines, isFromChange, keypress) {
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
    ;
    TextAreaLimitation.prototype.getInfo = function () {
        var val = this.Element.val();
        var lines = val.split('\n');
        return lines;
    };
    ;
    TextAreaLimitation.prototype.displayErrorLenghtMessage = function (lineNumber, lineText) {
        var _this = this;
        if (this.param.usePopOver) {
            var errorMessage = "";
            if (this.param.lang == "fr") {
                errorMessage = "Chaque ligne ne doit pas dépasser " + this.param.maxCharPerLines + " caractères par ligne.<br />La ligne " + (lineNumber + 1) + " dépasse ce maximum. Elle a " + lineText.length + " caractères.<br / ><blockquote><p>" + lineText + "</p><footer>" + (this.param.maxCharPerLines - lineText.length) + " caractères de trop.</foorter></blockquote>";
            }
            else {
                errorMessage = "Each line must not exceed " + this.param.maxCharPerLines + " characters per line.<br /> Line " + (lineNumber + 1) + " exceeds this maximum.It has " + lineText.length + " characters.<br / ><blockquote><p>" + lineText + "</p><footer>It exceed this limit by " + (this.param.maxCharPerLines - lineText.length) + ".</foorter></blockquote>";
            }
            this.Element.popover('destroy');
            setTimeout(function () {
                _this.Element.popover({
                    html: true,
                    content: errorMessage,
                    placement: _this.param.popOverPosition,
                    trigger: 'manual'
                });
                _this.Element.popover('show');
            }, 300);
        }
        this.Element.trigger("cs.TextAreaLimitation.Invalid", ["invalid"]);
        this.Element.trigger("cs.TextAreaLimitation.InvalidLineLength", [lineNumber, lineText]);
        if (this.param.onInvalid != null && $.isFunction(this.param.onInvalid))
            this.param.onInvalid.call(this.Element, "invalid");
        if (this.param.onInvalidLineLength != null && $.isFunction(this.param.onInvalidLineLength))
            this.param.onInvalidLineLength.call(this.Element, lineNumber, lineText);
    };
    ;
    TextAreaLimitation.prototype.displayLinesExceedError = function (lineCount) {
        var _this = this;
        if (this.param.usePopOver) {
            var errorMessage = "";
            if (this.param.lang == "fr") {
                errorMessage = "Vous devez entrer un maximum de " + this.param.maxLines + " lignes.<br />Votre texte  contient " + lineCount.toString() + " lignes.";
            }
            else {
                errorMessage = "You must enter a maximum of " + this.param.maxLines + " lines. Your text contains " + lineCount.toString() + " lines.";
            }
            this.Element.popover('destroy');
            setTimeout(function () {
                _this.Element.popover({
                    html: true,
                    content: errorMessage,
                    placement: _this.param.popOverPosition,
                    trigger: 'manual'
                });
                _this.Element.popover('show');
            }, 300);
        }
        this.Element.trigger("cs.TextAreaLimitation.Invalid", ["invalid"]);
        this.Element.trigger("cs.TextAreaLimitation.InvalidLines", [lineCount]);
        if (this.param.onInvalid != null && $.isFunction(this.param.onInvalid))
            this.param.onInvalid.call(this.Element, "invalid");
        if (this.param.onInvalidLines != null && $.isFunction(this.param.onInvalidLines))
            this.param.onInvalidLines.call(this.Element, lineCount);
    };
    ;
    return TextAreaLimitation;
})();
//# sourceMappingURL=TextAreaLimitation.js.map