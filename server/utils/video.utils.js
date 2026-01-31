import ffmpeg from 'fluent-ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import fs from 'fs';
import path from 'path';
import os from 'os';

ffmpeg.setFfprobePath(ffprobePath);

export const getVideoDurationInSeconds = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        // Create a temp file
        const tempFilePath = path.join(os.tmpdir(), `temp_video_${Date.now()}.mp4`);
        fs.writeFileSync(tempFilePath, fileBuffer);

        ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
            // Clean up temp file
            fs.unlinkSync(tempFilePath);

            if (err) {
                return reject(err);
            }

            const duration = metadata.format.duration;
            resolve(duration ? parseFloat(duration) : 0);
        });
    });
};
