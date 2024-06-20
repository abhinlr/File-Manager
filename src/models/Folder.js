import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
import Folder from "./Folder.js";

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    parentFolder: {
        type: ObjectId,
        ref: "Folder"
    },
    path: {
        type: String,
        default: '/'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

FolderSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const newPath = this.getUpdate().path;
        const docId = this.getQuery()._id;

        const originalFolder = await Folder.findById(docId).lean();
        const oldPath = originalFolder.path;

        const escapedOldPath = oldPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        const regex = new RegExp(`^${escapedOldPath}`);

        const result = await Folder.updateMany(
            { path: { $regex: regex } },
            [
                {
                    $set: {
                        path: {
                            $concat: [
                                newPath,
                                { $substrCP: ['$path', { $strLenCP: '$path' }, { $strLenCP: '$$ROOT.path' }] }
                            ]
                        }
                    }
                }
            ]
        );

        console.log(`${result.modifiedCount} documents updated`);

    } catch (error) {
        console.error("Error in pre findOneAndUpdate middleware:", error);
    }
    next();

});

export default mongoose.model('Folder', FolderSchema)