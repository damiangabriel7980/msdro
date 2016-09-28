/**
 * Session Storage module.
 * @module sessionStorage
 */

module.exports = {
    /**
     * Function that adds a value to the session storage
     *
     * @name setElement
     * @function
     * @param {Object} request - The request object
     * @param {String} property - A property to add on session storage
     * @param {String} value - A value for the previously mentioned property
     * @example
     * var utilsModule = require(/path/to/session/module)
     * utilsModule.setElement(req, 'myElem', '1234');
     */
    setElement: function (req, element, value) {
        req.session[element] = value;
    },
    /**
     * Function that retrieves a value from the session storage
     *
     * @name getElement
     * @function
     * @param {Object} request - The request object
     * @param {String} property - A property to get from the session storage
     * @example
     * var utilsModule = require(/path/to/session/module)
     * var userData = utilsModule.getUserData();
     */
    getElement: function (req, element) {
        return req.session[element];
    }
};