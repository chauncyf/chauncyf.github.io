---
layout: post
title: Promise & Deferred
date: 2020-04-09 15:48 -0400
author: Chauncy
category: code
tags: 
image: 
published: false
---

为了优雅的实现一连串的动画效果

实现一连串的事件最好的方法就是callback，当一个动画完成了之后callback去执行下一个动画





之前使用setTimeout()的时候，第一个参数如果传d.resolve()话timeout并没有执行，必须去掉括号写成d.resolve
```javascript
    setTimeout(d.resolve(), 1000);  // 🙅‍♂
    setTimeout(d.resolve, 1000);  // 🙆‍♂
```
研究了文档之后发现setTimeout()第一个参数是function，推测resolve不加括号的时候是把resolve这个方法传进去，而加了的时候就是单纯的function call了。

Correct version:
```javascript
    setTimeout(() => d.resolve(), 1000);
```
