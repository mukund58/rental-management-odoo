import React from 'react';
import { Button as BaseButton } from '@mui/material';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({ children, animateOnClick = true, animateOnHover = true, sx, ...props }, ref) => {
  return (
    <motion.div
      style={{ display: props.fullWidth ? 'block' : 'inline-block', width: props.fullWidth ? '100%' : 'auto' }}
      whileHover={animateOnHover && !props.disabled ? { scale: 1.015 } : undefined}
      whileTap={animateOnClick && !props.disabled ? { scale: 0.985 } : undefined}
    >
      <BaseButton
        ref={ref}
        sx={{
          width: props.fullWidth ? '100%' : 'auto',
          ...sx,
        }}
        {...props}
      >
        {children}
      </BaseButton>
    </motion.div>
  );
});

Button.displayName = 'Button';
export default Button;
