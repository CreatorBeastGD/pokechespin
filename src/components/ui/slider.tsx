import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-primary/20">
      
      <SliderPrimitive.Range className={"absolute h-full " + (props.color ? props.color : "bg-yellow-600") + " rounded-full"} />
      {props.disabled !== undefined ? props.disabled == true ? (<div className="absolute inset-0 flex items-center justify-between">
        <div className="absolute left-1/2 h-full w-0.5 bg-gray-400"></div>
      </div>) : null : (
      <div className="absolute inset-0 flex items-center justify-between">
        <div className="absolute left-1/3 h-full w-0.5 bg-gray-400"></div>
        <div className="absolute left-2/3 h-full w-0.5 bg-gray-400"></div>
      </div>
      )}
    </SliderPrimitive.Track>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };