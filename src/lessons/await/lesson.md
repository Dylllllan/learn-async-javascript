## What if this was easier? 🤔

Using callback functions here and there is fine, but our code can get quickly get complicated when we've got *callbacks inside callbacks inside callbacks*. 😱

To make asynchronous programming in JavaScript easier, **Promises** were introduced. These represent an ongoing task, and can be either `pending` 🕑, `resolved` ✅ or `rejected` ❌. Promises can be returned to us from *asynchronous functions*, and we can even save them in variables to check later.

We can handle a Promise completing in two different ways. One way we can use Promises is by attaching a callback function, similar to what we did in the last lesson.
```
jobThatTakesALongTime().then(callback);
```

But we can often end up with the same problem where we *nest* callbacks inside each other. To make using Promises easier, two new keywords were introduced in JavaScript. These are **`async`** and **`await`**.  

```
async function runJob() {
    await jobThatTakesALongTime();
    callback();
}
```

Here's a quick example. 👀 When we put `async` at the start of a function, we make an *asynchronous function*. Asynchronous functions return a Promise *and* allow you to use the `await` keyword.  
When we put `await` before a Promise, our function will wait for the Promise to finish before continuing. This makes our code *much* easier to read.

---

#### Your mission 🚀

Mission control - we need you to start a countdown for the rocket so it knows when to launch! ⏱️ Use what you've learned about the `async` and `await` keywords to start a countdown of 5 seconds and launch the rocket ship when it finishes.

