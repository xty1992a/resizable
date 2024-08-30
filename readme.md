## Install
`pnpm i @redbuck/resizable`

## Usage

[Live Demo](https://codepen.io/xty1992a/pen/KKjxKwq)


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

<!-- linking default style and of course you can modify it-->
<link rel="stylesheet" href="../dist/index.css">

<script type="module">
    import Resizable from '../dist/es/index.js'
    
    const resizer = new Resizable('#box')
    
    resizer.on('effect', console.log)
</script>

```


## API

### options
| Method  | Description                                                                                      | default                                                                  |
| ----- |--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| container | The container element or selector                                                                | -                                                                        |
| itemClassName | Which child element under el will effect                                                         | resize-item                                                              |
| effectManual | Should resizer instance effect dom manual                                                        | false                                                                    |
| getItemOnStart | When drag start, carry the touched element call this function to get which item should be effect | find ancestors(include self) which one`s classList contain itemClassName |
| getEffectOnStart | When drag start, carry the touched element call this function to get effect in this drag         | el => el.dataset.effect.split(',')                                       |
| getPointsOnStart | When drag start, carry the touched element call this function to get initial points in this drag | Resizable.getPoints                                       |
| listenerFactory | You can use this option to provide your own Listener                                             | web-listener                                                |

### events
| Method  | Description                                              |
| ----- |----------------------------------------------------------|
| effect | Emitted when drag move , carry the target and it`s shape |
