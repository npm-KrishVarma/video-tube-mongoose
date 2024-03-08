import { Router } from "express";
import {getCurrentUser, loginUser, changeCurrentPassword,  logoutUser, registerUser, updateAccountDetails, updateCoverImage, updateUserAvatar, refreshAccessToken, getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)   

//secure route
router.route("/logout").post(verifyJWT,logoutUser)
router.route('/change-password').post(verifyJWT,changeCurrentPassword)
router.route('/refresh-token').post(verifyJWT,refreshAccessToken)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)

export default router