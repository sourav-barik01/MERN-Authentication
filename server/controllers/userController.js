import userModal from "../models/userModel.js"

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModal.findById(userId);
        if(!user){
            return res.json({
                success: false,
                message: "User Not Exist!!"
            })
        }
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}