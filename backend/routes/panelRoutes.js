import {
    addNewPanel,
    getPanel,
    getPanelWithId,
    updatePanel,
    deletePanel
} from '../Controllers/panel/panelController';

export default (app) => {
    app.route("/panels")
        .get(getPanel)
        .post(addNewPanel);

    app.route("/panel/:PanelId")
        .get(getPanelWithId)
        .put(updatePanel)
        .delete(deletePanel);
};
