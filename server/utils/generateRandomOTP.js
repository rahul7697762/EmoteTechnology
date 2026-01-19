// generate random 6 digit OTP for verfication
export const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}