import mongoose from 'mongoose';
import { InstructionSchema } from '../../models/instructions/instructionModel';

const Instruction = mongoose.model('Instruction', InstructionSchema);

export const addNewInstruction = (req, res) => {
    let newInstruction = new Instruction(req.body);

    newInstruction.save((err, Instruction) => {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    })
}

export const getInstruction = (req, res) => {
    Instruction.find({}, (err, Instruction) => {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    })
}

export const getInstructionWithId = (req, res) => {
    Instruction.findById(req.params.InstructionId, (err, Instruction) => {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    })
}

export const updateInstruction = (req, res) => {
    Instruction.findOneAndUpdate({ _id: req.params.InstructionId }, req.body, { new: true }, (err, Instruction) => {
        if (err) {
            res.send(err);
        }
        res.json(Instruction);
    })
}

export const deleteInstruction = (req, res) => {
    Instruction.deleteOne({ _id: req.params.InstructionId }, (err, Instruction) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted Instruction' });
    })
}

