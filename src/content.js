// Import the marked library
import { parse } from "marked";

// Create a new class called Content
class Content {
    constructor() {
        this.element = document.querySelector("#content .view");
    }

    // Create a method to set the content of the content element
    setContent(markdown) {
        this.element.innerHTML = parse(markdown);
    }
}

// Create a new instance of the Content class
const content = new Content();
// Export the content component to be used throughout the application
export default content;
