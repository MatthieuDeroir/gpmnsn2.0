import mongoose from 'mongoose';
import {DisplaySchema} from '../../models/medias/displayModel';

const Display = mongoose.model('Display', DisplaySchema);


export const addNewDisplay = (req, res) => {
    let newDisplay = new Display(req.body);

    newDisplay.save((err, Display) => {
        if (err) {
            res.send(err);
        }
        res.json(Display);
    })
}

export const getDisplay = (req, res) => {

    Display.find({}, (err, Display) => {
        if (err) {
            res.send(err);
        }

        res.json(Display);
    })
}

export const updateDisplay = (req, res) => {
    let newDisplay = new Display(req.body);

    Display.findOneAndUpdate({_id: "629491ad5151c9655a057ef7"}, req.body, {new: true}, (err, Display) => {
        if (err) {
            res.send(err);
        }
        res.json(Display);
    })
}
