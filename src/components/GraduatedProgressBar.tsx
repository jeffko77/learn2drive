"use client";

interface PhaseProgress {
  id: string;
  title: string;
  completedTasks: number;
  totalTasks: number;
}

interface GraduatedProgressBarProps {
  phases: PhaseProgress[];
  showLabel?: boolean;
  className?: string;
}

export function GraduatedProgressBar({
  phases,
  showLabel = true,
  className = "",
}: GraduatedProgressBarProps) {
  const totalTasks = phases.reduce((acc, p) => acc + p.totalTasks, 0);
  const totalCompleted = phases.reduce((acc, p) => acc + p.completedTasks, 0);
  const overallPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const getPhasePercentage = (phase: PhaseProgress) => {
    if (phase.totalTasks === 0) return 0;
    return (phase.completedTasks / phase.totalTasks) * 100;
  };

  const isPhaseComplete = (phase: PhaseProgress) => {
    return phase.totalTasks > 0 && phase.completedTasks === phase.totalTasks;
  };

  const hasProgress = (phase: PhaseProgress) => {
    return phase.completedTasks > 0;
  };

  // Calculate the stroke-dasharray for circular progress
  const getCircleProgress = (percentage: number) => {
    const circumference = 2 * Math.PI * 10; // radius = 10
    const filled = (percentage / 100) * circumference;
    return `${filled} ${circumference}`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Phase Bubbles with connecting lines */}
      <div className="relative flex items-center">
        {phases.map((phase, index) => {
          const percentage = getPhasePercentage(phase);
          const complete = isPhaseComplete(phase);
          const started = hasProgress(phase);
          const prevComplete = index > 0 ? isPhaseComplete(phases[index - 1]) : true;
          const isLast = index === phases.length - 1;
          
          return (
            <div 
              key={phase.id} 
              className="flex items-center"
              style={{ 
                flex: isLast ? '0 0 auto' : '1 1 0%',
              }}
            >
              {/* Bubble with circular progress */}
              <div className="relative group flex-shrink-0 z-10">
                {/* Outer ring / progress circle */}
                <div className="relative w-7 h-7">
                  {/* Background circle */}
                  <svg className="w-7 h-7 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-chrome/10"
                    />
                    {/* Progress arc */}
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={getCircleProgress(percentage)}
                      className={`transition-all duration-500 ${
                        complete 
                          ? 'text-signal-green' 
                          : started 
                            ? 'text-signal-yellow' 
                            : 'text-transparent'
                      }`}
                    />
                  </svg>
                  
                  {/* Center fill */}
                  <div 
                    className={`absolute inset-1 rounded-full transition-all duration-300 flex items-center justify-center ${
                      complete 
                        ? 'bg-signal-green shadow-[0_0_10px_rgba(0,210,106,0.5)]' 
                        : started
                          ? 'bg-signal-yellow/20'
                          : 'bg-dashboard'
                    }`}
                  >
                    {complete && (
                      <svg 
                        className="w-3 h-3 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {!complete && started && (
                      <span className="text-[8px] font-bold text-signal-yellow">
                        {Math.round(percentage)}
                      </span>
                    )}
                    {!complete && !started && (
                      <span className="text-[9px] font-medium text-chrome/40">
                        {index + 1}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-dashboard rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-chrome/20 shadow-lg z-20">
                  <div className="font-medium text-chrome truncate max-w-[140px]">
                    {index + 1}. {phase.title}
                  </div>
                  <div className="text-chrome/60 mt-0.5">
                    {phase.completedTasks}/{phase.totalTasks} tasks ({Math.round(percentage)}%)
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dashboard" />
                </div>
              </div>
              
              {/* Connecting Line (after bubble, except last) */}
              {!isLast && (
                <div className="flex-1 h-1 relative -ml-px -mr-px">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-chrome/10" />
                  {/* Filled line - turns green when this phase is complete */}
                  <div 
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                      complete ? 'bg-signal-green' : 'bg-transparent'
                    }`}
                    style={{ 
                      width: complete ? '100%' : '0%'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex justify-between mt-3 text-xs text-chrome/60">
          <span>{totalCompleted} / {totalTasks}</span>
          <span>{overallPercentage}%</span>
        </div>
      )}
    </div>
  );
}
