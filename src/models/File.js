import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const FileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    folder:{
        type: ObjectId,
        ref: "Folder",
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    owner:{
        type: ObjectId,
        ref: "User",
        required: true
    },
    metadata: {
        type: {},
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("File", FileSchema);