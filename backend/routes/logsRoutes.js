import {
    addNewUserLogs,
    getUserLogs,
    getUserLogsWithId,
    updateUserLogs,
    deleteUserLogs
} from '../Controllers/logs/userLogsController';

import {
    addNewPanelLogs,
    getPanelLogs,
    getPanelLogsWithId,
    updatePanelLogs,
    deletePanelLogs
} from '../Controllers/logs/panelLogsController';

export default (app) => {
    app.route("/userLogs")
        .get(getUserLogs)
        .post(addNewUserLogs);

    app.route("/userLog/:UserLogId")
        .get(getUserLogsWithId)
        .put(updateUserLogs)
        .delete(deleteUserLogs);

    app.route("/panelLogs")
        .get(getPanelLogs)
        .post(addNewPanelLogs);

    app.route("/panelLog/:PanelLogId")
        .get(getPanelLogsWithId)
        .put(updatePanelLogs)
        .delete(deletePanelLogs);
};
