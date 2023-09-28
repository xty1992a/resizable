## Install
`pnpm i @redbuck/resizable`

## Use
```html

<div id="box">
<!-- use data-effect to make element be drag-handler -->
    <div class="child resize-item" data-effect="start.x,start.y,end.x,end.y">
        <span class="move-rect move-rect-tl" data-effect="start.x,start.y"></span>
        <span class="move-rect move-rect-tr" data-effect="end.x,start.y"></span>
        <span class="move-rect move-rect-rb" data-effect="end.x,end.y"></span>
        <span class="move-rect move-rect-lb" data-effect="start.x,end.y"></span>

        <span class="move-line move-line-top" data-effect="start.y"></span>
        <span class="move-line move-line-bottom" data-effect="end.y"></span>
        <span class="move-line move-line-left" data-effect="start.x"></span>
        <span class="move-line move-line-right" data-effect="end.x"></span>
    </div>
</div>

<script type="module">
    import Resizable from 'to/path'
    
    const resizer = new Resizable('#box')
    
    resizer.on('effect', console.log)
</script>

```