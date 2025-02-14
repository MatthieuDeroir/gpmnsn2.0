// Dans votre fichier de routes (par exemple routes/panelRoutes.js)
module.exports = (clientManager) => {
    const router = require('express').Router();

    router.get('/states', (req, res) => {
        // Les panneaux attendus
        const expectedPanels = ['amont', 'aval', 'indret'];

        // Récupérer les réglages des panneaux depuis le clientManager
        // On suppose que clientManager.getPanelSettings() renvoie un objet
        // de la forme { amont: { state: 'on' }, aval: { state: 'off' }, ... }
        const panelSettings = clientManager.getPanelSettings();

        // Préparer l'objet résultat pour n'inclure que les panneaux attendus
        const result = {};
        expectedPanels.forEach(panel => {
            // Si le panneau existe et que son état est 'on', renvoyer true, sinon false
            result[panel] = !!(panelSettings[panel] && panelSettings[panel].state === 'on');
        });

        return res.json(result);
    });

    return router;
};
