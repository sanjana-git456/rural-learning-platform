"use client"

import { cn } from "@/lib/utils"

const Select = ({ children, onValueChange, value, ...props }) => {
  return (
    <div className="relative" {...props}>
      {children}
    </div>
  )
}

const SelectTrigger = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <span className="text-xs">▼</span>
    </button>
  )
}

const SelectValue = ({ placeholder, ...props }) => {
  return (
    <span className="text-muted-foreground" {...props}>
      {placeholder}
    </span>
  )
}

const SelectContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "absolute top-full left-0 mt-1 w-full bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SelectItem = ({ className, children, value, ...props }) => {
  return (
    <div className={cn("px-3 py-2 text-sm hover:bg-accent cursor-pointer", className)} {...props}>
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
