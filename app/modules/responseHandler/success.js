/**
 * Success module.
 * @module successModule
 */
/**
 * A variable in the global namespace called 'successCodes' used for sending success messages to front-end.
 * @var {Object} successCodes
 */
var successCodes = {
    0: "Cererea a fost procesata cu succes",
    2: "Continutul a fost salvat cu succes",
    3: "Continutul a fost modificat cu succes",
    4: "Continutul a fost sters cu succes",
    5: "Imaginea a fost stearsa din baza de date si de pe Amazon",
    6: "Imaginea a fost stearsa din baza de date",
    7: "Continutul si fisierele asociate au fost sterse",
    8: "Continutul a fost modificat. Un email a fost trimis catre utilizator",
    81: "Continutul a fost adaugat. Un email a fost trimis catre utilizator",
    9: "Continutul a fost modificat. Email-ul nu a putut fi trimis catre utilizator",
    11: "Fotografia a fost actualizata cu succes!",
    12: "Datele au fost modificate!",
    13: "Parola a fost schimbata",
    14: "Cautarea nu a returnat nici un rezultat!",
    15: "Successfully unsubscribed from push notifications",
    16: "Nu exista modificari"
};

/**
 * Function that sends a success response to front-end containing data and a message
 *
 * @function
 * @param {Object} res - The response object
 * @param {Object|Array} object - The data we want to send to the front-end (can also be an array)
 * @param {Number} code - A code from the variable successCodes
 * @param {Number} [status] - A HTTP status (200 by default) - optional
 * @example
 * var handleSuccess = require(/path/to/success/module)
 * handleSuccess(res, {myElem: data}, 2);
 */
module.exports = function(logger){
    return function(res, object, code, status){
        res.send(status || 200, {success: object || true, message: successCodes[code || 0]});
    };
};