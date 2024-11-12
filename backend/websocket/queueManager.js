// websocket/queueManager.js
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');
const readlineSync = require('readline-sync');
const Logger = require("../utils/logger");

class QueueManager {
    constructor(redisClient, expectedPanels) {
        this.redisClient = redisClient;
        this.expectedPanels = expectedPanels;
        this.lastAutoOffSent = {}; // Track the last "auto-off" sent time per panel
    }

    // Generate a unique ID for each instruction
    generateUniqueId() {
        return uuidv4();
    }

    // General instruction enqueuing
    async enqueueInstruction(panelName, instruction, role) {
        const lastInstructions = await this.getLastQueuedInstructions(panelName, 1);

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

    // Enqueue a dedicated "auto-off" instruction for a panel with internal logging
    // Enqueue a dedicated "auto-off" instruction for a panel with internal logging
    async enqueueAutoOffInstruction(panelName) {
        const lastInstructions = await this.getLastQueuedInstructions(panelName, 1, 'queue');

        // Avoid duplicate off instructions for auto-off
        if (lastInstructions.length > 0 && lastInstructions[0].instruction === 'off') {
            console.log(`[QueueManager] Skipping duplicate off instruction for ${panelName}`);
            return null; // Skip duplicate
        }

        // Create the "off" instruction but log it as "auto-off"
        const instructionItem = {
            id: this.generateUniqueId(),
            instruction: 'off', // Enqueue as "off" instruction
            timestamp: Date.now(),
            status: 'pending',
            role: 'HealthChecker',
        };

        await this.redisClient.lPush(`queue:${panelName}`, JSON.stringify(instructionItem));
        console.log(`[QueueManager] Auto-off instruction (as 'off') enqueued for ${panelName}:`, instructionItem);

        // Log the auto-off as an "Auto-Off Instruction Enqueued"
        Logger.appendLog(panelName, 'Auto-Off Instruction Enqueued', {
            instruction: 'off', // Log as auto-off but instruct as "off"
            instructionId: instructionItem.id,
            timestamp: instructionItem.timestamp,
            role: instructionItem.role,
        });
        console.log(`[QueueManager] Auto-Off Instruction Logged: ${instructionItem.id} for ${panelName}`);

        this.lastAutoOffSent[panelName] = Date.now(); // Update last sent timestamp for "auto-off"
        return instructionItem;
    }


    // Get the last N instructions for a specific panel, supporting different queues
    async getLastQueuedInstructions(panelName, count = 10, queueType = 'queue') {
        const queueItems = await this.redisClient.lRange(`${queueType}:${panelName}`, 0, count - 1);
        return queueItems.map((item) => JSON.parse(item)).reverse(); // Reverse to show oldest first
    }

    // Retrieve the entire queue for a specific panel
    async getQueue(panelName, queueType = 'queue') {
        const queueItems = await this.redisClient.lRange(`${queueType}:${panelName}`, 0, -1);
        return queueItems.map((item) => JSON.parse(item)).reverse(); // Reverse to maintain FIFO order
    }

    // Remove an instruction from the queue by its ID
    async removeInstruction(panelName, instructionId, queueType = 'queue') {
        const queueItems = await this.redisClient.lRange(`${queueType}:${panelName}`, 0, -1);
        for (const item of queueItems) {
            const instruction = JSON.parse(item);
            if (instruction.id === instructionId) {
                await this.redisClient.lRem(`${queueType}:${panelName}`, 0, item);
                console.log(`[QueueManager] Removed instruction ${instructionId} from ${panelName}'s ${queueType}`);
                break;
            }
        }
    }

    // Clear all queues for expected panels
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
