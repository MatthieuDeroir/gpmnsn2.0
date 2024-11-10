// websocket/queueManager.js
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

class QueueManager {
    constructor(redisClient, expectedPanels) {
        this.redisClient = redisClient;
        this.expectedPanels = expectedPanels;
    }

    // Generate a unique ID for each instruction
    generateUniqueId() {
        return uuidv4();
    }

    // Enqueue an instruction for a specific panel
    async enqueueInstruction(panelName, instruction, role) {
        const instructionItem = {
            id: this.generateUniqueId(),
            instruction,
            timestamp: Date.now(),
            status: 'pending',
            role,
        };

        await this.redisClient.lPush(`queue:${panelName}`, JSON.stringify(instructionItem));
        console.log(`[QueueManager] Enqueued instruction for ${panelName}:`, instructionItem);

        return instructionItem; // Return the instruction item to get the ID
    }

    // Retrieve the entire queue for a specific panel
    async getQueue(panelName) {
        const queueItems = await this.redisClient.lRange(`queue:${panelName}`, 0, -1);
        return queueItems.map((item) => JSON.parse(item)).reverse(); // Reverse to maintain FIFO order
    }

    // Remove an instruction from the queue by its ID
    async removeInstruction(panelName, instructionId) {
        const queueItems = await this.redisClient.lRange(`queue:${panelName}`, 0, -1);
        for (const item of queueItems) {
            const instruction = JSON.parse(item);
            if (instruction.id === instructionId) {
                await this.redisClient.lRem(`queue:${panelName}`, 0, item);
                console.log(`[QueueManager] Removed instruction ${instructionId} from ${panelName}'s queue`);
                break;
            }
        }
    }

    // Get the last N instructions for a specific panel
    async getLastQueuedInstructions(panelName, count = 10) {
        const queueItems = await this.redisClient.lRange(`queue:${panelName}`, 0, count - 1);
        return queueItems.map((item) => JSON.parse(item)).reverse(); // Reverse to show oldest first
    }

    // Clear all queues for expected panels
    async clearAllQueues() {
        try {
            for (const panelName of this.expectedPanels) {
                await this.redisClient.del(`queue:${panelName}`);
                console.log(`[QueueManager] Cleared queue for panel: ${panelName}`);
            }
        } catch (error) {
            console.error('[QueueManager] Error clearing Redis queues:', error);
        }
    }
}

module.exports = QueueManager;
