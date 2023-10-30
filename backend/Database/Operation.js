// ./Database/Operation.js

const handleDatabaseOperation = async (operation, res) => {
    try {
        const result = await operation();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

module.exports = handleDatabaseOperation;
