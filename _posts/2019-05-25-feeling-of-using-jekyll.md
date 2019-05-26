---
layout: post
title: feeling of using jekyll
date: 2019-05-25 22:43 -0400
author: Chauncy
category: word
tags:
image:
---

## Praises
Well support for github pages, easy deployment.  
Structure is well designed, everything is well modularized.  

## Complains
It's not convenient to create a new post.  

There are no builtin command helping with generate a new post template. In order to have date and time information, I have to manually specific date, hour and minute in the front matter. I cannot believe it : ).  
Fortunately, there is a gem called `Jekyll::Compose` could help with this. After bundle, just type `$ bundle exec jekyll post "My New Post"` and you are all set, a template with time information will be generated.  

Since the generated time includes the timezone information, it should be able to displayed properly. However, in github pages, the time is automatically transformed into UTC, wtf..?
The solution is to add `timezone: America/New_York` in the yaml config file. But..what if I'm moving to another country?  
