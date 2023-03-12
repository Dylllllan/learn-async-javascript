// Import Bootstrap styling
import "bootstrap/dist/css/bootstrap.min.css";
// Import the main CSS stylesheet
import "./style.scss";

import editor from "./editor";
import content from "./content";

async function init() {
    // Load the JSON lesson data for lesson 1
    const lesson = await (await fetch("./lessons/lesson1.json")).json();

    // Load the lesson template script
    const script = await (await fetch(lesson.resources.code)).text();

    // Add the lesson template script to the editor
    editor.setValue(script);

    // Set the editable area of the editor
    editor.setEditableArea(lesson.editor.editableArea.start, lesson.editor.editableArea.end);
    // Add the custom completers to the editor
    editor.addCompleters(lesson.editor.completers);

    const lessonContent = await (await fetch(lesson.resources.content)).text();
    content.setContent(lessonContent);

    // Create an iframe inside the animation container
    const iframe = document.createElement("iframe");
    iframe.src = lesson.resources.animation;
    document.getElementById("animation").appendChild(iframe);
}

init();
