
import { supabase } from '../lib/supabase';

// Convert Base64 to Blob for upload
const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
};

export const uploadImage = async (file: File | string, path: string): Promise<string | null> => {
    try {
        let blob: Blob;
        let fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

        if (typeof file === 'string') {
            // It's a base64 string (from cropper or processImage)
            blob = base64ToBlob(file);
        } else {
            // It's a raw File object
            blob = file;
            fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        }

        const { data, error } = await supabase.storage
            .from('content_images')
            .upload(fileName, blob, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('content_images')
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};
