// Import Bootstrap styling
import "bootstrap/dist/css/bootstrap.min.css";
// Import the main CSS stylesheet
import "./style.scss";

import editor from "./editor";
import content from "./content";

async function init() {
    // Load the lesson template script as a text string
    const script = await (await fetch("./lessons/templates/lesson1.txt")).text();
    // Add the lesson template script to the editor and move the cursor to the start
    editor.setValue(script);

    editor.setEditableArea(14, 15);

    const lesson = await (await fetch("./lessons/templates/lesson1.md")).text();
    content.setContent(lesson);
}

init();
