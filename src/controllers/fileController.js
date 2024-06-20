import multer from "multer";
import crypto from "crypto";
import { extname } from "path";
import path from "path";
import {fileURLToPath} from "url";
import fs from "fs";

import fileService from "../services/fileService.js";
import folderService from "../services/folderService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../uploads/${req.user._id}`));
    },
    filename: (req, file, cb) => {
        if (!file) {
            const error = new Error('No file uploaded');
            error.code = 'NO_FILE';
            return cb(error);
        }
        crypto.randomBytes(16, (err, buffer) => {
            if (err) return cb(err);
            const uniqueSuffix = buffer.toString('hex');
            const fileExtension = extname(file.originalname);
            cb(null, uniqueSuffix + fileExtension);
        });
    }
});

const upload = multer({ storage });

async function uploadFile(req, res) {
    const { folderId } = req.query;

    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            let folder;
            console.log(folderId,req.user._id.toString());
            if(folderId !== req.user._id.toString()) {
                folder = await folderService.getFolder({_id:folderId});
                if (!folder) {
                    return res.status(404).json({ error: 'Folder not found' });
                }
            }else{
                folder = {_id:req.user._id, path: req.user._id.toString()};
            }

            const file = req.file;
            const filePath = path.join(folder.path, file.filename);
            const fileData = {
                fileName: file.originalname,
                folder: folder._id,
                metadata: {
                    size: file.size,
                    type: file.mimetype
                },
                owner: req.user._id,
                filePath
            };

            const savedFile = await fileService.createFile(fileData);
            res.status(201).json(savedFile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

async function getFile(req, res) {
    try {
        const { fileId } = req.query;
        const file = await fileService.getFile(fileId);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.setHeader('Content-Type', file.metadata.type);

        const fileName = file.filePath.match(/[^\\]+$/)[0];
        const filePath = path.join(__dirname, '..', 'uploads', req.user._id.toString(), fileName);

        if (!fs.existsSync(filePath)) {
            console.error('File does not exist:', filePath);
            return res.status(404).json({ error: 'File not found' });
        }

        const readStream = fs.createReadStream(filePath);

        readStream.on('error', (err) => {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        });

        readStream.pipe(res);

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteFile(req, res) {
    const { fileId } = req.query;
    const file = await fileService.deleteFile(fileId);
    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

    const fileName = file.filePath.match(/[^\\]+$/)[0];
    const filePath = path.join(__dirname, '..', 'uploads', req.user._id.toString(), fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    res.status(200).json({ success: true });
}

async function renameFile(req, res) {
    const {fileName} = req.body;
    const {fileId} = req.params;

    const updatedFile = await fileService.updateFile(fileId, {fileName});
    if (!updatedFile) {
        return res.status(500).json({msg: "Failed to update file"});
    }
    res.status(200).json({success: true, file: updatedFile});
}

async function getAllFiles(req, res) {
    const { folderId } = req.query;
    const files = await fileService.getAllFiles(folderId);
    res.status(200).json({success: true, files});
}

export default { uploadFile, getFile, deleteFile, renameFile, getAllFiles };
