import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform ${className}`}>
        {/* Top Face */}
        <path d="M12 2L22 7L12 12L2 7L12 2Z" fill="#818CF8" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round"/>
        {/* Left Face */}
        <path d="M2 7V17L12 22V12L2 7Z" fill="#C7D2FE" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round"/>
        {/* Right Face */}
        <path d="M22 7V17L12 22V12L22 7Z" fill="#4F46E5" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round"/>
        {/* Sparkle/Lightning Accent */}
        <path d="M12 4L13.5 7.5L17 9L13.5 10.5L12 14L10.5 10.5L7 9L10.5 7.5L12 4Z" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
);

export default Logo;
