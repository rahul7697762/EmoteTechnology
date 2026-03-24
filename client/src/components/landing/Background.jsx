const Background = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Dot grid pattern — EdTech indigo */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(rgba(59, 79, 216, 0.14) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                    opacity: 0.7,
                }}
            />
            {/* Vertical accent lines — indigo */}
            <div
                className="absolute top-0 bottom-0 w-px"
                style={{
                    left: '25%',
                    background: 'linear-gradient(to bottom, transparent, rgba(59,79,216,0.13) 30%, rgba(59,79,216,0.07) 70%, transparent)',
                }}
            />
            <div
                className="absolute top-0 bottom-0 w-px"
                style={{
                    right: '18%',
                    background: 'linear-gradient(to bottom, rgba(59,79,216,0.09) 20%, transparent 70%)',
                }}
            />
            {/* Soft indigo glow top-right */}
            <div
                className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 70% 20%, rgba(108,126,245,0.09) 0%, transparent 60%)',
                }}
            />
        </div>
    );
};

export default Background;
