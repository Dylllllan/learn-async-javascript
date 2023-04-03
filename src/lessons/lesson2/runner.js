export default (code, request) => {    
    function deliverPackage(location) {
        const locations = ["Library", "Government", "Hospital", "Bank", "School"];
        if (!locations.includes(location)) {
            request("error", null, `An invalid location was provided: ${location || "No location"}`);
        }

        return new Promise((resolve) => request("deliverPackage", resolve, location));
    }

    // Wrap the code in a self-executing async function so we can use await
    eval(`(
    async () => {
        const locations = ["Library", "Government", "Hospital", "Bank", "School"];

        ${code};

        request("finished");
    }
    )();`);
};
