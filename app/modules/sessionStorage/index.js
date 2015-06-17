module.exports = {
    setElement: function (req, element, value) {
        req.session[element] = value;
    },
    getElement: function (req, element) {
        return req.session[element];
    }
};