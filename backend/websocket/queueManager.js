// queueManager.js
const { v4: uuidv4 } = require('uuid');
const Logger = require("../utils/logger");

/**
 * Manages per-panel instruction queues using Redis lists.
 */
class QueueManager {
    constructor(redisClient, expectedPanels) {
        this.redisClient = redisClient;
        this.expectedPanels = expectedPanels;
        this.lastAutoOffSent = {}; // Track last "auto-off" timestamps per panel
    }

    // Generate a unique ID for instructions
    generateUniqueId() {
        return uuidv4();
    }

    // Push a generic instruction into the panel’s queue
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

        return instructionItem;
    }

    // Dedicated "auto-off" instruction enqueuing to avoid duplicates
    async enqueueAutoOffInstruction(panelName) {
        // Check if the last instruction is "off"
        const lastInstructions = await this.getLastQueuedInstructions(panelName, 1, 'queue');

        if (lastInstructions.length > 0 && lastInstructions[0].instruction === 'off') {
            console.log(`[QueueManager] Skipping duplicate off instruction for ${panelName}`);
            return null;
        }

        const instructionItem = {
            id: this.generateUniqueId(),
            instruction: 'off',
            timestamp: Date.now(),
            status: 'pending',
            role: 'HealthChecker',
        };

        await this.redisClient.lPush(`queue:${panelName}`, JSON.stringify(instructionItem));
        console.log(`[QueueManager] Auto-off instruction enqueued for ${panelName}:`, instructionItem);

        Logger.appendLog(panelName, 'Auto-Off Instruction Enqueued', {
            instruction: 'off',
            instructionId: instructionItem.id,
            timestamp: instructionItem.timestamp,
            role: instructionItem.role,
        });

        this.lastAutoOffSent[panelName] = Date.now();
        return instructionItem;
    }

    // Get the last N instructions from a given queue
    async getLastQueuedInstructions(panelName, count = 10, queueType = 'queue') {
        const items = await this.redisClient.lRange(`${queueType}:${panelName}`, 0, count - 1);
        return items.map((item) => JSON.parse(item)).reverse();
    }

    // Retrieve the entire queue for a panel
    async getQueue(panelName, queueType = 'queue') {
        const items = await this.redisClient.lRange(`${queueType}:${panelName}`, 0, -1);
        return items.map((item) => JSON.parse(item)).reverse();
    }

    // Remove a specific instruction by ID from the queue
    async removeInstruction(panelName, instructionId, queueType = 'queue') {
        const items = await this.redisClient.lRange(`${queueType}:${panelName}`, 0, -1);
        for (const item of items) {
            const parsed = JSON.parse(item);
            if (parsed.id === instructionId) {
                await this.redisClient.lRem(`${queueType}:${panelName}`, 0, item);
                console.log(`[QueueManager] Removed instruction ${instructionId} from ${panelName}'s ${queueType}`);
                break;
            }
        }
    }

    // Clear all queues for expected panels (e.g., upon server startup)
    async clearAllQueues() {
        try {
            for (const panelName of this.expectedPanels) {
                await this.redisClient.del(`queue:${panelName}`);
                await this.redisClient.del(`auto-off-queue:${panelName}`);
                console.log(`[QueueManager] Cleared all queues for panel: ${panelName}`);
            }
        } catch (error) {
            console.error('[QueueManager] Error clearing Redis queues:', error);
        }
    }
}

module.exports = QueueManager;
