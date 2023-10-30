import {
    addNewUser,
    getUsers,
    getUserWithId,
    updateUser,
    deleteUser,
    allAccess,
    userBoard,
    adminBoard,
    superuserBoard
} from '../Controllers/login/userController';

export default (app) => {
    app.route('/users')
        .get(getUsers)
        .post(addNewUser);

    app.route('/user/:UserId')
        .get(getUserWithId)
        .put(updateUser)
        .delete(deleteUser);

    app.route("/all").get(allAccess);
    app.route("/user").get(userBoard);
    app.route("/admin").get(adminBoard);
    app.route("/superuser").get(superuserBoard);
};
