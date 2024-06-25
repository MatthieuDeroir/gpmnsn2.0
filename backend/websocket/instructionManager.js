const { broadcastToSpecificClients } = require('./networking');
const logger = require('./logger');

function processInstruction(instruction, clients) {
    logger.appendLog(`Processing instruction: ${JSON.stringify(instruction)}`);
    switch (instruction.type) {
        case "instruction":
            if (['on', 'off'].includes(instruction.instruction)) {
                logger.appendLog(`Instruction ${instruction.instruction} received for ${instruction.to}`);
                broadcastToSpecificClients(JSON.stringify(instruction), instruction.to, instruction.name);
            } else {
                logger.appendLog('Invalid instruction received');
            }
            break;
        default:
            logger.appendLog('Unhandled instruction type');
    }
}

exports.processInstruction = processInstruction;
