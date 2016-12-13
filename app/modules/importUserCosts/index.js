/**
 * Created by andreimirica on 11.11.2015.
 */

var MedicsCosts = require('../../models/costs/medic_costs');
var async = require('async');
var Q = require('q');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('underscore');

var email = 'Email';
var firstName = 'First Name';
var lastName = 'Last Name';
var city = 'City';
var country = 'Country';
var amount = 'Amount';
var currency = 'Currency';
var purpose = 'Purpose';
var idBd = 'id baza date';


var DiacriticsToLetters = function (input, anotherChar) {
    if (typeof input !== 'string') input = "";
    var defaultDiacriticsRemovalMap = [{
        'base': "A",
        'letters': /(&#65;|&#9398;|&#65313;|&#192;|&#193;|&#194;|&#7846;|&#7844;|&#7850;|&#7848;|&#195;|&#256;|&#258;|&#7856;|&#7854;|&#7860;|&#7858;|&#550;|&#480;|&#196;|&#478;|&#7842;|&#197;|&#506;|&#461;|&#512;|&#514;|&#7840;|&#7852;|&#7862;|&#7680;|&#260;|&#570;|&#11375;|[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F])/g
    }, {
        'base': "I",
        'letters': /(&#73;|&#9406;|&#65321;|&#204;|&#205;|&#206;|&#296;|&#298;|&#300;|&#304;|&#207;|&#7726;|&#7880;|&#463;|&#520;|&#522;|&#7882;|&#302;|&#7724;|&#407;|[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197])/g
    }, {
        'base': "S",
        'letters': /(&#83;|&#9416;|&#65331;|&#7838;|&#346;|&#7780;|&#348;|&#7776;|&#352;|&#7782;|&#7778;|&#7784;|&#536;|&#350;|&#11390;|&#42920;|&#42884;|[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784])/g
    }, {
        'base': "T",
        'letters': /(&#84;|&#9417;|&#65332;|&#7786;|&#356;|&#7788;|&#538;|&#354;|&#7792;|&#7790;|&#358;|&#428;|&#430;|&#574;|&#42886;|[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786])/g
    }, {
        'base': "a",
        'letters': /(&#97;|&#9424;|&#65345;|&#7834;|&#224;|&#225;|&#226;|&#7847;|&#7845;|&#7851;|&#7849;|&#227;|&#257;|&#259;|&#7857;|&#7855;|&#7861;|&#7859;|&#551;|&#481;|&#228;|&#479;|&#7843;|&#229;|&#507;|&#462;|&#513;|&#515;|&#7841;|&#7853;|&#7863;|&#7681;|&#261;|&#11365;|&#592;|[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250])/g
    }, {
        'base': "i",
        'letters': /(&#105;|&#9432;|&#65353;|&#236;|&#237;|&#238;|&#297;|&#299;|&#301;|&#239;|&#7727;|&#7881;|&#464;|&#521;|&#523;|&#7883;|&#303;|&#7725;|&#616;|&#305;|[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131])/g
    }, {
        'base': "s",
        'letters': /(&#115;|&#9442;|&#65363;|&#347;|&#7781;|&#349;|&#7777;|&#353;|&#7783;|&#7779;|&#7785;|&#537;|&#351;|&#575;|&#42921;|&#42885;|&#7835;|&#383;|[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u017F])/g
    }, {
        'base': "t",
        'letters': /(&#116;|&#9443;|&#65364;|&#7787;|&#7831;|&#357;|&#7789;|&#539;|&#355;|&#7793;|&#7791;|&#359;|&#429;|&#648;|&#11366;|&#42887;|[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787])/g
    }];

    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
        input = input.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }
    if (anotherChar)
        input = input.replace(',', '');
    return input;
};

function Capitalise(string, isName) {
    if (isName) {
        var nameArray = string.split(" ");
        var newName = '';
        for (var i = 0; i < nameArray.length; i++) {
            var space;
            if (i == nameArray.length - 1)
                space = "";
            else
                space = " ";
            newName += nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1).toLowerCase() + space;
        }
        newName = DiacriticsToLetters(newName, true);
        return newName;
    } else
        return DiacriticsToLetters(string.charAt(0).toUpperCase() + string.slice(1).toLowerCase());
}

function lowerString(string) {
    var newName = string;
    newName = DiacriticsToLetters(newName, true);
    newName = newName.toLowerCase().replace(/-/g, "").replace(/\s+/g, "");
    return newName;
}

var insertUsers = function (arrayOfData) {
    var deferred = Q.defer();

    async.eachSeries(arrayOfData, function (item, callback) {
        var medicToCreate = {};
        console.log(item[email]);
        medicToCreate.userName = lowerString(item[email]);
        medicToCreate.name = Capitalise(item[firstName]) + ' ' + Capitalise(item[lastName]);
        medicToCreate.city = Capitalise(item[city]);
        medicToCreate.country = Capitalise(item[country]);
        medicToCreate.amount = lowerString(item[amount]);
        medicToCreate.currency = Capitalise(item[currency]);
        medicToCreate.purpose = Capitalise(item[purpose]);
        medicToCreate.dbId = item[idBd];
        var medicCosts = new MedicsCosts(medicToCreate);
        medicCosts.save(function (err, respMed) {
            if (err) {
                return callback(err);
            }
            callback();
        });
    }, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};

module.exports = {
    insertUsers: insertUsers
};

