import { TOTAL_LESSONS } from "./const.js";

import editor from "./editor.js";
import Lesson from "./lesson.js";

// Create a new class called App
class App {
    constructor() {
        // Create a list of lessons
        this.lessons = [];
        // Create a counter for the current lesson
        this.currentLesson = -1;

        // For each available lesson
        for (let i = 1; i <= TOTAL_LESSONS; i++) {
            // Create a new lesson and add it to the list
            this.lessons.push(new Lesson(`lesson${i}.json`));
        }

        // Create a listener for the next button in the content panel
        document.querySelector("#content .next").addEventListener("click", () => {
            // Show the editor/animation view
            this.showEditorView();
        });

        // Create a listener for the back button in the editor panel
        document.querySelector("#editor .back").addEventListener("click", () => {
            // Show the content/editor view
            this.showContentView();
        });

        // Create a listener for the run button in the editor panel
        document.querySelector("#editor .run").addEventListener("click", async () => {
            // If the button is disabled, don't run again
            if (document.querySelector("#editor .run").hasAttribute("disabled")) {
                return;
            }

            // Disable the run button
            document.querySelector("#editor .run").setAttribute("disabled", true);
            // Make the editor read-only
            editor.setReadOnly(true);
            // Hide the error message
            document.querySelector("#editor .error").classList.add("hidden");

            // Run the animation for the current lesson
            const result = await this.lessons[this.currentLesson].runLessonAnimation();

            // TO-DO: Handle the end-cases of running the animation
            // Error in code, animation timeout, animation success
            // We want to show success in animation panel, errors in editor panel

            if (result.success) {
                // Show the animation success message
                document.querySelector("#animation .success").classList.remove("hidden");
                // Remove the active class from the editor panel
                document.querySelector("#editor").classList.remove("active");
                // Add the active class to the animation panel
                document.querySelector("#animation").classList.add("active");
            } else {
                // Show the error message
                this.showEditorError(result.message);
                // Re-enable the UI by showing the editor view again
                this.showEditorView();
            }
            
        });

        // Create a listener for the next button in the animation panel
        document.querySelector("#animation .next").addEventListener("click", () => {
            // Show the next lesson
            this.nextLesson();
        });

        // Load the first lesson
        this.nextLesson();
    }

    // Create a method to show the content/editor view
    showContentView() {
        // Hide the animation panel
        document.querySelector("#animation").classList.add("hidden");
        // Show the content panel
        document.querySelector("#content").classList.remove("hidden");
        // Remove the active class from the animation panel
        document.querySelector("#animation").classList.remove("active");
        // Remove the active class from the editor panel
        document.querySelector("#editor").classList.remove("active");
        // Add the active class to the content panel
        document.querySelector("#content").classList.add("active");
        // Make the editor read-only
        editor.setReadOnly(true);
    }

    // Create a method to show the editor/animation view
    showEditorView() {
        // Hide the content panel
        document.querySelector("#content").classList.add("hidden");
        // Hide the animation success panel
        document.querySelector("#animation .success").classList.add("hidden");
        // Show the animation panel
        document.querySelector("#animation").classList.remove("hidden");
        // Add the active class to the editor panel
        document.querySelector("#editor").classList.add("active");
        // Remove the active class from the content panel
        document.querySelector("#content").classList.remove("active");
        // Make the editor editable
        editor.setReadOnly(false);
        // Enable the run button
        document.querySelector("#editor .run").removeAttribute("disabled");
    }

    // Create a method to load the next lesson
    async nextLesson() {
        // Increment the current lesson counter
        this.currentLesson++;
        // If there are no more lessons
        if (this.currentLesson >= this.lessons.length) {
            // TO-DO: Add a completion screen

            return;
        }

        // TO-DO: Add a loading screen

        // Load the next lesson
        await this.lessons[this.currentLesson].loadLesson();
        // Show the content/editor view
        this.showContentView();
    }

    // Create a method to show the error message in the editor
    showEditorError(message) {
        // Show the error box
        document.querySelector("#editor .error").classList.remove("hidden");
        // Display the error message
        document.querySelector("#editor .error .message").innerText = message;
    }
}

// Export the App class
export default App;
