import Message from '../models/message.model.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import { Notification } from '../models/notification.model.js';
import { emitNotification } from '../services/socket.service.js';

export const sendMessage = async (req, res) => {
  try {
    const { jobId, applicantId, content } = req.body;
    const senderId = req.user._id;

    // 1. Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // 2. Verify authorization
    const companyId = job.company;
    const isApplicant = applicantId.toString() === senderId.toString();

    // Fetch the company to get the owner's userId
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Check if there is an application for this job by this applicant
    const application = await Application.findOne({ job: jobId, candidate: applicantId });
    if (!application) {
      return res.status(403).json({ success: false, message: 'Only applicants can participate in this chat' });
    }

    // Role-based auth check
    if (!isApplicant) {
      if (req.user.role !== 'COMPANY' && req.user.role !== 'EMPLOYER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
    }

    const newMessage = await Message.create({
      job: jobId,
      applicant: applicantId,
      company: companyId,
      sender: senderId,
      content,
      isRead: false
    });

    // 3. TRIGGER NOTIFICATION
    try {
      // Determine recipient: 
      // If student sent it, recipient is company.user
      // If company sent it, recipient is the applicant (userId)
      const recipientId = isApplicant ? company.user : applicantId;
      const senderName = isApplicant ? req.user.name : company.companyName;

      const title = "New Message Received";
      const message = `${senderName} sent you a message regarding the job: ${job.title}`;
      
      // Save notification to DB
      await Notification.create({
        userId: recipientId,
        type: "NEW_MESSAGE",
        title,
        message,
        metadata: {
          jobId: jobId,
          applicationId: application._id
        }
      });

      // Emit real-time notification
      emitNotification(recipientId, "NEW_MESSAGE", {
        title,
        message,
        jobId: jobId,
        senderName,
        content: content.substring(0, 50) + (content.length > 50 ? '...' : '')
      });
    } catch (notifError) {
      console.error('Error sending message notification:', notifError);
    }

    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;
    const userId = req.user._id;

    // Verify authorization
    // User must be the applicant OR the company that posted the job
    const messages = await Message.find({
      job: jobId,
      applicant: applicantId
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
