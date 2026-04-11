import mongoose from 'mongoose';

const whatsappLeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const WhatsAppLead = mongoose.model('WhatsAppLead', whatsappLeadSchema);
export default WhatsAppLead;
