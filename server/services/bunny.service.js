import axios from 'axios';

const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE;
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;

export const uploadFileToBunny = async (directoryPath, fileBuffer, fileName) => {
    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
        throw new Error('BunnyCDN configuration missing (STORAGE_ZONE_NAME or ACCESS_KEY)');
    }

    const url = `https://sg.storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${directoryPath}/${fileName}`;

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
            return `${baseUrl}/${directoryPath}/${fileName}`;
        }
        return url;

    } catch (error) {
        throw new Error(`BunnyCDN Upload Failed: ${error.message}`);
    }
};

export const deleteFileFromBunny = async (fileUrl) => {
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

