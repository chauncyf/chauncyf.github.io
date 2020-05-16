---
layout: post
title: JavaScript & Closure
date: 2020-04-18 14:37 -0400
author: Chauncy
category: blog
tags: [coding, frontend, javascript]
published: true
---

Say, I wanted to use a progressbar to indicate the loading of images.  

```html
<div class="progress" id="progressbar">
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
</div>

<div class="card-columns">
    <img src=".." alt=".." onload="callback()">
    <img src=".." alt=".." onload="callback()">
        ...
    <img src=".." alt=".." onload="callback()">
</div>
```

Basic idea:  
1. first get number of total images in the container(card-columns) 
2. each time an image is loaded, use the onload callback to update the progressbar

<br>

What first comes to my mind is that, how to design the callback method.

Surely yes I can put the counter of total images and loaded images as an global variable, and use the callback method to increase the counter.  
In this way, we end up with something like this:
```html
<script>
    let loaded = 0;
    let total = $('.card-columns img').length;

    function updateProgressbar() {
        $('#progressbar .progress-bar').css('width', `${++loaded * 100 / total}%`);
    }
</script>
```

Will this work? Yes!  
Is this elegant enough? No!  
There are global variables in the wild, I don't like this.  
How can I improve it?  

<br>

Suddenly, the closure jumped out of my mind. Isn't this a perfect place to use it?
> A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function’s scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.


Let's define a _Self-Executing Anonymous Function_ called progressbar:
```html
<script>
    let progressbar = (function () {
        let loaded = 0;
        let total = $('.card-columns img').length;

        function update() {
            $('#progressbar .progress-bar').css('width', `${++loaded * 100 / total}%`);
        }

        return function () {
            update();
        }
    })();
</script>
```

After the function is initialized, the internal variables will keep private from outside.  
Each time when we call the `progressbar()`, the returned internal `update()` will be executed.  
By doing this, global variables are avoided. cheers! 🍻

<br>

Below is what the final version looks like.
```html
<script>
    let progressbar = (function () {
        let loaded = 0;
        let total;
        $(() => {
            total = $('.card-columns img').length;
        });

        return {
            update: () => {
                $('#progressbar .progress-bar').css('width', `${++loaded * 100 / total}%`);
            },
            hide: () => {
                $('#progressbar').hide();
            }
        }
    })();

    $(window).on('load', function() {
        progressbar.hide();
    });
</script>

<div class="progress" id="progressbar">
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
</div>

<div class="card-columns">
    <img src=".." alt=".." onload="progressbar.update()">
    <img src=".." alt=".." onload="progressbar.update()">
        ...
    <img src=".." alt=".." onload="progressbar.update()">
</div>
``` 

<br>

Ref: 
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [https://getbootstrap.com/docs/4.4/components/progress](https://getbootstrap.com/docs/4.4/components/progress)