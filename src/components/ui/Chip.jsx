import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Chip component for displaying interactive, selectable tags
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content of the chip
 * @param {string} props.variant - The visual style variant of the chip
 * @param {string} props.size - The size of the chip
 * @param {boolean} props.selected - Whether the chip is selected
 * @param {boolean} props.disabled - Whether the chip is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.icon - Optional icon to display before the content
 * @param {React.ReactNode} props.endIcon - Optional icon to display after the content
 * @param {Function} props.onClick - Click handler function
 * @returns {JSX.Element} - Chip component
 */
const Chip = ({
  children,
  variant = "default",
  size = "md",
  selected = false,
  disabled = false,
  className,
  icon,
  endIcon,
  onClick,
  ...props
}) => {
  // Define chip variants using class-variance-authority
  const chipVariants = cva(
    "inline-flex items-center justify-center rounded-full transition-all duration-200 font-medium",
    {
      variants: {
        variant: {
          default: "bg-secondary/60 hover:bg-secondary/80 text-foreground",
          primary: "bg-primary/10 hover:bg-primary/20 text-primary",
          success: "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400",
          warning: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400",
          danger: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400",
          info: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
          combat: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400",
          social: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
          exploration: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400",
          magic: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400",
          defense: "bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400",
          character: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          scenario: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400",
          sight: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400",
          sound: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
          smell: "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400",
          touch: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400",
          taste: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400",
        },
        size: {
          sm: "text-xs px-2 py-1 gap-1",
          md: "text-sm px-3 py-1.5 gap-1.5",
          lg: "text-base px-4 py-2 gap-2",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "md",
      },
    }
  );

  // Additional classes for selected state
  const selectedClasses = selected
    ? "ring-2 ring-primary/40 shadow-sm"
    : "hover:shadow-sm";

  // Additional classes for disabled state
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer active:scale-95";

  return (
    <div
      className={cn(
        chipVariants({ variant, size }),
        selectedClasses,
        disabledClasses,
        className
      )}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
    </div>
  );
};

export default Chip;
