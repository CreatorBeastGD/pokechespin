import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  separators?: number
  color?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, separators = 0, color, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={"h-full w-full flex-1 " + (color ? color : "bg-primary") + " transition-all"}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
    {separators > 0 && (
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
        {Array.from({ length: separators - 1 }).map((_, index) => (
        <div key={index} className={"absolute left-" + (index+1) + "/" + separators + " h-full w-0.5 bg-white"}></div>
        ))}
      </div>
    )}
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }