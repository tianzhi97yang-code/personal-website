/**
 * Utility functions for image processing.
 */

// Create the cropped image from the source image and crop area
export const getCroppedImg = (
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('No 2d context'));
            }

            const maxSize = Math.max(image.width, image.height);
            const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

            // set each dimensions to double largest dimension to allow for a safe area for the
            // image to rotate in without being clipped by canvas context
            canvas.width = safeArea;
            canvas.height = safeArea;

            // translate canvas context to a central location on image to allow rotating around the center.
            ctx.translate(safeArea / 2, safeArea / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-safeArea / 2, -safeArea / 2);

            // draw rotated image and store data.
            ctx.drawImage(
                image,
                safeArea / 2 - image.width * 0.5,
                safeArea / 2 - image.height * 0.5
            );

            const data = ctx.getImageData(0, 0, safeArea, safeArea);

            // set canvas width to final desired crop size - this will clear existing context
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            // paste generated rotate image with correct offsets for x,y crop values.
            ctx.putImageData(
                data,
                Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
                Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
            );

            // As Base64 string
            // return resolve(canvas.toDataURL('image/jpeg'));

            // Process for compression
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }

                // Convert blob to base64
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result as string);
                }
            }, 'image/jpeg', 0.8); // 0.8 quality
        });
        image.src = imageSrc;
    });
};

// Generic resize and compress function for non-cropped images (e.g. memes, blog covers)
export const processImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    }
                }, 'image/jpeg', quality);
            };
        };
        reader.onerror = (error) => reject(error);
    });
};
