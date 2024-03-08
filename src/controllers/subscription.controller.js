import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../models/user.model.js";
import {Subscription} from "../models/subscription.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const getSubscribedChannels  = asyncHandler( async(req, res) => {

    const {subscriberId} = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid Channel ID")
    }

    const subscriber = await User.findById({_id: subscriberId})

    if(!subscriber){
        throw new ApiError(404, "Channel Not Found")
    }

    const channels = await Subscription.find({ subscriber: subscriberId }).populate('channel', '-password -refreshToken -watchHistory').select("_id channel")

    if(!channels?.length){
        throw new ApiError(404, "Channels Not Found")
    }

    const subscribedChannel = {
        subscribedChannels: channels,
        subscribedChannelsCount: channels.length
    }

    return res.status(200).json( new ApiResponse(200,subscribedChannel,"Subscribed Channels Fetched Successfully"))

})

const getUserChannelSubscribers  = asyncHandler( async(req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel ID")
    }

    const channel = await User.findById({_id: channelId})

    if(!channel){
        throw new ApiError(404, "Channel Not Found")
    }

    // CLassic way
    // const subscribers  =  await Subscription.aggregate([
    //     {
    //         $match:{
    //             channel: new mongoose.Types.ObjectId(channelId)
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from: "users",
    //             localField: "subscriber",
    //             foreignField: "_id",
    //             as: "channelSubscribers",
    //             pipeline:[
    //                 {
    //                     $project:{
    //                         _id: 1,
    //                         username: 1,
    //                         avatar: 1,
    //                         fullname: 1,
    //                         email: 1
    //                     }
    //                 }
                   
    //             ]
    //         }
    //     },
    //     {
    //         $project:{
    //             channelSubscribers: 1,
    //             channelSubscribersCount: 1
    //         }
    //     }
    // ])

    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', '-password -refreshToken -watchHistory').select("_id subscriber")

    if(!subscribers?.length){
        throw new ApiError(404, "Subscribers Not Found")
    }

    const channelSubscribers = {
        channelSubscribers: subscribers,
        channelSubscribersCount: subscribers.length
    }

    return res.status(200).json( new ApiResponse(200,channelSubscribers,"Subscriber Fetched Successfully"))

})

const toggleSubscription = asyncHandler(async(req, res) => {

    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id")
    }

    const channel = await User.findById({_id: channelId})

    if(!channel){
        throw new ApiError(404,"Channel Not Found")
    }

    const deleteSubscriber = await Subscription.findOneAndDelete({
        subscriber: req.user?._id,
        channel: channelId,
    })

    if (deleteSubscriber){
        return res.status(200).json( new ApiResponse(200, {}, "Channel Unsubscriber Successfully"))
    }else{
        await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId
        })
        return res.status(200).json( new ApiResponse(200, {}, "Channel Subscribed Successfully"))
    }    
 
})

export {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription
}