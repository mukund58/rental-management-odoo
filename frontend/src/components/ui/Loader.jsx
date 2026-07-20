import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

export const Loader = ({ message = 'Loading...', size = 40, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 gap-4 min-h-[200px]",
        className
      )}
      {...props}
    >
      <Loader2 
        size={size} 
        className="animate-spin text-primary" 
      />
      {message && (
        <p className="text-sm font-medium text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  )
}

export default Loader
