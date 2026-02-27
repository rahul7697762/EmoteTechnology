// middleware/upload.middleware.js
import multer from "multer";
import path from "path";
import axios from "axios";

// Configure storage for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';

    if (file.fieldname === 'resume') {
      uploadPath = 'uploads/resumes/';
    } else if (file.fieldname === 'logo') {
      uploadPath = 'uploads/logos/';
    } else if (file.fieldname === 'coverImage') {
      uploadPath = 'uploads/covers/';
    } else if (file.fieldname === 'avatar') {
      uploadPath = 'uploads/avatars/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Helper function to upload file to Bunny CDN
export const uploadToBunny = async (file, bucketPath) => {
  try {
    const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
    const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
    const BUNNY_CDN_HOSTNAME = process.env.BUNNY_PULL_ZONE_URL || process.env.BUNNY_CDN_HOSTNAME || 'your-bunny-hostname.b-cdn.net';

    if (!BUNNY_ACCESS_KEY || !BUNNY_STORAGE_ZONE) {
      throw new Error('Bunny CDN credentials not configured');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${bucketPath}/${file.fieldname}-${uniqueSuffix}${ext}`;

    console.log(`Uploading to Bunny: ${BUNNY_STORAGE_ZONE}/${filename}`);
    const response = await axios.put(
      `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${filename}`,
      file.buffer,
      {
        headers: {
          'Content-Type': file.mimetype,
          'AccessKey': BUNNY_ACCESS_KEY
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    console.log(`Bunny response: ${response.status}`);

    if (response.status === 201) {
      return {
        url: `https://${BUNNY_CDN_HOSTNAME}/${filename}`,
        filename: filename,
        fileSize: file.size
      };
    } else {
      throw new Error('Bunny upload failed');
    }
  } catch (error) {
    console.error('Error uploading to Bunny CDN:', error.message);
    throw error;
  }
};

// Memory storage for processing before Bunny upload
const memoryStorage = multer.memoryStorage();

// Main upload instance with memory storage
export const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Export upload configurations with Bunny support
export const uploadResume = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC/DOCX files are allowed for resumes'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).single('resume');

export const uploadCompanyFiles = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

export const uploadAvatar = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB for avatars
  }
}).single('avatar');

// Additional export for direct local storage (fallback)
export const localUpload = upload;