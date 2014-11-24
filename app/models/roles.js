var mongoose = require('mongoose');

var rolesSchema = mongoose.Schema({
    authority: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Role', rolesSchema);
