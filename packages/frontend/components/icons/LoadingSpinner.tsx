
import React from 'react';

export const LoadingSpinner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .spinner { animation: spin 1s linear infinite; transform-origin: center; }
        `}</style>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" className="spinner" stroke="currentColor"/>
    </svg>
);
