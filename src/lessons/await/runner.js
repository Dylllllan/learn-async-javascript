export default (code, request) => {
    function countdown(seconds) {
        if (seconds != 5) {
            request("error", null, "The countdown must start at 5 seconds.");
            return;
        }
        return new Promise((resolve) => request("countdown", resolve));
    }
    
    // A function that launches the rocket into space
    function blastOff() {
        request("blastOff", () => request("finished"));
    }
    
    // Wrap the code in a self-executing async function so we can use await
    eval(`(
        async () => {
            ${code};
        }
    )();`);
};
