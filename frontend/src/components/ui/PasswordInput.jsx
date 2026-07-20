import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export const PasswordInput = React.forwardRef(
  ({ className, errorMessage, helperText, error, label, fullWidth = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isError = error || !!errorMessage;
    const hintText = errorMessage || helperText;

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto", className)}>
        {label && (
          <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", isError ? "text-destructive" : "text-foreground")}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              isError && "border-destructive focus-visible:ring-destructive"
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {hintText && (
          <p className={cn("text-[0.8rem] font-medium", isError ? "text-destructive" : "text-muted-foreground")}>
            {hintText}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
