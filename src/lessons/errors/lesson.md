## When things go wrong 💥

As with anything, sometimes Promises don't work out the way we hoped. When an error happens, we say that the Promise has `rejected`.  

We can handle any rejections that happen when `await`ing a Promise by wrapping it in a try-catch block. This is just like handling any other errors in JavaScript.

```
try {
    await jobThatWillFail();
} catch (error) {
    // Handle the error
}
```

When not using `await`, we can add a callback function to handle a rejected promise using the `catch()` method on the Promise object.

```
jobThatWillFail().catch(function (error) {
    // Handle the error
});
```

---

#### Your mission 🚀

A mischievous mouse 🐭 has been running around the house all day, and Tigger the cat 😺 has been trying to catch it. Write a short program for the cat to run to the mouse and catch it.  
> ❗️ Watch out for the mouse escaping! We've given you a try-catch block to get started.
