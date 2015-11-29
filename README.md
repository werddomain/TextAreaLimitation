# TextAreaLimitation
Provide helper to limit text input in Html TextArea

## Dependencies:
- [jQuery](https://github.com/jquery/jquery) (1.6+)
- [Bootstrap 3](https://github.com/twbs/bootstrap) (For error display)

## Usage :
```
<textarea class="TextAreaLimitation" data-maxlines="5" data-charperline="10"></textarea>
<script src="/Scripts/TextAreaLimitation.js"></script>
<script>
    $(function () {
        var t = new TextAreaLimitation($('.TextAreaLimitation'));
    });
</script>
```
