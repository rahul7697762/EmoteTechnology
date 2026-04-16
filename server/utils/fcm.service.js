import admin from 'firebase-admin';
import { FcmToken } from '../models/FcmToken.js';

let isFirebaseInitialized = false;

export const initFirebaseAdmin = () => {
  // --- Validate required environment variables ---
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    console.warn('⚠️  FIREBASE_PROJECT_ID is not set. Firebase Admin SDK will not be initialized.');
    return;
  }
  if (!clientEmail) {
    console.warn('⚠️  FIREBASE_CLIENT_EMAIL is not set. Firebase Admin SDK will not be initialized.');
    return;
  }
  if (!privateKey) {
    console.warn('⚠️  FIREBASE_PRIVATE_KEY is not set. Firebase Admin SDK will not be initialized.');
    return;
  }

  // Log (non-sensitive) env var presence for debugging
  console.log('🔍 Firebase env check:');
  console.log(`   FIREBASE_PROJECT_ID   : ${projectId}`);
  console.log(`   FIREBASE_CLIENT_EMAIL : ${clientEmail}`);
  console.log(`   FIREBASE_PRIVATE_KEY  : [${privateKey.length} chars loaded]`);

  try {
    // Replace escaped newline literals (\n) from the .env file with real newlines.
    // This is required so that the PEM block is correctly interpreted by Node's crypto layer.
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });

    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  }
};

export const broadcastBlogNotification = async (title, excerpt, url) => {
  try {
    if (!isFirebaseInitialized) {
      console.warn('⚠️ Firebase Admin SDK is not initialized. Skipping notification broadcast.');
      return { success: false, message: 'Firebase Admin not initialized' };
    }

    const tokens = await FcmToken.find({}).select('token -_id');
    const tokenList = tokens.map(t => t.token);

    if (tokenList.length === 0) {
      console.log('ℹ️ No FCM tokens found to send notifications.');
      return { success: true, count: 0 };
    }

    const message = {
      notification: {
        title: title || 'New Blog Published!',
        body: excerpt || 'Check out our latest post.'
      },
      data: {
        url: url || '/blog'
      },
      tokens: tokenList,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(
      `✅ Notifications broadcasted. Success: ${response.successCount}, Failures: ${response.failureCount}`
    );

    // Clean up invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokenList[idx]);
        }
      });
      if (failedTokens.length > 0) {
        await FcmToken.deleteMany({ token: { $in: failedTokens } });
        console.log(`🗑️ Removed ${failedTokens.length} invalid tokens.`);
      }
    }

    return { success: true, count: response.successCount };
  } catch (error) {
    console.error('❌ Error broadcasting FCM notification:', error);
    return { success: false, error: error.message };
  }
};
