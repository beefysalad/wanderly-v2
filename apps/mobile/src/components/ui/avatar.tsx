import * as React from "react"
import * as AvatarPrimitive from "@rn-primitives/avatar"

import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
type AvatarImageProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
>
type AvatarFallbackProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
>

function Avatar({ className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative h-10 w-10 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      className={cn("h-full w-full rounded-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallbackText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  return (
    <Text
      className={cn("text-sm font-bold text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarFallbackText, AvatarImage }
export type { AvatarFallbackProps, AvatarImageProps, AvatarProps }
