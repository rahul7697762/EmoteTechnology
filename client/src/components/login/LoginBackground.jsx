import React from 'react';

const LoginBackground = () => {
    return (
        <div className="fixed inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-teal-500/15 rounded-full blur-[100px]"></div>
        </div>
    );
};

export default LoginBackground;
