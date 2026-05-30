"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  animated?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, animated = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 bg-primary transition-all duration-500",
        animated &&
          "relative overflow-hidden after:absolute after:inset-y-0 after:left-0 after:w-1/3 after:animate-progress-shine after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
    {animated && (
      <span className="pointer-events-none absolute inset-0 animate-progress-sweep bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
    )}
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
