import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = mongoose.Schema({
    videoFile: {
        type: String,
        required: [true, "Video Required"]
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail Required"]
    },
    title: {
        type: String,
        required: [true, "Title Required"]
    },
    description:{
        type: String,
        required: [true, "Description Required"]
    },
    duration: {
        type: Number,
        required: [true, "Duration Required"]
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.modal("Video", videoSchema)