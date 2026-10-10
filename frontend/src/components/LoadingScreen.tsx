export function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      role="status"
      aria-label="Loading"
    >
      <svg className="h-14 w-14 animate-loader-rotate" viewBox="0 0 50 50">
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          strokeWidth="3"
          style={{ stroke: 'hsl(var(--primary) / 0.15)' }}
        />
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-loader-dash"
          style={{ stroke: 'hsl(var(--primary))' }}
        />
      </svg>
    </div>
  );
}
