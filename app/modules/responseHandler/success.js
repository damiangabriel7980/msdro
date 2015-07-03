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
    15: "Successfully unsubscribed from push notifications"
};

module.exports = function(logger){
    return function(res, object, code){
        res.send({success: object || true, message: successCodes[code || 0]});
    };
};