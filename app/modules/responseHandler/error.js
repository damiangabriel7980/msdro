var errorCodes = {
    0: "A aparut o eroare pe server",
    1: "Continutul nu a fost gasit",
    2: "Eroare la salvare. Verificati campurile",
    3: "Selectati un continut",
    4: "Continutul a fost sters din baza de date, dar nu s-a putut sterge de pe Amazon",
    5: "Eroare la stergerea entitatilor atasate continutului",
    51: "Eroare la stergerea continutului",
    6: "Parametrii invalizi",
    7: "Eroare la adaugarea entitatilor atasate",
    8: "Parola nu este corecta!",
    9: "Introduceti o parola diferita fata de cea veche!",
    10: "Parola trebuie sa contina intre 6 si 32 de caractere!",
    11: "Parolele nu corespund",
    12: "Continutul a fost procesat cu erori",
    13: "Nu sunteti autentificat",
    14: "Nu aveti drepul de accesa aceasta resursa",
    20: "Autorul si titlul sunt obligatorii (minim 3 caractere)",
    21: "Verificati tipul",
    22: "Tipul fisierului lipseste",
    23: "O categorie cu acelasi nume exista deja",
    24: "Numele este obligatoriu",
    25: "A aparut o eroare la modificarea fotografiei",
    26: "Numele trebuie sa contina doar caractere, minim 3",
    261: "Numele trebuie sa contina minim 3 litere si doar caracterele speciale '-', '.'",
    27: "Numarul de telefon trebuie sa contina doar cifre, minim 10",
    28: "Adresa este obligatorie",
    29: "Selectati un tip de loc de munca",
    30: "Error unsubscibing from push notifications",
    31: "Adresa de e-mail nu este valida",
    311: "Nu a fost gasit un cont pentru acest e-mail",
    32: "Adresa de e-mail este deja folosita",
    33: "Tipul de activare nu este valid",
    34: "Eroare la citirea fisierului",
    35: "Eroare la citirea codului de activare",
    351: "Codul de activare nu este valid",
    36: "Profesia este obligatorie",
    37: "Selectati un grup preferat",
    38: "Selectati un oras",
    39: "Dovada nu a putut fi incarcata"
};

module.exports = function(logger){
    return function(res, error ,status, code, data){
        if(error) logger.log(error);
        res.send(status || 500, {error: errorCodes[code || 0], data: data});
    };
};