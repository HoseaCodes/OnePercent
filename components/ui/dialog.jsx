/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Variants for the Dialog component
const dialogVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  {
    variants: {
      variant: {
        default: "bg-background/75",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Dialog = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="dialog"
    aria-modal="true"
    className={cn(dialogVariants({ variant }), className)}
    {...props}
  />
));
Dialog.displayName = "Dialog";

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed inset-0 bg-black/50", className)}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative max-w-lg w-full bg-white rounded-lg shadow-lg p-6",
      className,
    )}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h2
    ref={ref}
    className={cn("text-lg font-medium leading-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-2", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription };
