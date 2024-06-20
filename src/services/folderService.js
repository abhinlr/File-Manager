import Folder from "../models/Folder.js";

async function checkExistFolder(data) {
    const folder = await Folder.findOne(data);
    return folder;
}

async function getFolder(data) {
    const folder = await Folder.findOne({_id:data});
    return folder;
}

async function getFilePath(folderId) {
    const folder = await Folder.findById(folderId);
    return folder.path;
}

async function createFolder(data) {
    const folder = new Folder(data);
    const savedFolder = await folder.save();
    return savedFolder;
}

async function updateFolder(id, data) {
    console.log('service id', id);
    const updatedFolder = await Folder.findOneAndUpdate({_id: id}, data, {new: true});
    return updatedFolder;
}

async function deleteFolder(id) {
    const deletedFolder = await Folder.findOneAndDelete({id});
    return deletedFolder;
}

async function getAllFolder(parentFolder) {
    const folders = await Folder.find({parentFolder});
    return folders;
}

export default {
    getFolder,
    createFolder,
    getFilePath,
    updateFolder,
    deleteFolder,
    getAllFolder,
    checkExistFolder
}