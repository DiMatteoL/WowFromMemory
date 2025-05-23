"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { Twitter } from "lucide-react"
import { Expansion } from "@/types/game"

const PersistentTooltipProvider = TooltipPrimitive.Provider

const PersistentTooltipRoot = TooltipPrimitive.Root

const PersistentTooltipTrigger = TooltipPrimitive.Trigger

const PersistentTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-4 py-2.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
PersistentTooltipContent.displayName = TooltipPrimitive.Content.displayName

interface PersistentTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  expansion: Expansion
  className?: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export function PersistentTooltip({
  children,
  content,
  className,
  expansion,
  side = "top",
  align = "center",
}: PersistentTooltipProps) {
  const [open, setOpen] = React.useState(false)
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  return (
    <PersistentTooltipProvider>
      <PersistentTooltipRoot open={open} >
        <PersistentTooltipTrigger asChild>
          <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onTouchStart={() => setOpen(true)}
          >
            {children}
          </div>
        </PersistentTooltipTrigger>
        <PersistentTooltipContent
          side={side}
          align={align}
          className={className}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          ref={tooltipRef}
        >
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="font-medium">{content}</div>
            <div className="h-px bg-border/50" />
            <a
              href={`https://twitter.com/intent/tweet?text=Hey @Rudnost, when can you add ${expansion.name} to warcraftwits.com? %23WoW %23${expansion.slug} %23WarcraftWits`}
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
            >
              <span>Want it faster? Ask for it on</span>
              <Twitter className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </PersistentTooltipContent>
      </PersistentTooltipRoot>
    </PersistentTooltipProvider>
  )
}
