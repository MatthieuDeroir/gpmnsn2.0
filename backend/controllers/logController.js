// In your logController.js

const {Op} = require("sequelize");
const Log = require("../models/logModel");
exports.getLogs = async (req, res) => {
    const type = req.params.type; // "all", "panels", "users", "panel", "user"
    const value = req.params.value; // Could be undefined
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(0);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const searchQuery = req.query.search || '';

    endDate.setHours(23, 59, 59, 999);

    try {
        const whereConditions = {
            timestamp: {
                [Op.between]: [startDate, endDate],
            },
        };

        if (type === 'all') {
            // No additional conditions
        } else if (type === 'panels') {
            whereConditions.panelName = { [Op.ne]: null };
        } else if (type === 'users') {
            whereConditions['details.role'] = { [Op.ne]: null };
        } else if (type === 'panel') {
            if (value && value !== 'all') {
                whereConditions.panelName = value;
            } else {
                return res.status(400).json({ error: 'Panel name is required' });
            }
        } else if (type === 'user') {
            if (value && value !== 'all') {
                whereConditions['details.role'] = value;
            } else {
                return res.status(400).json({ error: 'User role is required' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

        if (searchQuery) {
            whereConditions[Op.or] = [
                { eventType: { [Op.like]: `%${searchQuery}%` } },
                { panelName: { [Op.like]: `%${searchQuery}%` } },
                { 'details.message': { [Op.like]: `%${searchQuery}%` } },
                { 'details.role': { [Op.like]: `%${searchQuery}%` } },
                { 'details.instruction': { [Op.like]: `%${searchQuery}%` } },
            ];
        }

        const offset = (page - 1) * limit;

        const { rows: logs, count: totalLogs } = await Log.findAndCountAll({
            where: whereConditions,
            order: [['timestamp', 'DESC']],
            limit,
            offset,
        });

        res.json({
            logs,
            page,
            limit,
            totalLogs,
            totalPages: Math.ceil(totalLogs / limit),
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.searchLogs = async (req, res) => {
    const query = req.query.query.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    try {
        const whereConditions = {
            [Op.or]: [
                { eventType: { [Op.like]: `%${query}%` } },
                { panelName: { [Op.like]: `%${query}%` } },
                { 'details.message': { [Op.like]: `%${query}%` } },
                { 'details.role': { [Op.like]: `%${query}%` } },
                { 'details.instruction': { [Op.like]: `%${query}%` } },
            ],
        };

        const offset = (page - 1) * limit;

        const { rows: logs, count: totalLogs } = await Log.findAndCountAll({
            where: whereConditions,
            order: [['timestamp', 'DESC']],
            limit,
            offset,
        });

        res.json({
            logs,
            page,
            limit,
            totalLogs,
            totalPages: Math.ceil(totalLogs / limit),
        });
    } catch (error) {
        console.error('Error searching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};