const mongoose = require('mongoose');

const { RoleSchema } = require("../../models/login/roleModel");

const Role = mongoose.model('Role', RoleSchema);

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content")
}
exports.userBoard = (req, res) => {
    res.status(200).send("User Content")
}
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content")
}
exports.superuserBoard = (req, res) => {
    res.status(200).send("Superuser Content")
}

export const addNewRole = (req, res) => {
    let newRole = new Role(req.body);

    newRole.save((err, Role) => {
        if (err) {
            res.send(err);
        }
        res.json(Role);
    })
}

export const getRoles = (req, res) => {
    Role.find({}, (err, Role) => {
        if (err) {
            res.send(err);
        }
        res.json(Role);
    })
}

export const getRoleWithId = (req, res) => {
    Role.findById(req.params.RoleId, (err, Role) => {
        if (err) {
            res.send(err);
        }
        res.json(Role);
    })
}

export const updateRole = (req, res) => {
    Role.findOneAndUpdate({ _id: req.params.RoleId }, (err, Role) => {
        console.log(Role)
        if (err) {
            res.send(err);
            return;
        }
        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    Role.roles = req.body.roles[0];
                    console.log(Role.roles)
                    res.json(Role)
                }
            );
        }
    })
}

export const deleteRole = (req, res) => {
    Role.remove({ _id: req.params.RoleId }, (err, Role) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted Role' });
    })
}
