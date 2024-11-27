// In your logController.js

// logController.js
const { Op, Sequelize } = require("sequelize");
const Log = require("../models/logModel");
const { Parser } = require('json2csv'); // Assurez-vous que json2csv est installé

// logController.js
exports.getLogs = async (req, res) => {
    const type = req.params.type; // "all", "panels", "users", "panel", "user"
    const value = req.params.value; // Could be undefined
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(0);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    startDate.setHours(0, 0, 0, 0);
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
            whereConditions[Op.and] = [
                Sequelize.where(Sequelize.json('details.role'), {
                    [Op.ne]: null
                }),
            ];
        } else if (type === 'panel') {
            if (value && value !== 'all') {
                whereConditions.panelName = value;
            } else {
                return res.status(400).json({ error: 'Panel name is required' });
            }
        } else if (type === 'user') {
            if (value && value !== 'all') {
                whereConditions[Op.and] = [
                    Sequelize.where(Sequelize.json('details.role'), value),
                ];
            } else {
                return res.status(400).json({ error: 'User role is required' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

        // Adjust the search query
        const searchQuery = req.query.search || '';
        if (searchQuery) {
            whereConditions[Op.or] = [
                { eventType: { [Op.like]: `%${searchQuery}%` } },
                { panelName: { [Op.like]: `%${searchQuery}%` } },
                Sequelize.where(Sequelize.json('details.message'), {
                    [Op.like]: `%${searchQuery}%`
                }),
                Sequelize.where(Sequelize.json('details.role'), {
                    [Op.like]: `%${searchQuery}%`
                }),
                Sequelize.where(Sequelize.json('details.instruction'), {
                    [Op.like]: `%${searchQuery}%`
                }),
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

exports.exportLogs = async (req, res) => {
    console.log('Exporting logs...');
    try {
        // Récupérer tous les logs
        const logs = await Log.findAll();

        // Définir les champs pour le CSV
        const fields = [
            {
                label: 'Date',
                value: 'timestamp',
            },
            {
                label: 'Panneau',
                value: 'panelName',
            },
            {
                label: 'Événement',
                value: 'eventType',
            },
            {
                label: 'Détails',
                value: (row) => JSON.stringify(row.details),
            },
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(logs);

        res.header('Content-Type', 'text/csv');
        res.attachment('logs.csv');
        return res.send(csv);
    } catch (error) {
        console.error('Erreur lors de l\'exportation des journaux:', error);
        res.status(500).send('Erreur lors de l\'exportation des journaux');
    }
};


// logController.js
exports.searchLogs = async (req, res) => {
    const query = req.query.query.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    try {
        const whereConditions = {
            [Op.or]: [
                { eventType: { [Op.like]: `%${query}%` } },
                { panelName: { [Op.like]: `%${query}%` } },
                Sequelize.where(Sequelize.json('details.message'), {
                    [Op.like]: `%${query}%`
                }),
                Sequelize.where(Sequelize.json('details.role'), {
                    [Op.like]: `%${query}%`
                }),
                Sequelize.where(Sequelize.json('details.instruction'), {
                    [Op.like]: `%${query}%`
                }),
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

// Nouvelle fonction pour exporter et supprimer les logs
exports.exportAndDeleteLogs = async (req, res) => {
    console.log('Exporting and deleting logs...');
    try {
        // Récupérer tous les logs
        const logs = await Log.findAll();

        // Définir les champs pour le CSV
        const fields = [
            {
                label: 'Date',
                value: 'timestamp',
            },
            {
                label: 'Panneau',
                value: 'panelName',
            },
            {
                label: 'Événement',
                value: 'eventType',
            },
            {
                label: 'Détails',
                value: (row) => JSON.stringify(row.details),
            },
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(logs);

        // Supprimer tous les logs de la base de données
        await Log.destroy({ where: {}, truncate: true });

        // Envoyer le fichier CSV au client
        res.header('Content-Type', 'text/csv');
        res.attachment('logs.csv');
        return res.send(csv);
    } catch (error) {
        console.error('Erreur lors de l\'exportation et de la suppression des journaux:', error);
        res.status(500).send('Erreur lors de l\'exportation et de la suppression des journaux');
    }
};