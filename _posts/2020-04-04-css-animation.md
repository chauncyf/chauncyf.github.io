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

研究了一整天animation..我的肝好疼..  
强迫症真的不能搞前端..绝对会猝死..


先给about页面加上了非常酷炫的动画（x)，[看一眼🙆‍♂️](https://chauncyf.github.io/)


然后给anchor link加上了smooth scroll，其实只需要加上一行css就行（safari不支持..不管了）：  
```css
    html {
      scroll-behavior: smooth;
    }
```

最后给photo页面做了on load fade in效果：  
- 先把放图片<div>的visibility设为hidden，opacity设为0
```css
    .card-columns {
        visibility: hidden;
        opacity: 0;
    }
```
- 当页面加载完毕之后，用jquery去把opacity改成1，同时加上traisition
```javascript
    $(window).on('load', function () {
        $('.card-columns').css({
            visibility: 'visible',
            opacity: 1,
            transition: 'opacity 1s ease-in-out'
        })
    });
```

这样就可以实现非常顺滑的页面fade in效果了🥳