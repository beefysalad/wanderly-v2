import * as React from "react"
import { View } from "react-native"

import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

type CardProps = React.ComponentPropsWithoutRef<typeof View>

function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: CardProps) {
  return <View className={cn("gap-1.5 p-5", className)} {...props} />
}

function CardContent({ className, ...props }: CardProps) {
  return <View className={cn("p-5 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }: CardProps) {
  return (
    <View
      className={cn("flex-row items-center p-5 pt-0", className)}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  return (
    <Text
      className={cn("text-lg font-bold text-card-foreground", className)}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
export type { CardProps }
