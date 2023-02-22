// Import the Ace editor library
import ace from "brace";

// Import the JavaScript mode for the Ace editor
import "brace/mode/javascript";
// Import the language tools extension for the Ace editor
import "brace/ext/language_tools";

const editor = ace.edit(document.querySelector("#editor"));

editor.session.setMode("ace/mode/javascript");

editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    dragEnabled: false
});

/*
// Example: Adds a custom completer (https://stackoverflow.com/a/65219943)
// Note: completions are sorted by score, so if there's multiple matches, the one with the highest score will be shown first
editor.completers = [{
    getCompletions: (editor, session, pos, prefix, callback) => {
        // note, won't fire if caret is at a word that does not have these letters
        callback(null, [
            {value: "hello", score: 1, meta: "some comment"},
            {value: "world", score: 1, meta: "some other comment"},
        ]);
    }
}];
*/

// Remove the default completer
editor.completers = [];

// Export the editor to be used throughout the application
export default editor;
