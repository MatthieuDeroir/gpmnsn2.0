'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mongoose = require('mongoose');

var _require = require('../../models/instructions/instructionModel'),
    InstructionSchema = _require.InstructionSchema;

var Instruction = mongoose.model('Instruction', InstructionSchema);

var addNewInstruction = exports.addNewInstruction = function addNewInstruction(req, res) {
    var newInstruction = new Instruction(req.body);

    newInstruction.save(function (err, Instruction) {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    });
};

var getInstruction = exports.getInstruction = function getInstruction(req, res) {
    Instruction.find({}, function (err, Instruction) {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    });
};

var getInstructionWithId = exports.getInstructionWithId = function getInstructionWithId(req, res) {
    Instruction.findById(req.params.InstructionId, function (err, Instruction) {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    });
};

var updateInstruction = exports.updateInstruction = function updateInstruction(req, res) {
    Instruction.findOneAndUpdate({ _id: req.params.InstructionId }, req.body, { new: true }, function (err, Instruction) {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    });
};

var deleteInstruction = exports.deleteInstruction = function deleteInstruction(req, res) {
    Instruction.deleteOne({ _id: req.params.InstructionId }, function (err, Instruction) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted Instruction' });
    });
};