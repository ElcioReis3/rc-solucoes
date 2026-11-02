import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A native <select>, styled to match the rest of the design system. Chosen
 * over a Radix Select here to keep the admin forms lightweight and fully
 * accessible (native keyboard/mobile behavior) without an extra dependency.
 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-9 w-full appearance-none rounded-md border bg-transparent px-3 py-1 pr-8 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="text-muted-foreground pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
      />
    </div>
  )
}

export { Select }
