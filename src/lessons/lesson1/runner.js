/* eslint-disable no-unused-vars */
(code, request) => {
    function catchFly(callback) {
        request("catchFly", callback);
    }
    
    function celebrate() {
        request("celebrate", () => request("finished"));
    }
    
    eval(code);
};
