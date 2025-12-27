import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { getCroppedImg } from '../utils/image';

interface ImageCropperProps {
    imageSrc: string;
    onCancel: () => void;
    onCropComplete: (croppedImg: string) => void;
    aspect?: number; // width / height
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCancel, onCropComplete, aspect = 1 }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleLeave = () => {
        setIsDragging(false);
    };

    const onSave = async () => {
        if (!imgRef.current || !containerRef.current) return;

        // Calculate crop area relative to the image
        const img = imgRef.current;

        // The displayed size of the image
        const displayedWidth = img.width * zoom;
        const displayedHeight = img.height * zoom;

        // The crop box size (it's the center 250px usually, or fixed size)
        // Let's assume crop box is central 250x250 (or whatever aspect)
        // Actually, we need to know the crop box size in the UI.
        // In this UI, we'll make a fixed crop box of 200x200 (or aspect ratio)
        const cropBoxSize = 250;
        const cropWidth = cropBoxSize;
        const cropHeight = cropBoxSize / aspect;

        // Center of the container
        const containerRect = containerRef.current.getBoundingClientRect();
        const cx = containerRect.width / 2;
        const cy = containerRect.height / 2;

        // The image's center is at (cx + position.x, cy + position.y)
        // The image's top-left in container coords (visually)
        const imgLeftVisual = (cx + position.x) - (displayedWidth / 2);
        const imgTopVisual = (cy + position.y) - (displayedHeight / 2);

        // The crop box's top-left in container coords
        const cropLeftVisual = cx - cropWidth / 2;
        const cropTopVisual = cy - cropHeight / 2;

        // Relative to the visual image top-left:
        const cropXRelVisual = cropLeftVisual - imgLeftVisual;
        const cropYRelVisual = cropTopVisual - imgTopVisual;

        // Scale back to natural image size
        const scale = img.naturalWidth / displayedWidth;

        const pixelCrop = {
            x: cropXRelVisual * scale,
            y: cropYRelVisual * scale,
            width: cropWidth * scale,
            height: cropHeight * scale
        };

        try {
            const croppedBase64 = await getCroppedImg(imageSrc, pixelCrop);
            onCropComplete(croppedBase64);
        } catch (e) {
            console.error(e);
            alert('Failed to crop image');
        }
    };

    // Prevent default drag behavior
    useEffect(() => {
        const preventDrag = (e: DragEvent) => e.preventDefault();
        document.addEventListener('dragstart', preventDrag);
        return () => document.removeEventListener('dragstart', preventDrag);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg dark:text-stone-200">Adjust Image</h3>
                    <button onClick={onCancel} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="relative flex-1 bg-stone-900 overflow-hidden cursor-move min-h-[300px]"
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleLeave}
                >
                    {/* Image Layer */}
                    <div
                        className="absolute flex items-center justify-center pointer-events-none"
                        style={{
                            left: '50%',
                            top: '50%',
                            width: 0,
                            height: 0
                        }}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop target"
                            onLoad={(e) => {
                                const img = e.currentTarget;
                                const initialScale = Math.min(300 / img.naturalWidth, 300 / img.naturalHeight, 1);
                                setZoom(initialScale);
                            }}
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                                maxWidth: 'none',
                                maxHeight: 'none'
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Overlay Mask */}
                    <div className="absolute inset-0 pointer-events-none bg-black/50">
                        {/* Cutout */}
                        <div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] box-content"
                            style={{
                                width: 250,
                                height: 250 / aspect,
                                borderRadius: aspect === 1 ? '50%' : '12px'
                            }}
                        ></div>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-stone-800 space-y-4 z-10">
                    <div className="flex items-center gap-4">
                        <ZoomOut size={20} className="text-stone-400" />
                        <input
                            type="range"
                            min={0.1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={e => setZoom(parseFloat(e.target.value))}
                            className="flex-1 accent-rose-500"
                        />
                        <ZoomIn size={20} className="text-stone-400" />
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onSave} className="flex-1 py-3 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                            <Check size={20} /> Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
