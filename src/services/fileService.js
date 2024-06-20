import File from "../models/File.js";

async function createFile(data) {
    const file = new File(data);
    const savedFile = await file.save();
    return savedFile;
}

async function getFile(fileId) {
    const file = await File.findById(fileId);
    return file;
}

async function deleteFile(id) {
    const file = await File.findOneAndDelete({id});
    return file;
}

async function updateFile(id,data) {
    console.log(data);
    const updatedFile = await File.findOneAndUpdate({id: id}, data, {new: true});
    return updatedFile;
}

async function getAllFiles(folder) {
    const files = await File.find({folder});
    console.log(files);
    return files;
}

export default {
    createFile,
    getFile,
    deleteFile,
    updateFile,
    getAllFiles
}