import * as React from "react"
import { cn } from "../../lib/utils"

export const Card = React.forwardRef(({ className, children, title, subtitle, action, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
    {...props}
  >
    {(title || subtitle || action) && (
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    )}
    <div className={cn("p-6", (title || subtitle || action) && "pt-3")}>
      {children}
    </div>
  </div>
))
Card.displayName = "Card"

export default Card
