// routes/panelRoutes.js
const express = require('express');

/**
 * Fabrique un router Express pour gérer les panneaux,
 * en utilisant l'instance unique du clientManager
 */
function createPanelRoutes(clientManager) {
    const router = express.Router();

    // GET /export-csv
    router.get('/export-csv', (req, res) => {
        if (!clientManager) {
            return res.status(500).send('ClientManager is not initialized.');
        }
        const allClients = clientManager.getLastClientData();
        const panels = allClients.filter(c => c.clientType === 'panel');

        let csvContent = 'Panel,Etat\n';
        panels.forEach((panel) => {
            const etat = (panel.state === 'on') ? 'allumé' : 'éteint';
            csvContent += `${panel.name},${etat}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="panels.csv"');
        res.send(csvContent);
    });

    // Autres endpoints si besoin

    return router;
}

module.exports = createPanelRoutes;
