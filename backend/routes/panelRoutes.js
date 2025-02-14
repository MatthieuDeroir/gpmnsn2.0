// routes/panelRoutes.js

const express = require('express');
const router = express.Router();

module.exports = (clientManager) => {
    // ... vos autres routes

    router.get('/states', (req, res) => {
        if (!clientManager) {
            return res.status(500).json({ error: 'ClientManager is not initialized.' });
        }

        // Récupère la liste des panels et leurs infos
        const panelSettings = clientManager.getPanelSettings();
        // panelSettings ressemble à :
        // {
        //   aval:   { state: 'on' ou 'off', ... },
        //   amont:  { state: 'on' ou 'off', ... },
        //   indret: { state: 'on' ou 'off', ... }
        // }

        // Convertir l'état 'on'/'off' en booléen
        const panelStates = {};
        for (const [panelName, data] of Object.entries(panelSettings)) {
            panelStates[panelName] = (data.state === 'on');
        }
        // panelStates ressemblera à :
        // { aval: true/false, amont: true/false, indret: true/false }

        return res.json(panelStates);
    });

    return router;
};
