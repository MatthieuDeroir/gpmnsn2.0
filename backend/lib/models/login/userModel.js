"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var User = _mongoose2.default.model("User", new _mongoose2.default.Schema({
    username: String,
    password: String,
    roles: [{
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: "Role"
    }]

}));

module.exports = User;

//dummy