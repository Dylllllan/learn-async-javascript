## Welcome! 👋

Welcome to this series of lessons to teach you all about asynchronous programming in JavaScript. First up, what is asynchronous programming, and why do we need it? 🤔  

If you've ever had to wait for something *long* to finish in your code, like a request to the Internet, that's what we call an asynchronous operation. We don't know when it'll finish, but we can keep doing other things while we wait. ⏳  

---

#### Callbacks 📞

> *ring ring*. Oh, you're busy? No worries, call me back when you're finished.

Like a friend who's busy, we can give an asynchronous operation a **callback function** for it to let us know when it's finished. Here's a quick example.  

```
jobThatTakesALongTime(callback);
```

In this snippet, `callback` is the name of a function which gets run when `jobThatTakesALongTime` finishes. We've given it to the `jobThatTakesALongTime` function as an argument.

---

#### Your mission 🚀

Every lesson has a scenario for you to solve with code! We'll give you functions and you can piece them together to make magical animations happen. ✨

In this one, we've got a frog 🐸 and a grasshopper 🦗 working together to catch a fly 🪰. Use what you know about callbacks to make the frog and grasshopper celebrate when they *finish* catching the fly. 🎉
