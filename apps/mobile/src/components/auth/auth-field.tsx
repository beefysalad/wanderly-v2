import { Eye, EyeOff, type LucideIcon } from "lucide-react-native"
import { forwardRef, useState } from "react"
import { Pressable, TextInput, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

type AuthFieldProps = Omit<
  React.ComponentPropsWithoutRef<typeof TextInput>,
  "className"
> & {
  label: string
  icon: LucideIcon
  error?: string
  /** Renders an inline eye toggle and manages secure entry internally. */
  secureToggle?: boolean
}

/** Premium auth input: leading icon, focus border, inline password reveal. */
export const AuthField = forwardRef<TextInput, AuthFieldProps>(
  function AuthField(
    { label, icon, error, secureToggle = false, onFocus, onBlur, ...props },
    ref
  ) {
    const [focused, setFocused] = useState(false)
    const [visible, setVisible] = useState(false)
    const hasError = Boolean(error)

    return (
      <View className="gap-2">
        <Text className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {label}
        </Text>

        <View
          className={cn(
            "min-h-[52px] flex-row items-center gap-3 rounded-2xl border px-4",
            hasError
              ? "border-red-400 bg-red-50/50"
              : focused
                ? "border-black bg-white"
                : "border-neutral-200 bg-neutral-50"
          )}
        >
          <Icon
            as={icon}
            size={18}
            className={cn(
              hasError
                ? "text-red-500"
                : focused
                  ? "text-black"
                  : "text-neutral-400"
            )}
          />

          <TextInput
            ref={ref}
            placeholderTextColor="#a1a1aa"
            {...props}
            secureTextEntry={
              secureToggle ? !visible : props.secureTextEntry
            }
            onFocus={(event) => {
              setFocused(true)
              onFocus?.(event)
            }}
            onBlur={(event) => {
              setFocused(false)
              onBlur?.(event)
            }}
            className="flex-1 py-3.5 text-base text-black"
          />

          {secureToggle ? (
            <Pressable
              accessibilityLabel={visible ? "Hide password" : "Show password"}
              onPress={() => setVisible((prev) => !prev)}
              hitSlop={10}
              className="active:opacity-60"
            >
              <Icon
                as={visible ? EyeOff : Eye}
                size={18}
                className="text-neutral-400"
              />
            </Pressable>
          ) : null}
        </View>

        {hasError ? (
          <Text className="text-xs font-medium text-red-600">{error}</Text>
        ) : null}
      </View>
    )
  }
)
