import axios from 'axios';

export const uploadFileToBunny = async (directoryPath, fileBuffer, fileName) => {
    const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE;
    const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
    const STORAGE_ENDPOINT = process.env.BUNNY_STORAGE_ENDPOINT || 'storage.bunnycdn.com';

    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
        throw new Error('BunnyCDN configuration missing (STORAGE_ZONE_NAME or ACCESS_KEY)');
    }

    // Generate a unique filename: timestamp-random-sanitizedName
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E4)}`;
    const sanitizedFileName = fileName
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/[^a-zA-Z0-9.\-_]/g, ''); // Remove special chars
    const finalFileName = `${uniqueSuffix}-${sanitizedFileName}`;

    const url = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE_NAME}/${directoryPath}/${finalFileName}`;
    console.log(`[BunnyCDN] Uploading to: ${url}`);

    try {
        const res = await axios.put(url, fileBuffer, {
            headers: {
                'AccessKey': ACCESS_KEY,
                'Content-Type': 'application/octet-stream',
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        console.log(`[BunnyCDN] Upload response status: ${res.status}`);

        // Construct the public URL using the PULL_ZONE_URL
        const pullZoneUrl = process.env.BUNNY_PULL_ZONE_URL;
        if (!pullZoneUrl) {
            throw new Error('BUNNY_PULL_ZONE_URL is not configured');
        }

        // Clean up pullZoneUrl to ensure it's just the hostname without protocol
        const pullZoneHost = pullZoneUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const publicUrl = `https://${pullZoneHost}/${directoryPath}/${finalFileName}`;
        
        console.log(`[BunnyCDN] Generated public URL: ${publicUrl}`);
        return publicUrl;

    } catch (error) {
        console.error(`[BunnyCDN] Upload Error:`, error.response?.data || error.message);
        throw new Error(`BunnyCDN Upload Failed: ${error.response?.data?.Message || error.message}`);
    }
};

export const deleteFileFromBunny = async (fileUrl) => {
    const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE;
    const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
    const STORAGE_ENDPOINT = process.env.BUNNY_STORAGE_ENDPOINT || 'storage.bunnycdn.com';

    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
        throw new Error('BunnyCDN configuration missing (STORAGE_ZONE_NAME or ACCESS_KEY)');
    }

    const url = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE_NAME}/${fileUrl}`;

    try {
        await axios.delete(url, {
            headers: {
                'AccessKey': ACCESS_KEY,
            }
        });
    } catch (error) {
        throw new Error(`BunnyCDN Delete Failed: ${error.message}`);
    }
};

//Upload Resume / Job Files to Bunny
export const uploadJobFileToBunny = async (file, folder = "job-portal") => {
    // Reuse the existing uploadFileToBunny function to ensure consistency
    // It handles the SG endpoint headers and AccessKey correctly

    // 1. Prepare filename with timestamp (consistent with previous behavior)
    const sanitizedFileName = file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.\-_]/g, "");

    const finalFileName = `${Date.now()}-${sanitizedFileName}`;

    // 2. Upload using the generic function
    // uploadFileToBunny(directoryPath, fileBuffer, fileName)
    const publicUrl = await uploadFileToBunny(folder, file.buffer, finalFileName);

    const filePath = `${folder}/${finalFileName}`;

    return {
        url: publicUrl,
        path: filePath
    };
};


//Delete Job File from Bunny
export const deleteJobFileFromBunny = async (filePath) => {
    const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
    const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
    const STORAGE_ENDPOINT = process.env.BUNNY_STORAGE_ENDPOINT || 'storage.bunnycdn.com';

    const deleteUrl = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE}/${filePath}`;

    await axios.delete(deleteUrl, {
        headers: {
            AccessKey: ACCESS_KEY,
        },
    });

    return true;
};
