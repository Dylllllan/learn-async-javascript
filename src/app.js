import { LESSONS, START_LESSON } from "./const.js";

import editor from "./editor.js";
import Lesson from "./lesson.js";

// Create a new class called App
class App {
    constructor() {
        // Create a list of lessons
        this.lessons = [];
        // Create a counter for the current lesson
        this.currentLesson = START_LESSON - 1;

        // For each available lesson
        for (let i = 0; i < LESSONS.length; i++) {
            // Create a new lesson and add it to the list
            this.lessons.push(new Lesson(i + 1, `${LESSONS[i]}.json`));
        }

        // Create a listener for the next button in the content panel
        document.querySelector("#content .next").addEventListener("click", () => {
            // Show the editor/animation view
            this.showEditorView();
        });

        // Create a listener for the back button in the editor panel
        document.querySelector("#editor .back").addEventListener("click", () => {
            // If the button is disabled, don't change views
            if (document.querySelector("#editor .back").hasAttribute("disabled")) {
                return;
            }

            // Show the content/editor view
            this.showContentView();
        });

        // Create a listener for the run button in the editor panel
        document.querySelector("#editor .run").addEventListener("click", async () => {
            // If the button is disabled, don't run again
            if (document.querySelector("#editor .run").hasAttribute("disabled")) {
                return;
            }

            // Disable the run and back button
            document.querySelector("#editor .run").setAttribute("disabled", true);
            document.querySelector("#editor .back").setAttribute("disabled", true);
            // Make the editor read-only
            editor.setReadOnly(true);
            // Hide the error message
            document.querySelector("#editor .error").classList.add("hidden");

            // Run the animation for the current lesson
            const result = await this.lessons[this.currentLesson].runLessonAnimation();

            if (result.success) {
                // Add the result message to the animation success message
                document.querySelector("#animation .success .message").innerText = result.message;
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

        // Check the query parameters for if the consent form has been signed
        const queryParams = new URLSearchParams(window.location.search);
        const consentSigned = queryParams.get("cs");

        if (consentSigned) {
            // If the consent form has been signed, load the first lesson
            this.nextLesson();
        } else {
            // Otherwise, redirect to the consent form
            window.location.href = "https://forms.microsoft.com/e/ZQ3bsKQDY2";
        }
    }

    // Create a method to show the content/editor view
    showContentView() {
        // Hide the animation success panel
        document.querySelector("#animation .success").classList.add("hidden");
        // Hide the editor panel
        document.querySelector("#editor").classList.add("hidden");
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
        // Show the editor panel
        document.querySelector("#editor").classList.remove("hidden");
        // Add the active class to the editor panel
        document.querySelector("#editor").classList.add("active");
        // Remove the active class from the content panel
        document.querySelector("#content").classList.remove("active");
        // Make the editor editable
        editor.setReadOnly(false);
        // Enable the run and back buttons
        document.querySelector("#editor .run").removeAttribute("disabled");
        document.querySelector("#editor .back").removeAttribute("disabled");
    }

    // Create a method to load the next lesson
    async nextLesson() {
        // Increment the current lesson counter
        this.currentLesson++;
        // If there are no more lessons
        if (this.currentLesson >= this.lessons.length) {
            // Redirect to the user evaluation survey
            window.location.href = "https://forms.microsoft.com/e/FJFxGp57PE";
            return;
        }

        // If the current lesson is the last lesson
        if (this.currentLesson == this.lessons.length - 1) {
            // Change the text of the next button to "Finish"
            document.querySelector("#animation .btn").innerText = "Finish";
        }

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
