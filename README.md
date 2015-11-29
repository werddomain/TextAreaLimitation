# TextAreaLimitation
Provide helper to limit text input in Html TextArea.
This helper allow to limit text lenght per line and the total number of line.
It cancel user input if the current line exceed the maximum and popup validation error(as a popover) if the user paste text.


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
        var t = new TextAreaLimitation(element, 'fr'); //French
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
|Property |Data |Type |Default Value |Description | 
|:----|----|----|----|----:|
|maxLines |data-maxlines |number | null| Max Lines, if null rule do not aply|
|maxCharPerLines |data-charperline |number | null| Caraters per lines, if null rule do not aply|
|isInError | n/a|boolean | null| Get if the current state is in error|
|formGroup | n/a|JQuery | n/a| Get the form-group container|
|textArea | n/a|HTMLTextAreaElement | n/a| Get the current textArea element|


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

