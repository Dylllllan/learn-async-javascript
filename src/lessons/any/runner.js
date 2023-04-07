export default (code, request) => {
    const birds = ["Parrot", "Eagle", "Owl"];
    const speeds = ["Low", "Mid", "High"];

    const birdSpeeds = {};
    for (let i = 0; i < birds.length; i++) {
        // Randomly and uniquely assign a speed to each bird
        const speedIndex = Math.floor(Math.random() * speeds.length);
        birdSpeeds[birds[i]] = speeds.splice(speedIndex, 1)[0];
    }

    function flyToFinish(birdName) {
        return new Promise((resolve) => request(`fly${birdSpeeds[birdName]}`, () => resolve(birdName), birdName.toLowerCase()));
    }

    function celebrate(birdName) {
        if (birdSpeeds[birdName] !== "High") {
            request("error", null, `The ${birdName} is not the winner of the race. Try again.`);
            return;
        }
        request("celebrate", () => request("finished"), birdName.toLowerCase());
    }

    // Wrap the code in a self-executing async function so we can use await
    eval(`(
        async () => {  
            const parrot = flyToFinish("Parrot");
            const eagle = flyToFinish("Eagle");
            const owl = flyToFinish("Owl");

            ${code};
        }
    )();`);
};
