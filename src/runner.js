import editor from "./editor";

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
        // Check for syntax errors in the editor
        if (editor.hasSyntaxErrors()) {
            // Return an error message
            return {"success": false, "message": "There's something wrong with your code. Please check the syntax errors in the editor and try again."};
        }

        // Extract the sequences of words from the code
        const sequences = this.extractSequences(code);
        // Compare the sequences to the allowlist
        const allowed = sequences.every(sequence => allowlist.includes(sequence));
        // If not all sequences are allowed
        if (!allowed) {
            // Find the first sequence that isn't allowed
            const sequence = sequences.find(sequence => !allowlist.includes(sequence));
            // Return an error message
            return {"success": false, "message": `The word "${sequence}" isn't allowed. Please edit your code and try again.`};
        }

        // If a test function is provided, it can be used to provide more specific feedback about the code
        // Returns a success message if the code passes, otherwise returns an error message
        if (tester) {
            return tester(code);
        }
        // If no test function is provided, return a success message
        return {"success": true};
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
    run(code, runner, timeout) {
        // Store the sequence of requests in an array
        const events = [];
        // Create a flag for whether the code has finished running
        let finished = false;

        // Create a new Promise that resolves when the timeout is reached
        const timeoutPromise = new Promise((resolve) => setTimeout(
            () => 
                // Resolve the promise with an error message and the events that were run
                // In most cases, this will be overriden by feedback based on the events
                resolve({
                    "success": false,
                    "message": "Timeout! Your code took too long to run. Make sure it follows the instructions and then try again.",
                    "events": events
                }),
            timeout));

        // Create a new Promise that resolves when the code is run or an error occurs
        const codePromise = new Promise((resolve) => {
            try {
                runner(code, (request, callback = null, data = null, addDataToEvent = false) => {
                    // If the code has finished running
                    if (finished) {
                        // Return to stop the code from running 
                        return;
                    }

                    // Create an event name constant including the request name and any data
                    const eventName = `${request}${addDataToEvent ? ";" + data : ""}`;

                    // Add the request and data to the events array
                    events.push(eventName);

                    // If the request type is error
                    if (request == "error") {
                        // Resolve the promise with an error message and the events that were run
                        // This is provided by the runner and should be human-readable
                        resolve({"success": false, "message": data, "events": events});
                        return;
                    }

                    // If the request type is finished
                    if (request == "finished") {
                        // Resolve the promise with a success message and the events that were run
                        resolve({"success": true, "events": events});
                        // Set the finished flag to true
                        finished = true;
                        // Return to stop the code from running
                        return;
                    }

                    // Create a new ID for the request
                    const id = this.id++;

                    // Store the callback function in a wrapper which logs when the event is finished
                    this.callbacks.set(id, () => {
                        events.push(`finished;${eventName}`);
                        if (callback) {
                            callback();
                        }
                    });

                    // Send the request to the iframe
                    this.send(id, request, data);
                });
            } catch (error) {
                // Resolve the promise with the error message 
                resolve({"success": false, "message": `An unexpected error occurred: ${error.message}`, "events": events});
            }
        });

        // Return a Promise that resolves when either the timeout or code Promise resolves
        return Promise.any([timeoutPromise, codePromise]);
    }

    // Send messages to the iframe
    send(id, type, data = null) {
        const iframe = document.querySelector("iframe");
        iframe.contentWindow.postMessage({id, type, data}, "*");
    }

    // Create a method to compare the events that were run to the expected
    compareEvents(events, expectedEvents) {
        // Create a pointer to the current event in the events array
        let currentEvent = 0;
        // Create a deep copy of the expected events array
        const expected = JSON.parse(JSON.stringify(expectedEvents));

        // Loop through the expected events
        for (let i = 0; i < expected.length; i++) {
            // If the expected event is an array
            if (Array.isArray(expected[i])) {
                // While the expected event is a non-empty array
                while (expected[i].length > 0) {
                    // If the current event pointer exceeds the length of the events array
                    if (currentEvent >= events.length) {
                        // Return false as there are no more events to check
                        return false;
                    }
                    
                    // If the current event is in the array
                    if (expected[i].includes(events[currentEvent])) {
                        // Remove the event from the array
                        expected[i].splice(expected[i].indexOf(events[currentEvent]), 1);

                        // Move to the next event
                        currentEvent++;
                    } else {
                        // Return false if the event is not in the array
                        return false;
                    }
                }
            } else {
                // Otherwise, check if the current event matches the expected event

                // If the current event pointer exceeds the length of the events array
                if (currentEvent >= events.length) {
                    // Return false as there are no more events to check
                    return false;
                }

                if (events[currentEvent] != expected[i]) {
                    // Return false if the events do not match
                    return false;
                }

                // If the events match, move to the next event
                currentEvent++;
            }
        }

        // If the current event pointer is less than the length of the events array
        if (currentEvent < events.length) {
            // Return false as there are more events than expected
            return false;
        }

        // Return true if all events match the expected events
        return true;
    }
}

// Create a new instance of the Runner class
const runner = new Runner();
// Export the runner to be used throughout the application
export default runner;