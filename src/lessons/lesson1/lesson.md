## Welcome! 👋

Welcome to this series of lessons to teach you all about asynchronous programming in JavaScript. First up, what on earth is asynchronous programming, and why do we need it? 🤔  

If you've ever had to wait for something long-running to finish in your code, like a request to the Internet, that's what we call an asynchronous operation. We don't know when it'll finish, but we can keep doing other things while we wait. ⏳  

---

#### Callbacks

When we start an asynchronous operation, we can give it a bit of code called a **callback function** for it to let us know when it's done. 📞  
In this snippet, we give `callback` as an argument to the `jobThatTakesALongTime` function, and it'll run the `callback` function once it's finished.  
```
jobThatTakesALongTime(callback);
```

---

#### Your task

Each of these lessons has a little animation which you get to control with code. This way, you can see exactly what happens when your code runs. 👀  

In this lesson, we've got a frog 🐸 and a grasshopper 🦗 who are working together to catch a fly 🪰. Using your code, make it so the frog and grasshopper celebrate when they finish catching the fly! 🎉 Press **Next** to reveal the scene and start coding.
