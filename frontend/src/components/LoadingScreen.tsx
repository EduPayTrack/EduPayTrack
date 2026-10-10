type LoadingScreenProps = {
  label?: string;
};

export function LoadingScreen({ label = 'Loading' }: LoadingScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          {/* soft glow */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-loader-pulse" />

          {/* outer ring: rotating, growing/shrinking arc */}
          <svg className="relative h-16 w-16 animate-loader-rotate" viewBox="0 0 50 50">
            <circle
              cx="25" cy="25" r="20"
              fill="none"
              strokeWidth="3"
              className="stroke-primary/15"
            />
            <circle
              cx="25" cy="25" r="20"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-primary animate-loader-dash"
            />
          </svg>

          {/* inner ring: slower, counter-rotating */}
          <svg
            className="absolute inset-0 m-auto h-8 w-8 animate-loader-rotate-reverse"
            viewBox="0 0 50 50"
          >
            <circle
              cx="25" cy="25" r="20"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="30 100"
              className="stroke-primary/50"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold tracking-wide text-foreground">EduPayTrack</p>
          <p className="text-xs text-muted-foreground">
            {label}
            <span className="loader-dots" aria-hidden="true">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
