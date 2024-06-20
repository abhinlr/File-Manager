import folderService from "../services/folderService.js";
import fs from "fs";
import {fileURLToPath} from 'url';
import path from "path";
import fileService from "../services/fileService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


async function createRootFolder(userId) {
    const folder = path.join(__dirname, '..', 'uploads', userId);
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {recursive: true});
    }
    return folder;
}


async function createFolder(req, res) {
    const {name, parentFolder} = req.body;
    const owner = req.user._id;
    if (!name) {
        return res.status(400).json({msg: "Name is required"});
    }
    const rootFolderName = owner.toString();
    const isRootFolder = parentFolder === rootFolderName;
    let parentFolderPath;
    isRootFolder ? parentFolderPath = `${parentFolder}` : parentFolderPath = await folderService.getFilePath(parentFolder);
    console.log({name, parentFolder});
    const existingFolder = await folderService.checkExistFolder({name, parentFolder});
    if (existingFolder) {
        return res.status(400).json({msg: "Folder name already exists"});
    }
    const folderPath = path.join(parentFolderPath, name);

    const folder = await folderService.createFolder({name, owner, parentFolder, path: folderPath});
    if (!folder) {
        return res.status(500).json({success: false,msg: "Failed to create folder"});
    }
    res.status(201).json({success: true, folder});
}

async function renameFolder(req, res) {
    const {name} = req.body;
    const {folderId} = req.query;
    const folder = await folderService.getFolder(folderId);
    if (!folder) {
        return res.status(404).json({msg: "Folder not found"});
    }
    const newPath = path.join(folder.path,'..' , name);
    const updatedFolder = await folderService.updateFolder(folderId, {name,path: newPath});
    if (!updatedFolder) {
        return res.status(500).json({msg: "Failed to update folder"});
    }
    res.status(200).json({success: true, folder: updatedFolder});
}

async function deleteFolder(req, res) {
    const {folderId} = req.params;
    const folder = await folderService.getFolder(folderId);
    if (!folder) {
        return res.status(404).json({msg: "Folder not found"});
    }
    const deletedFolder = await folderService.deleteFolder(folderId);
    if (!deletedFolder) {
        return res.status(500).json({msg: "Failed to delete folder"});
    }
    res.status(200).json({success: true});
}

async function getFolderContents(req, res) {
    const {folderId} = req.query;
    const folders = await folderService.getAllFolder(folderId);
    const files = await fileService.getAllFiles(folderId);
    res.status(200).json({success: true, folders, files});
}



export default {createFolder, createRootFolder,renameFolder,deleteFolder, getFolderContents};