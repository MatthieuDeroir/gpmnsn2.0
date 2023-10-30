const mongoose = require('mongoose');

const moment = require('moment');

const {PanelLogsSchema} = require('../../models/logs/panelLogsModel');

const PanelLogs = mongoose.model('PanelLogs', PanelLogsSchema);

export const addNewPanelLogs = (req, res) => {
    let newPanelLogs = new PanelLogs(req.body);

    newPanelLogs.save((err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    })
}

// export const getPanelLogs = (req, res) => {
//     PanelLogs.find({
//         date: {
//             $gte: 0,
//         }
//     }).limit(30000).sort({_id: -1}).exec((err, PanelLogs) => {
//         if (err) {
//             res.send(err);
//             console.log(err);
//         }
//         console.log(PanelLogs.length);
//         res.json(PanelLogs);
//     })
// }
//
export const getPanelLogs = (req, res) => {
    console.log(req.query)
    console.log(req.query.startDate)
    // const startDate = moment(req.query.startDate, 'DD/MM/YY HH:mm:ss');
    // change the startDate format which is DD/MM/YY HH:mm:ss to iso format
    const startDate = moment(req.query.startDate, 'DD/MM/YY HH:mm:ss').toISOString();
    // const startDate = moment(("20" + req.query.startDate.split('/')[2], req.query.startDate.split('/')[1], req.query.startDate.split('/')[0]), '')

    const endDate = req.query.endDate;
    console.log("panel logs startdate :" + startDate)
    PanelLogs.find({
        date: {
            $gte: startDate,
        }
    }).limit(300000).sort({_id: -1}).exec((err, PanelLogs) => {
        if (err) {
            res.send(err);
            console.log(err);
        }
        console.log(PanelLogs.length);
        res.json(PanelLogs);
    })
}

export const getPanelLogsWithId = (req, res) => {
    PanelLogs.findById(req.params.PanelLogsId, (err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    })
}

export const updatePanelLogs = (req, res) => {
    PanelLogs.findOneAndUpdate({_id: req.params.PanelLogsId}, req.body, {new: true}, (err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    })
}

export const deletePanelLogs = (req, res) => {
    PanelLogs.deleteOne({_id: req.params.PanelLogsId}, (err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json({message: 'Successfully deleted PanelLogs'});
    })
}

export const deleteOldestLog = (req, res) => {
    PanelLogs.findOneAndDelete({}, {sort: {_id: 1}}, (err, PanelLog) => {
        if (err) {
            res.send(err);
        }
        res.json({message: 'Oldest Log successfully deleted'});
    });
}


