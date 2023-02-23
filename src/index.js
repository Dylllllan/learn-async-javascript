// Import Bootstrap styling
import "bootstrap/dist/css/bootstrap.min.css";
// Import the main CSS stylesheet
import "./style.scss";

import { parse } from "marked";

import editor from "./editor";

async function init() {
    // Load the lesson template script as a text string
    const script = await (await fetch("./lessons/templates/lesson1.js")).text();
    // Add the lesson template script to the editor and move the cursor to the start
    editor.setValue(script, -1);

    document.getElementById("content").innerHTML = parse("## Example of using markdown\nThis is good for generating content.  \nEven with `code snippets`.\n```\nalert(\"Hello World!\");\nvar a = 0;\n```");
}

init();
