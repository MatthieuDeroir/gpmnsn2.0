import mongoose from 'mongoose';
import {EventSchema} from '../../models/medias/eventModel';

const Event = mongoose.model('Event', EventSchema);

export const addNewEvent = (req, res) => {
    let newEvent = new Event(req.body);

    newEvent.save((err, Event) => {
        if (err) {
            res.send(err);
        }
        res.json(Event);
    })
}

export const getEvents = (req, res) => {
    Event.find({}, (err, Event) => {
        if (err) {
            res.send(err);
        }
        res.json(Event);
    })
}

export const getEventWithId = (req, res) => {
    Event.findById(req.params.EventId, (err, Event) => {
        if (err) {
            res.send(err);
        }
        res.json(Event);
    })
}

export const updateEvent = (req, res) => {
    Event.findOneAndUpdate({_id: req.params.EventId}, req.body, {new: true}, (err, Event) => {
        if (err) {
            res.send(err);
        }
        res.json(Event);
    })
}

export const deleteEvent = (req, res) => {
    Event.deleteOne({_id: req.params.EventId}, (err, Event) => {
        if (err) {
            res.send(err);
        }
        res.json({message: 'Successfully deleted Event'});
    })
}

