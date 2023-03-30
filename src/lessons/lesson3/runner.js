export default (code, request) => {
    // e.g. request(messageName, callbackFunction);
    
    // Any code in the code string is run in the current scope
    eval(code);
};
