import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        verifyOtp: {type: String, default: ''},
        verifyOtpExpireAt: {type: Number, default: 0},
        isAccountVerified: {type: Boolean, default: false},      // Basically 2FactorAuth
        resetOtp: {type: String, default: ''},
        resetOtpExpireAt: {type: Number, default: 0},
    }
)

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel; 