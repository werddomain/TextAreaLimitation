# TextAreaLimitation
Provide helper to limit text input in Html TextArea.
This helper allow to limit text lenght per line and the total number of line.
It cancel user input if the current line exceed the maximum and popup validation error(as a popover) if the user paste text.

## [JsFidler](http://jsfiddle.net/werddomain/6eaa6bfu/)

## Dependencies
- [jQuery](https://github.com/jquery/jquery) (1.6+)
- [Bootstrap 3](https://github.com/twbs/bootstrap) (For error display)

## Usage
```
<textarea class="TextAreaLimitation" data-maxlines="5" data-charperline="10"></textarea>
<script src="/Scripts/TextAreaLimitation.js"></script>
<script>
    $(function () {
        var element = $('.TextAreaLimitation');
        var t = new TextAreaLimitation(element, {lang: 'fr'}); //French
        var t2 = new TextAreaLimitation(element); //English
        element.on('cs.TextAreaLimitation', function(state){
            if (state == 'valid')
            {
                //state pass from invalid to valid
            }
            if state == 'invalid')
            {
                //state of textArea is invalid
            }
        });
        t.maxLines = 10; //You can change rules without re-initialise it.
    });
</script>
```
## Property
property can be acceded by the object returned by the instance:
```
var t = new TextAreaLimitation(element);
t.propertyName = 'myValue';
```
|Property |Type |Default Value |Description | 
|:----|----|----|----:|
|param |ITextAreaLimitationOption | null| Caraters per lines.<br/> If null, the rule do not aply.|
|isInError |boolean | null| Get if the current state is in error.|
|formGroup |JQuery | n/a| Get the form-group container.|
|textArea |HTMLTextAreaElement | n/a| Get the current textArea element.|

## Parameters (ITextAreaLimitationOption)
Parameters can be changed after initialize
```
var t = new TextAreaLimitation(element,{lang: 'fr'});
t.param.lang = 'en';
```
### TypeScript definition
```
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
```
### List of parameters
|Name |Data |Type |Default Value |Description | 
|:----|----|----|----|----:|
|maxLines |data-maxlines |number | null| Max Lines.<br/>If null, the rule do not aply.|
|maxCharPerLines |data-maxcharperlines |number | null| Caraters per lines.<br/> If null, the rule do not aply.|
|popOverPosition | data-popoverposition | string | 'top'| The [bootstrap popover](http://getbootstrap.com/javascript/#popovers-options) placement parameter.|
|lang | data-lang |string | 'en'| Set the lang for the display message.|
|usePopOver | data-usepopover |boolean | true| If false, the popOver will not be displayed on validation error|
|onInvalid | n/a |function | null| On validation Error <br/> [info](#invalid)|
|onInvalidLineLength | n/a |function | null| On validation Error in a line length<br/> [info](#invalidlinelength)|
|onInvalidLines | n/a |function | null| On validation Error in total lines<br/> [info](#invalidlines)|

## Events
All event set the ```this``` to the current TextArea
### Invalid
Throw when validation state change.<br/>
Parameters: 
- state: string ('valid' or 'invalid')

<b>in param:</b>
```
{
    onInvalid: function(state){
        if (state == 'valid')
            {
                //state pass from invalid to valid
            }
            if (state == 'invalid')
            {
                //state of textArea is invalid
            }
    }
}
```
<br/><b>JQuery event:</b><br/>
``` element.on('cs.TextAreaLimitation.Invalid', function(event, state){ }; ```

### InvalidLineLength
Throw when a line exceed the maximum text length.<br/>
Parameters: 
- lineNumber : number (the line number of the failed text length [0 based])
- lineText : string (the text)

<b>in param:</b>
```
{
    onInvalidLineLength: function(lineNumber, lineText){
    }
}
```
<b>JQuery event:</b><br/>
``` element.on('cs.TextAreaLimitation.InvalidLineLength', function(event, lineNumber, lineText){ }; ```

### InvalidLines
Throw when the total line exceed the maximum alowed.<br/>
Parameters: 
- lineCount: number (current line count)

<b>in param:</b>
```
{
    onInvalidLines: function(lineCount){
    }
}
```
<b>JQuery event:</b>
``` element.on('cs.TextAreaLimitation.InvalidLines', function(event, lineCount){ }; ```

## Note
If textarea is not in a form-group container, it will be added.
```
<textarea class="TextAreaLimitation" data-maxlines="5" data-charperline="10"></textarea>
```
will be replaced by:
```
<div class='form-group'>
    <textarea class="TextAreaLimitation form-control" data-maxlines="5" data-charperline="10"></textarea>
</div>
```

## Validation
When the text inside the text area is invalid:
- The textarea will have the `cs-invalid` class.
- The textarea will throw the `cs.TextAreaLimitation` event.
- The form-group container will have the `has-error` class.

## license
This code is free to use, under the MIT license
