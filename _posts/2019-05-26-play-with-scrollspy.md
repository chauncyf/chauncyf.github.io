---
layout: post
title: Play With Scrollspy
date: 2019-05-26 04:12 -0400
author: Chauncy
category: 
tags: 
image: 
---

`人的本质是摸鱼`

果然搭博客一旦开工就停不下来了，仿佛回到了小时候折腾QQ空间的时光  

最近最想要的功能是做一个页面来看leetcode的笔记，github自带的markdown虽然看起来效果很好，但是很关键的是缺了左边的目录，看起来没那么方便，所以自己的网站上一定要加上这个功能  
白天把相册弄出来了，然后晚上本来准备刷题的，最后还是没忍住来弄笔记页面的左侧导航栏  

bootstrap带了一个scrollspy可以完美实现我的想法，然而做起来坑太多了  
研究了好久才好不容易让提供的example正确显示，心累


scrollspy的nested pills目前不能正常显示，还没找到原因  

bootstrap里面的提供的position只有fixed top, fixed bottom, sticky top。从名字上来看，并没有我想要的fixed left或者sticky left  
然后试了好久，比如在css里把左边的col设成`position: fixed`，但是这样的话整个row就完全乱了，col里的nav会overflow出来  
最后还是万能的stack overflow救了我，[Make column fixed position in bootstrap](https://stackoverflow.com/a/33187655/10308485)  
折腾这么久，没想到`sticky-top`其实就是我想要的效果。。。能不能好好取名了 `There are only two hard things in Computer Science` : )  
