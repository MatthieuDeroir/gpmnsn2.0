import mongoose from 'mongoose';
import {FileSchema} from '../../models/medias/fileModel';

const File = mongoose.model('File', FileSchema);

export const addNewFile = (req, res) => {
    let newFile = new File(req.body);

    newFile.save((err, File) => {
        if (err) {
            res.send(err);
        }
        res.json(File);
    })
}

export const getFiles = (req, res) => {
    File.find({}, (err, File) => {
        if (err) {
            res.send(err);
        }
        res.json(File);
    })
}

export const getFileWithId = (req, res) => {
    File.findById(req.params.FileId, (err, File) => {
        if (err) {
            res.send(err);
        }
        res.json(File);
    })
}

export const updateFile = (req, res) => {
    File.findOneAndUpdate({_id: req.params.FileId}, req.body, {new: true}, (err, File) => {
        if (err) {
            res.send(err);
        }
        res.json(File);
    })
}

export const deleteFile = (req, res) => {
    File.remove({_id: req.params.FileId}, (err, File) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted file'});
    })
}
