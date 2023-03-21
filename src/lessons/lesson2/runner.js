export default (code, request) => {    
    function deliverPackage(location) {
        const locations = ["Bank", "School", "Hospital", "Government", "Library"];
        if (!locations.includes(location)) {
            request("error", null, `Invalid location: ${location}`);
        }

        return new Promise((resolve) => request(`deliverPackage`, resolve, location));
    }

    // Wrap the code in a self-executing async function so we can use await
    eval(`(
    async () => {
        const locations = ["Bank", "School", "Hospital", "Government", "Library"];

        try {
            const promises = [];
            ${code}
        } catch (error) {
            request("error", null, error.message);
        }

        request("finished");
    }
    )();`);
};
