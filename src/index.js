// Import Bootstrap styling
import "bootstrap/dist/css/bootstrap.min.css";
// Import the main CSS stylesheet
import "./style.scss";

import Lesson from "./lesson";

async function init() {    
    // Load the lesson data
    const lessonConfig = await import(`./lessons/${"lesson1"}.json`);

    const lesson1 = new Lesson(lessonConfig, () => {});
    await lesson1.loadLesson();

    // When the #run button is clicked
    document.getElementById("run").addEventListener("click", async () => {
        lesson1.runLessonAnimation();
    });
}

init();
