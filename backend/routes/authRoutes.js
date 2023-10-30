import {
    addNewRole,
    getRoles,
} from "../Controllers/login/roleController";

const authController = require("../Controllers/login/authController");
import { verifySignUp } from "../Middlewares";

export default (app) => {
    app.route("/roles")
        .get(getRoles)
        .post(addNewRole);

    app.post(
        "/auth/signup",
        [
            verifySignUp.checkDuplicateUsername,
            verifySignUp.checkRolesExisted
        ],
        authController.signup
    );

    app.post("/auth/signin", authController.signin);
};
