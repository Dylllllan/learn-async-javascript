import editor from "./editor";
import content from "./content";
import runner from "./runner";

// Create a new class called Lesson
class Lesson {
    // Create a constructor which takes the configuration object and a callback function
    constructor(config, completedCallback) {
        this.config = config;
        this.completedCallback = completedCallback;
    }

    // Create a method to load the lesson
    loadLesson() {
        return Promise.all([
            this.loadLessonContent(),
            this.loadLessonTemplate(),
            this.loadLessonAnimation(),
            this.loadLessonRunner()
        ]);
    }

    async loadLessonContent() {
        const lessonContent = await fetch(`./lessons/${this.config.id}/${this.config.resources.content}`).then(res => res.text());
        content.setContent(lessonContent);
    }

    async loadLessonTemplate() {
        // Reset the editor
        editor.reset();

        // Load the lesson code template
        const codeTemplate = await fetch(`./lessons/${this.config.id}/${this.config.resources.code}`).then(res => res.text());

        // Add the lesson code template to the editor
        editor.setValue(codeTemplate);

        // Set the editable area of the editor
        editor.setEditableArea(this.config.editor.editableArea.start, this.config.editor.editableArea.end);

        // Add the custom completers to the editor
        editor.addCompleters(this.config.editor.completers);

        // (Allow the user to edit the code template - this should be enabled after reading the lesson)
        editor.setReadOnly(false);
    }

    async loadLessonAnimation() {
        document.querySelector("#animation iframe").src = `./lessons/${this.config.id}/${this.config.resources.animation}`;
    }

    async loadLessonRunner() {
        [this.tester, this.runner] = await Promise.all([
            this.loadScript(this.config.test.script),
            this.loadScript(this.config.runner.script)
        ]);
    }

    async runLessonAnimation() {
        // Get the contents of the editable area
        const code = editor.getEditableArea();

        // Run the lesson test script
        if (runner.test(code, this.config.test.allowlist, this.tester)) {
            console.log("TEST PASSED");
            // Run the lesson runner script
            await runner.run(code, this.runner);
            // Output a message to the console indicating that the lesson has been completed
            console.log("LESSON COMPLETED");
            // Call the completed callback function
            this.completedCallback();
        } else {
            console.log("TEST FAILED");
        }
    }

    async loadScript(fileName) {
        const { default: script } = await import(
            /* webpackInclude: /\.js$/ */
            `./lessons/${this.config.id}/${fileName}`
        );
        return script;
    }
}

// Export the class
export default Lesson;