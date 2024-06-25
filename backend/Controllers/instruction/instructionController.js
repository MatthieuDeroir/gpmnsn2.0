const mongoose = require('mongoose');
const { InstructionSchema } = require('../../Models/Instructions/instructionModel');
const handleDatabaseOperation = require('../../Database/Operation');

const Instruction = mongoose.model('Instruction', InstructionSchema);

export const addNewInstruction = (req, res) => {
    let newInstruction = new Instruction(req.body);

    newInstruction.save((err, Instruction) => {
        if (err) {
            res.send("Error while adding new Instruction :", err);
        }
        res.json(Instruction);
    })
}

export const getInstruction = (req, res) => {
    Instruction.find({}, (err, Instruction) => {
        if (err) {
            res.send("Error while getting Instructions :",err);
        }
        res.json(Instruction);
    })
}

export const getInstructionWithId = (req, res) => {
    Instruction.findById(req.params.InstructionId, (err, Instruction) => {
        if (err) {
            res.send("Error while getting Instruction :",err);
        }
        res.json(Instruction);
    })
}

export const updateInstruction = (req, res) => {
    Instruction.findOneAndUpdate({ _id: req.params.InstructionId }, req.body, { new: true }, (err, Instruction) => {
        if (err) {
            res.send("Error while updating Instructions :",err);
        }
        res.json(Instruction);
    })
}

export const deleteInstruction = (req, res) => {
    Instruction.deleteOne({ _id: req.params.InstructionId }, (err, Instruction) => {
        if (err) {
            res.send("Error while deleting Instructions :",err);
        }
        res.json({ message: 'Successfully deleted Instruction' });
    })
}

