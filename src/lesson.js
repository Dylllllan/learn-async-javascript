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
            const lessonResult = await Promise.any([
                runner.run(code, this.runner),
                new Promise((resolve) => setTimeout(
                    () => 
                        resolve({
                            "success": false,
                            "message": "Whoops! Your code took too long to run. Check your code and make sure it follows the instructions."
                        }),
                    this.config.runner.timeout))
            ]);
            // Return the result of the lesson
            return lessonResult;
        } else {
            // Return the test result with the error message
            return testResult;
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