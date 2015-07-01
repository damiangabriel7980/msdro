var errorCodes = {
    0: "A aparut o eroare pe server",
    1: "Continutul nu a fost gasit",
    2: "Eroare la salvare. Verificati campurile",
    3: "Selectati un continut",
    4: "Continutul a fost sters din baza de date, dar nu s-a putut sterge de pe Amazon",
    5: "Eroare la stergerea entitatilor atasate continutului",
    6: "Parametrii invalizi",
    7: "Eroare la adaugarea entitatilor atasate",
    20: "Autorul si titlul sunt obligatorii (minim 3 caractere)",
    21: "Verificati tipul",
    22: "Tipul fisierului lipseste",
    23: "O categorie cu acelasi nume exista deja",
    24: "Numele este obligatoriu"
};

module.exports = function(logger){
    return function(res, error ,status, code){
        if(error) logger.log(error);
        res.send(status, {error: errorCodes[code || 0]})
    };
};