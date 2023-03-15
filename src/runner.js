// Create a new class called Runner
class Runner {
    constructor() {
        // Create a Map of ID to callback functions
        this.callbacks = new Map();
        // Create a counter for the IDs
        this.id = 0;

        // Receive messages from the iframe
        window.addEventListener("message", (event) => {
            // Check the message came from the iframe
            if (event.source !== window.frames[0]) {
                return;
            }

            // Get the ID and type of the message
            const {id, type} = event.data;
            
            // If the message type is finished
            if (type == "finished") {
                // Get the callback function from the Map
                const callback = this.callbacks.get(id);
                // If the callback function exists
                if (callback) {
                    // Call the callback function
                    callback();
                }
                // Remove the callback function from the Map
                this.callbacks.delete(id);
            }
        });
    }

    // Create a method to test the code based on a tester script
    test(code, allowlist, tester) {
        // Extract the sequences of words from the code
        const sequences = this.extractSequences(code);
        // Compare the sequences to the allowlist
        const allowed = sequences.every(sequence => allowlist.includes(sequence));
        // If not all sequences are allowed
        if (!allowed) {
            // Fail the test
            return false;
        }

        // The test script can be used to provide more specific feedback about the code
        // Returns true if the code passes, otherwise throws an error
        return tester(code);
    }

    // Create a method to extract the sequences of letters and numbers from a string
    extractSequences(text) {
        // Create a regular expression to match sequences of letters and numbers
        const regex = /[a-zA-Z0-9]+/g;
        // Create an array to store the sequences
        const sequences = [];
        // Create a variable to store the result of the regular expression
        let result;

        // While there are still matches
        while ((result = regex.exec(text)) !== null) {
            // Add the match to the sequences array
            sequences.push(result[0]);
        }

        // Return the sequences array
        return sequences;
    }

    // Create a method to run the code
    run(code, runner) {
        return new Promise((resolve, reject) => {
            try {
                runner(code, (request, callback = null) => {
                    // If the request type is finished
                    if (request == "finished") {
                        // Resolve the promise
                        resolve();
                        return;
                    }

                    // Create a new ID for the request
                    const id = this.id++;
                    // Store the callback function in the Map
                    this.callbacks.set(id, callback);
                    // Send the request to the iframe
                    this.send(id, request);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // Send messages to the iframe
    send(id, type) {
        const iframe = document.querySelector("iframe");
        iframe.contentWindow.postMessage({id, type}, "*");
    }
}

// Create a new instance of the Runner class
const runner = new Runner();
// Export the runner to be used throughout the application
export default runner;