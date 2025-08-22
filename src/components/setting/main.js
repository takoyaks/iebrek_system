"use client"; // only if you’re using Next.js app router
import { useState } from "react";

export default function Settings() {


const [bgImage, setBgImage] = useState(null);

// Function to update the background image of the logbook
const updateLogbookBackground = (imageData) => {
    // Example: You can implement your logic here to update the background image.
    // This could be an API call or updating a global state.
    // For demonstration, we'll just log the image data.
    console.log("Updating logbook background with image:", imageData);
    // TODO: Replace with actual update logic
};

return (
    <div
        className="w-full bg-black rounded-xl shadow-lg p-6"
    >
        <h1 className="text-2xl font-bold mb-4 text-white">Digital logbook</h1>
        <p className="text-neutral-400 mb-6">Update Digital Logbook background.</p>
        <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        setBgImage(event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }}
            className="mb-4 block text-white"
        />
        {bgImage && (
            <img
                src={bgImage}
                alt="Selected background"
                className="mt-4 rounded shadow max-h-64"
            />
        )}
        <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
                if (!bgImage) return;
                // Convert base64 to Blob and trigger download as logbook_bg.png
                const arr = bgImage.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'logbook_bg.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                alert("Background image saved as logbook_bg.png! Please manually update your logbook background.");
            }}
            disabled={!bgImage}
        >
            Save
        </button>
    </div>
);
}