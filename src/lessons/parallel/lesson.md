## Speeding things up ⏱️

It's a bit slow to run everything one at a time, right? How do we know when all of our promises have finished? Introducing... `Promise.all()`!

```
await Promise.all([promise1, promise2, promise3]);
```

In this snippet, we've given `Promise.all()` an **array** of promises. Each of these promises could take any amount of time to complete, and we don't know which will finish last so we can continue with our program.  

`Promise.all()` combines all of these promises and gives us one we can wait for. Once **all** of the promises in the array have completed, the promise will resolve, giving us an array of the results, and we can then continue with our program.

---

#### Your mission 🚀

It's delivery day in Promisetown, but despite the town having five different trucks, it's taking a really long time for everyone to get their package. Use what you know about `Promise.all()` to run all deliveries at once. Don't forget to *wait* for them to finish!
