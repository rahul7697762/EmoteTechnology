import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { uploadFileToBunny, deleteFileFromBunny } from "../services/bunny.service.js";
import { sendEmail } from "../utils/sendMail.js";
import { accountDeletedMailTemplate, accountStatusMailTemplate } from "../constants/mailTemplates.js";

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile information
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, profile, facultyProfile } = req.body;

        // Update fields if provided
        if (name) user.name = name;

        // update profile fields 
        if (profile) {

            if (profile.bio) user.profile.bio = profile.bio;

            // Update avatar if there is a new one (uploaded via multer)
            if (req.file) {
                // Check if user already has an avatar and delete it (if it's a BunnyCDN url)
                if (user.profile.avatar) {
                    try {
                        let oldAvatarUrl = user.profile.avatar;
                        // Extract the path: "images/filename.ext"
                        // Case 1: Pull Zone URL: https://cdn.example.com/images/file.jpg -> pathname: /images/file.jpg -> substring(1): images/file.jpg
                        // Case 2: Storage URL: https://sg.storage.bunnycdn.com/storage-zone/images/file.jpg -> handled differently?
                        // The delete service expects the path relative to the storage zone.

                        // Simple extraction assuming standard URL structure we generate: ".../images/..."
                        // Using URL API to be safe
                        if (!oldAvatarUrl.startsWith('http')) {
                            oldAvatarUrl = `https://${oldAvatarUrl}`;
                        }
                        const urlObj = new URL(oldAvatarUrl);
                        const pathParts = urlObj.pathname.split('/');
                        // Find 'images' index and take everything after
                        const imagesIndex = pathParts.indexOf('images');

                        if (imagesIndex !== -1) {
                            const relativePath = pathParts.slice(imagesIndex).join('/');
                            await deleteFileFromBunny(relativePath);
                        }
                    } catch (err) {
                        console.error("Failed to delete old avatar:", err);
                        // Continue with upload even if delete fails
                    }
                }

                // Upload to BunnyCDN                
                // Generate filename: avatar-{userId}-{timestamp}.ext
                const fileExtension = req.file.originalname.split('.').pop();
                const fileName = `avatar-${user._id}-${Date.now()}.${fileExtension}`;

                const fileUrl = await uploadFileToBunny("avatar", req.file.buffer, fileName);
                user.profile.avatar = fileUrl;
            }

            if (profile.phone) user.profile.phone = profile.phone;
            if (profile.country) user.profile.country = profile.country;

            // add login to get timezone from according to user location
            // todo : implement actual timezone logic
        }
        if (facultyProfile && user.role === "FACULTY") {
            if (facultyProfile.expertise) user.facultyProfile.expertise = facultyProfile.expertise;
            if (facultyProfile.yearsOfExperience) user.facultyProfile.yearsOfExperience = facultyProfile.yearsOfExperience;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Please try again later.'
        });
    }
};




/**
 * @route   GET /api/users/:id
 * @desc    Get user profile information
 * @access  Private - ADMIN ONLY
 */

export const getUserProfileById = async (req, res) => {
    try {
        // getting user id from req params
        const userId = req.params.id;

        // getting user by id 
        const user = await User.findById(userId);

        // if user not found then return 404
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

/**
 * @route   GET /api/users
 * @desc    Get all users profile information
 * @access  Private - ADMIN ONLY
 */

export const getAllUsers = async (req, res) => {
    try {
        // implement the pagination logic here
        // todo : pagination logic
        // fetching all users from database only latest 10 and only get limited fields
        const users = await User.find().limit(10).sort({ createdAt: -1 }).select('name email role createdAt profile.avatar isVerified accountStatus');

        // if no users found 
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found'
            });
        }

        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

/**
 * @route   PUT /api/users/:id/status
 * @desc    Update user account status (ACTIVE, SUSPENDED, DELETED)
 * @access  Private - ADMIN ONLY
 */

export const updateUserAccountStatus = async (req, res) => {
    {
        try {
            const userId = req.params.id;
            const { accountStatus } = req.body; // expected values: ACTIVE, SUSPENDED, DEACTIVATED

            // Validate accountStatus
            const validStatuses = ["ACTIVE", "SUSPENDED", "DEACTIVATED"];
            if (!validStatuses.includes(accountStatus)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid account status'
                });
            }
            // Find user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            // Update account status
            user.accountStatus = accountStatus;
            await user.save();
            // send mail to user about account status update
            sendEmail(user.email, "Account Status Update", accountStatusMailTemplate(user.name, accountStatus));

            res.status(200).json({
                success: true,
                message: 'Account status updated successfully',
                user: user
            });
        } catch (error) {
            console.error('Error updating account status:', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both current and new passwords'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Find user with password
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect current password'
            });
        }

        // Update password (hashing is handled by pre-save hook in model usually, but let's check model or double check)
        // Assuming model has pre-save hook for password hashing
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/**
 * @route   DELETE /api/users/deleteMe
 * @desc    user delete itself
 * @access  Private
 */

export const deleteUserAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to delete account."
            });
        }

        // Fetch user WITH password
        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: "Incorrect password. Account deletion failed."
            });
        }

        // Soft delete
        user.deletedAt = new Date();
        user.accountStatus = "DEACTIVATED";

        await user.save();

        //  force logout user 
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/"
        });

        // sending mail to user about account deletion
        sendEmail(user.email, "Account Deletion", accountDeletedMailTemplate(user.name));

        return res.status(200).json({
            success: true,
            message: "Your account has been deleted successfully."
        });

    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
