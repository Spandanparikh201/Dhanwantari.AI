const SkeletonLoader = ({ lines = 3 }) => {
    return (
        <div className="space-y-3 animate-pulse" role="status" aria-label="Loading">
            {[...Array(lines)].map((_, i) => (
                <div key={i} className="flex gap-2">
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </div>
            ))}
            <span className="sr-only">Loading response...</span>
        </div>
    );
};

export default SkeletonLoader;
