"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { getSection } from "@/lib/source/navigation";



function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {

              const color = `var(--cli-color, var(--color-fd-foreground))`
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border  bg-fd-primary   shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
