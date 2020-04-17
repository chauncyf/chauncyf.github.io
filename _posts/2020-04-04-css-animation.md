---
layout: post
title: CSS Animation
date: 2020-04-04 23:02 -0400
author: Chauncy
category: word
tags: 
image: 
published: true
---

Spent whole day study css animation..  <hide>强迫症真的不能搞前端..绝对会猝死..</hide>


Designed ~~awesome~~ animation for the portfolio page, [take a look 🙆‍♂️](https://chauncyf.github.io/)

--- 
Added smooth scroll to anchor effect:  

actually, single line of code needed (not support by Safari though)
```css
    html {
      scroll-behavior: smooth;
    }
```

--- 
Added page on load fade in effect:

- first, set the visibility of the div to hidden, opacity to 0, also don't forget to add transition for opacity
```css
    .container-fade-in {
      visibility: hidden;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }
```
- when the page is loaded, set the visibility of that div to visible, opacity to 1 
```javascript
    $(window).on('load', function () {
        $('.container-fade-in').css({
            visibility: 'visible',
            opacity: 1,
        })
    });
```

That's it! Enjoy the smooth page fade in effect 🥳