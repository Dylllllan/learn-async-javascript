import editor from "./editor";
import content from "./content";
import runner from "./runner";

// Create a new class called Lesson
class Lesson {
    // Create a constructor which takes the configuration object and a callback function
    constructor(number, configFile) {
        this.number = number;
        this.configFile = configFile;
    }

    // Create a method to load the lesson
    async loadLesson() {
        // Load the lesson config
        this.config = await import(
            /* webpackInclude: /\.json$/ */
            `./lessons/${this.configFile}`);
        // Show the lesson number and name in the header
        document.querySelector("#lesson-number").innerText = this.number;
        document.querySelector("#lesson-name").innerText = this.config.name;
        document.querySelector("#lesson-objective").innerText = this.config.objective;
        // Load the lesson content, template, animation and runner
        await Promise.all([
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
        document.querySelector("#animation .view iframe").src = `./lessons/${this.config.id}/${this.config.resources.animation}`;
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
        const testResult = runner.test(code, this.config.test.allowlist, this.tester);

        if (testResult.success) {
            // Run the lesson runner script with a timeout
            const codeResult = await runner.run(code, this.runner, this.config.runner.timeout);
            
            // Get the lesson result from the events run, or fallback to the code result
            const lessonResult = this.getLessonResult(codeResult.events) || codeResult;

            // If the lesson wasn't successful
            if (!lessonResult.success) {
                // Reset the animation
                runner.send(-1, "reset");
            }
            
            // Return the lesson result
            return lessonResult;
        } else {
            // Return the test result with the error message
            return testResult;
        }
    }

    getLessonResult(events) {
        // If no events were provided, return null
        if (!events) {
            return null;
        }

        // For each sequence of events that feedback can be provided on
        for (let i = 0; i < this.config.feedback.length; i++) {
            // Get the sequence of events for the feedback
            const expectedEvents = this.config.feedback[i].events;

            // Compare the sequence of events to the events in the lesson result
            if (runner.compareEvents(events, expectedEvents)) {
                // If the sequence of events matches, return the corresponding result
                return this.config.feedback[i].result;
            }
        }

        // If no sequence of events matches, return null
        return null;
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