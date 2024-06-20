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
        const newPath = this.getUpdate().path;  // Assuming newPath is root/updated/sub
        const docId = this.getQuery()._id;  // Assuming _id is provided in the query

        // Fetch the original folder document from MongoDB
        const originalFolder = await Folder.findById(docId).lean();
        const oldPath = originalFolder.path;  // Assuming originalFolder contains the current path

        // Escape any special characters in oldPath for regex matching
        const escapedOldPath = oldPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        // Construct the regular expression to match oldPath and capture the remainder
        const regex = new RegExp(`^${escapedOldPath}`);

        // Perform the update operation using updateMany
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