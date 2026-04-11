import WhatsAppLead from '../models/whatsappLead.model.js';

export const saveLead = async (req, res) => {
    try {
        const { name, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ success: false, message: 'Name and message are required' });
        }

        const lead = new WhatsAppLead({ name, message });
        await lead.save();

        res.status(201).json({ success: true, message: 'Lead saved successfully' });
    } catch (error) {
        console.error('Error saving WhatsApp lead:', error);
        res.status(500).json({ success: false, message: 'Server error while saving lead' });
    }
};
