import {
    addNewFile,
    getFiles,
    getFileWithId,
    updateFile,
    deleteFile,
} from '../controllers/medias/fileController';

import {
    addNewEvent,
    getEvents,
    getEventWithId,
    updateEvent,
    deleteEvent,

} from '../controllers/medias/eventController';

import {
    getDisplay,
    updateDisplay,
    addNewDisplay
} from "../controllers/medias/displayController";

import  {
    addNewUser,
    getUsers,
    getUserWithId,
    updateUser,
    deleteUser
} from '../controllers/login/userController';
import  {
    allAccess,
    userBoard,
    adminBoard,
    superuserBoard
} from '../controllers/login/userController'

import {
    addNewUserLogs,
    getUserLogs,
    getUserLogsWithId,
    updateUserLogs,
    deleteUserLogs
} from '../controllers/logs/userLogsController'

import {
    addNewPanelLogs,
    getPanelLogs,
    getPanelLogsWithId,
    updatePanelLogs,
    deletePanelLogs
} from '../controllers/logs/panelLogsController'

import {
    addNewPanel,
    getPanel,
    getPanelWithId,
    updatePanel,
    deletePanel
} from '../controllers/panel/panelController'

import {
    addNewInstruction,
    getInstruction,
    getInstructionWithId,
    updateInstruction,
    deleteInstruction
} from '../controllers/instructions/instructionController'

import {
    addNewRole,
    getRoles,
} from "../controllers/login/roleController";

const controller = require("../controllers/login/authController");
import {authentication, verifySignUp} from "../middleware";

const routes = (app) => {
    app.route('/files')
        //GET endpoint
        .get(getFiles)

        // POST endpoint
        .post(addNewFile);

    app.route('/file/:FileId')
        // Get a specific file
        .get(getFileWithId)

        // Update a specific file
        .put(updateFile)

        // Deleter a specific file
        .delete(deleteFile);
    app.route('/events')
        //GET endpoint
        .get(getEvents)

        // POST endpoint
        .post(addNewEvent);

    app.route('/event/:EventId')
        // Get a specific file
        .get(getEventWithId)

        // Update a specific file
        .put(updateEvent)

        // Deleter a specific file
        .delete(deleteEvent);


    app.route('/users')
        //GET endpoint
        .get(getUsers)

        // POST endpoint
        .post(addNewUser);
    app.route('/user/:UserId')
        // Get a specific file
        .get(getUserWithId)

        // Update a specific file
        .put(updateUser)

        // Deleter a specific file
        .delete(deleteUser);

    app.route('/medias')

    app.route("/all")
        .get(allAccess);
    app.route("/user")
        .get(userBoard);
    app.route("/admin")
        .get(adminBoard);
    app.route("/superuser")
        .get(superuserBoard);

    app.route("/display")
        .get(getDisplay)
        .post(addNewDisplay)
    app.route("/display/:DisplayId")
        .put(updateDisplay)

    app.route("/userLogs")
        .get(getUserLogs)
        .post(addNewUserLogs)
    app.route("/userLog/:UserLogId")
        .get(getUserLogsWithId)
        .put(updateUserLogs)
        .delete(deleteUserLogs)

    app.route("/panelLogs")
        .get(getPanelLogs)
        .post(addNewPanelLogs)
    app.route("/panelLog/:PanelLogId")
        .get(getPanelLogsWithId)
        .put(updatePanelLogs)
        .delete(deletePanelLogs)

    app.route("/panels")
        .get(getPanel)
        .post(addNewPanel)
    app.route("/panel/:PanelId")
        .get(getPanelWithId)
        .put(updatePanel)
        .delete(deletePanel)

    app.route("/instructions")
        .get(getInstruction)
        .post(addNewInstruction)
    app.route("/instruction/:InstructionId")
        .get(getInstructionWithId)
        .put(updateInstruction)
        .delete(deleteInstruction)

    app.route("/roles")
        .get(getRoles)
        .post(addNewRole)




    app.post(
        "/auth/signup",
        [
            verifySignUp.checkDuplicateUsername,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/auth/signin", controller.signin)

}
export default routes;

