// Import Bootstrap styling
import "bootstrap/dist/css/bootstrap.min.css";
// Import the main CSS stylesheet
import "./style.scss";

import editor from "./editor";
import content from "./content";
import runner from "./runner";

async function init() {
    // Load the JSON lesson data for lesson 1
    const lesson = await fetch("./lessons/lesson1.json").then(response => response.json());

    // Load the lesson template script
    const script = await fetch(`./lessons/${lesson.id}/${lesson.resources.code}`).then(response => response.text());

    // Add the lesson template script to the editor
    editor.setValue(script);

    // Set the editable area of the editor
    editor.setEditableArea(lesson.editor.editableArea.start, lesson.editor.editableArea.end);
    // Add the custom completers to the editor
    editor.addCompleters(lesson.editor.completers);

    const lessonContent = await fetch(`./lessons/${lesson.id}/${lesson.resources.content}`).then(response => response.text());
    content.setContent(lessonContent);

    // Create an iframe inside the animation container
    const iframe = document.createElement("iframe");
    iframe.src = `./lessons/${lesson.id}/${lesson.resources.animation}`;
    document.getElementById("animation").appendChild(iframe);

    // Load the lesson test script
    const {default: tester} = await import(`./lessons/${lesson.id}/${lesson.runner.test}.js`);

    // Load the lesson runner script
    const {default: runnerScript} = await import(`./lessons/${lesson.id}/${lesson.runner.script}`);

    // When the #run button is clicked
    document.getElementById("run").addEventListener("click", async () => {
        // Get the contents of the editable area
        const code = editor.getEditableArea();
        // Run the lesson test script
        if (runner.test(code, tester)) {
            console.log("TEST PASSED");
            // Run the lesson runner script
            await runner.run(code, runnerScript);
            // Output a message to the console indicating that the lesson has been completed
            console.log("LESSON COMPLETED");
        } else {
            console.log("TEST FAILED");
        }
    });
}

init();
