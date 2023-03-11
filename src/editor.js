// Import the Ace editor library
import ace from "brace";

// Import the JavaScript mode for the Ace editor
import "brace/mode/javascript";
// Import the language tools extension for the Ace editor
import "brace/ext/language_tools";

// Create a new class called Editor
class Editor {
    // Create a constructor for the Editor class
    constructor() {
        // Create a new Ace editor instance
        this.editor = ace.edit(document.querySelector("#editor"));
        // Set the mode of the editor to JavaScript
        this.editor.session.setMode("ace/mode/javascript");
        // Set the options of the editor
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            dragEnabled: false
        });
        // Remove the default completer
        this.editor.completers = [];
    }

    // Create a method to get the value of the editor
    getValue() {
        return this.editor.getValue();
    }

    // Create a method to set the value of the editor
    setValue(value) {
        this.editor.setValue(value, -1);
        // Clear the undo stack after 1000ms
        setTimeout(() => {
            this.editor.session.getUndoManager().reset();
        }, 1000);
    }

    // Create a method to add a custom completer to the editor
    addCompleter(value, score, meta) {
        // Example: Adds a custom completer (https://stackoverflow.com/a/65219943)
        // Note: completions are sorted by score, so if there's multiple matches, the one with the highest score will be shown first

        // Add the completer to the editor
        this.editor.completers.push({
            getCompletions: (editor, session, pos, prefix, callback) => {
                callback(null, [
                    {value, score, meta}
                ]);
            }
        });
    }

    // Create a method to remove all custom completers from the editor
    removeCompleters() {
        this.editor.completers = [];
    }

    // Create a method to disallow editing between two lines in the editor
    // Start line and end line are defined as the line numbers in the editor, not the index of the line in the array
    restrictEditing(startLine, endLine) {
        // Throw an error if the start line is greater than the end line
        if (startLine >= endLine) {
            throw new Error("Start line cannot be greater than or equal to end line");
        }
        // Throw an error if the start or end lines are out of range
        if (startLine < 1 || endLine > this.editor.session.getLength()) {
            throw new Error("Start or end line is out of range");
        }

        // Attach Anchors to the start and end of the restricted area
        const start = this.editor.session.doc.createAnchor(startLine - 1, 0);
        const end = this.editor.session.doc.createAnchor(endLine - 1, 0);

        // If any commands are executed on the editor
        this.editor.commands.on("exec", (e) => {
            // Get the cursor position
            const cursor = this.editor.getCursorPosition();
            
            // If the cursor is after the start anchor and before the end anchor
            if (cursor.row >= start.row && cursor.row <= end.row) {
                // Prevent the command from being executed
                e.preventDefault();
            }

            // Get the selection range
            const range = this.editor.getSelectionRange();
            // If the selection range starts or ends in the restricted area, or contains the restricted area
            if ((range.start.row >= start.row && range.start.row <= end.row) || (range.end.row >= start.row && range.end.row <= end.row) || (range.start.row <= start.row && range.end.row >= end.row)) {
                // Prevent the command from being executed
                e.preventDefault();
            }
        });
    }
}

// Create a new instance of the Editor class
const editor = new Editor();
// Export the editor to be used throughout the application
export default editor;
