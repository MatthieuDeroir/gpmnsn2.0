import { Router } from "express";
import { userController } from "../Controllers";

const router = Router();

router.get('/', (req, res) => {
    userController.getAllUsers()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', (req, res) => {
    userController.getUserById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', (req, res) => {
    userController.createUser(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.put('/:id', (req, res) => {
    userController.updateUser(req.params.id, req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.delete('/:id', (req, res) => {
    userController.deleteUser(req.params.id)
    .then(() => res.json({ message: 'User deleted' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

export default router;

