// Import the Ace editor library
import ace from "brace";
// Import the Range class from the Ace editor library
const Range = ace.acequire("ace/range").Range;
// Import the JavaScript mode for the Ace editor
import "brace/mode/javascript";
// Import the language tools extension for the Ace editor
import "brace/ext/language_tools";

// Create a new class called Editor
class Editor {
    // Create a constructor for the Editor class
    constructor() {
        // Create a new Ace editor instance
        this.editor = ace.edit(document.querySelector("#editor .view"));
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

        // Initialise the start and end anchors for the editable area
        this.startAnchor = this.editor.session.doc.createAnchor(0, 0);
        this.endAnchor = this.editor.session.doc.createAnchor(0, 0);

        // Set a default listener for the editable area of the editor
        this.editor.commands.on("exec", (e) => {
            // If the start anchor is not at the start of a line
            if (this.startAnchor.column != 0) {
                // Move the start anchor to the start of the line
                this.startAnchor.setPosition(this.startAnchor.row, 0);
            }

            // Get the cursor position
            const cursor = this.editor.getCursorPosition();
            
            // If the cursor is not within the editable area
            if (cursor.row < this.startAnchor.row || cursor.row > this.endAnchor.row ||
               (cursor.row == this.startAnchor.row && cursor.column < this.startAnchor.column) ||
               (cursor.row == this.endAnchor.row && cursor.column > this.endAnchor.column)) {
                // Prevent the command from being executed
                e.preventDefault();
            }

            // Get the selection range
            const range = this.editor.getSelectionRange();
            // If the selection range is not within the editable area
            if (range.start.row < this.startAnchor.row || range.end.row > this.endAnchor.row ||
               (range.start.row == this.startAnchor.row && range.start.column < this.startAnchor.column) ||
               (range.end.row == this.endAnchor.row && range.end.column > this.endAnchor.column)) {
                // Prevent the command from being executed
                e.preventDefault();
            }

            // If the command is backspacing or deleting
            if (e.command.name == "backspace" || e.command.name == "del") {
                // If the cursor is at the start of the editable area
                if (cursor.row == this.startAnchor.row && cursor.column == this.startAnchor.column) {
                    // Prevent the command from being executed
                    e.preventDefault();
                }
            }
        });
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

    // Create a method to add multiple custom completers to the editor
    // Each completer should have a value, score and meta property
    addCompleters(completers) {
        // Add the completers to the editor
        this.editor.completers.push({
            getCompletions: (editor, session, pos, prefix, callback) => {
                callback(null, completers);
            }
        });
    }

    // Create a method to remove all custom completers from the editor
    removeCompleters() {
        this.editor.completers = [];
    }

    // Create a method to allow editing between two lines in the editor
    // Start line and end line are defined as the line numbers in the editor, not the index of the line in the array
    setEditableArea(startLine, endLine) {
        // Throw an error if the start line is greater than the end line
        if (startLine > endLine) {
            throw new Error("Start line cannot be greater than end line");
        }
        // Throw an error if the start or end lines are out of range
        if (startLine < 1 || endLine > this.editor.session.getLength()) {
            throw new Error("Start or end line is out of range");
        }

        // Set the start and end anchors to the start and end of the editable area
        this.startAnchor = this.editor.session.doc.createAnchor(startLine - 1, 0);
        this.endAnchor = this.editor.session.doc.createAnchor(endLine - 1, 0);

        // Create a Range object which represents the editable area
        this.editableArea = new Range();
        this.editableArea.start = this.startAnchor;
        this.editableArea.end = this.endAnchor;

        // Add a marker to the editor to highlight the editable area
        this.editor.session.addMarker(this.editableArea, "editable", "fullLine");
    }

    // Create a method to get the contents of the editable area
    getEditableArea() {
        // Return the contents of the editable area
        return this.editor.session.getTextRange(this.editableArea);
    }

    // Create a method to reset the editor
    reset() {
        // Reset the editor value
        this.setValue("");
        // Remove all custom completers
        this.removeCompleters();
        // Sets the editable area to the entire editor
        this.setEditableArea(1, this.editor.session.getLength());
        // Set the editor to be read-only
        this.setReadOnly(true);
    }

    // Create a method to set whether the editor is read-only
    setReadOnly(readOnly) {
        this.editor.setReadOnly(readOnly);
    }
}

// Create a new instance of the Editor class
const editor = new Editor();
// Export the editor to be used throughout the application
export default editor;
