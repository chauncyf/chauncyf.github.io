---
layout: post
title: Promise & Deferred
date: 2020-04-09 15:48 -0400
author: Chauncy
category: blog
tags: [coding, frontend, javascript]
published: true
---

_Implementing a series of chained operations_


## What are Promise and Deferred?

> A **deferred** object is an object that can create a promise and change its state to **resolved** or **rejected**. Deferreds are typically used if you write your own function and want to provide a promise to the calling code. You are the **producer** of the value.
  
> A **promise** is, as the name says, a promise about future value. You can attach callbacks to it to get that value. The promise was "given" to you and you are the **receiver** of the future value.
  You cannot modify the state of the promise. Only the code that created the promise can change its state.
> ![promise](https://media.prod.mdn.mozit.cloud/attachments/2018/04/18/15911/32e79f722e83940fdaea297acdb5df92/promises.png){:.img-fluid}

```javascript
function promiseDemo() {
    let d = $.Deferred();  // create a Deferred object with jQuery

    console.log(d.state());  // 'pending'

    if ('success') {
        d.resolve();
        console.log(d.state());  // 'resolved'
    } else {
        d.reject();
        console.log(d.state());  // 'rejected'
    }

    return d.promise();  // return a Promise object for future operations
}
```

## How to use them?

Let's see how to do some simple mathematical operations with Promise:
```javascript
function input(number) {
    return $.Deferred(function (d) {
        d.resolve(number);  // resolve '9'
    }).promise();
}

function plusOne(input) {
    return $.Deferred(function (d) {
        setTimeout(() => d.resolve(input + 1), 50);  // resolve '10' after 50ms
    }).promise();
}

function square(input) {
    return $.Deferred(function (d) {
        setTimeout(() => d.resolve(input * input), 100);  // resolve '100' after 100ms
    }).promise();
}

function printResult(input) {
    console.log('Result: ' + input);
}

input(9).then(plusOne).then(square).then(printResult);  // 'Result: 100'
```

<br>

We can also create with a simple sleep function to make ordinary function chainable: 
```javascript
function sleep(time) {
    let d = $.Deferred();
    setTimeout(() => d.resolve(`Sleep for ${time}ms`), time);
    return d.promise();
}

(() => {
    console.log('Start sleeping');
    return sleep(100);
})()
    .then((msg) => {
        console.log(msg);
        return sleep(200);
    })
    .then((msg) => {
        console.log(msg);
    });

// Start sleeping
// Sleep for 100ms
// Sleep for 200ms
```

## References

- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [https://stackoverflow.com/questions/17308172/deferred-versus-promise](https://stackoverflow.com/questions/17308172/deferred-versus-promise)
- [https://maori.geek.nz/jquery-promises-and-deferreds-i-promise-this-will-be-short-d10275f82717](https://maori.geek.nz/jquery-promises-and-deferreds-i-promise-this-will-be-short-d10275f82717)
- [https://www.liaoxuefeng.com/wiki/1022910821149312/1023024413276544](https://www.liaoxuefeng.com/wiki/1022910821149312/1023024413276544)