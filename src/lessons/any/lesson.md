## Winner takes it all 🏆

Sometimes we can have lots of Promises which all do a similar thing, like getting the times for a movie from lots of different cinemas. If we want to get the result *as soon as possible*, we can use `Promise.any()` to wait for the first of many Promises to complete.

```
await Promise.any([promise1, promise2, promise3]);
```

In this snippet, we've given `Promise.any()` an **array** of promises (just like in the last lesson!). We now have the opposite problem to the last lesson... we don't know which promise will finish first!

`Promise.any()` combines all of these promises into one promise we can wait for. As soon as **any** promise in the array has completed, the promise will resolve, giving us the result of the promise which finished first.

---

#### Your mission 🚀

Time to take to the skies! A parrot 🦜, an eagle 🦅 and an owl 🦉 are having a race against each other, and no-one knows who's going to finish first (it'll be different each time you run your code 😉). Use what you know about `Promise.any()` to throw a celebration for the winning bird!
