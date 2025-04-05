// src/components/YouTubeEmbed.tsx
"use client";

import React from 'react';

interface YouTubeEmbedProps {
    url: string;
    // width and height props removed as aspect ratio styling is used
    className?: string;
}

// Function to extract YouTube Video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        // Standard watch?v= format
        if (urlObj.pathname === '/watch' && urlObj.searchParams.has('v')) {
            videoId = urlObj.searchParams.get('v');
        }
        // Shortened youtu.be format
        else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.substring(1); // Remove leading '/'
        }
        // Embed format
        else if (urlObj.pathname.startsWith('/embed/')) {
             videoId = urlObj.pathname.substring('/embed/'.length);
        }
        // Add more formats if needed (e.g., /live/, /shorts/)

    } catch (e) {
        console.error("Invalid URL for YouTube embed:", url, e);
        return null; // Invalid URL format
    }

    // Basic validation for typical video ID format (alphanumeric, -, _)
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
    }

    console.warn("Could not extract valid YouTube Video ID from URL:", url);
    return null;
};


const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
    url,
    // width and height props removed
    className = ""
}) => {
    const videoId = getYouTubeVideoId(url);

    if (!videoId) {
        return <p className="text-destructive text-sm">Invalid YouTube URL provided.</p>;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div
            className={`relative w-full overflow-hidden ${className}`}
            style={{ paddingTop: '56.25%' }} // 16:9 Aspect Ratio
        >
            <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default YouTubeEmbed;