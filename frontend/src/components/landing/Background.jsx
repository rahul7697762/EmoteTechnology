const Background = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[150px]"></div>
        </div>
    );
};

export default Background;
