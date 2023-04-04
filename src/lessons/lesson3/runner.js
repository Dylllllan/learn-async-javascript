export default (code, request) => {
    // e.g. request(messageName, callbackFunction);

    function runToMouse() {
        return new Promise((resolve) => request("runToMouse", resolve));
    }

    function catchMouse() {
        return new Promise((resolve, reject) => request("catchMouse", () => reject("Escaped")));
    }

    function cry(error) {
        if (error != "Escaped") {
            request("error", null, "An error wasn't passed to the cry() function. Try again adding error as an argument.");
            return;
        }
        request("cry", () => request("finished"));
    }

    // Wrap the code in a self-executing async function so we can use await
    eval(`(
        async () => {    
            ${code};
        }
    )();`);
};
