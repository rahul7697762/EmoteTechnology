import axios from 'axios';

export const uploadFileToBunny = async (directoryPath, fileBuffer, fileName) => {
    // Sanitize filename: replace spaces with hyphens, remove special chars to ensure clean URLs
    const sanitizedFileName = fileName
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/[^a-zA-Z0-9.\-_]/g, ''); // Remove anything that's not alphanumeric, dot, hyphen, or underscore

    const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE;
    const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;

    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
        f
        throw new Error('BunnyCDN configuration missing (STORAGE_ZONE_NAME or ACCESS_KEY)');
    }

    const url = `https://sg.storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${directoryPath}/${sanitizedFileName}`;

    try {
        const res = await axios.put(url, fileBuffer, {
            headers: {
                'AccessKey': ACCESS_KEY,
                'Content-Type': 'application/octet-stream',
            },
            maxBodyLength: Infinity, // Important for large files
            maxContentLength: Infinity
        });

        // Construct the public URL
        const pullZoneUrl = process.env.BUNNY_PULL_ZONE_URL;
        if (pullZoneUrl) {
            const baseUrl = pullZoneUrl.startsWith('http') ? pullZoneUrl : `https://${pullZoneUrl}`;
            return `${baseUrl}/${directoryPath}/${sanitizedFileName}`;
        }
        return url;

    } catch (error) {
        throw new Error(`BunnyCDN Upload Failed: ${error.message}`);
    }
};

export const deleteFileFromBunny = async (fileUrl) => {
    const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE;
    const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;

    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
        throw new Error('BunnyCDN configuration missing (STORAGE_ZONE_NAME or ACCESS_KEY)');
    }

    const url = `https://sg.storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${fileUrl}`;

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

    const deleteUrl = `https://sg.storage.bunnycdn.com/${STORAGE_ZONE}/${filePath}`;

    await axios.delete(deleteUrl, {
        headers: {
            AccessKey: ACCESS_KEY,
        },
    });

    return true;
};
