//we bring mongoose to it 
//db connect karne ke baad we create a schema to see how user data will be 
//nstall mongoose 
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        // admin or user so enum is used when we v few vals and we need 1 value only 
        enum: ['instructor', 'student'],
        default: 'student'
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    photoUrl: {
        type: String,
        default:" "

    }
},

    
 {
    timestamps: true
});
const User = mongoose.model("User", userSchema);
export default User;