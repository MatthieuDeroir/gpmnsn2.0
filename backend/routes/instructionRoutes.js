import {
    addNewInstruction,
    getInstruction,
    getInstructionWithId,
    updateInstruction,
    deleteInstruction
} from '../Controllers/instructions/instructionController';

export default (app) => {
    app.route("/Instructions")
        .get(getInstruction)
        .post(addNewInstruction);

    app.route("/instruction/:InstructionId")
        .get(getInstructionWithId)
        .put(updateInstruction)
        .delete(deleteInstruction);
};
