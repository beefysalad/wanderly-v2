"use client"

import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiRefreshLine,
  RiSaveLine,
  RiShutDownLine,
} from "@remixicon/react"
import { useEffect, useMemo, useState } from "react"

import { useMobileStatus } from "@/hooks/api/use-mobile-status"
import { useUpdateMobileStatus } from "@/hooks/api/use-update-mobile-status"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"

const STATUS_HELPER_TEXT = {
  available: "Users can open Wanderly normally.",
  unavailable: "Users are blocked before auth and trip screens.",
} as const

function MobileAvailabilitySettings() {
  const { data, error, isError, isPending, refetch, dataUpdatedAt } =
    useMobileStatus()
  const updateMobileStatus = useUpdateMobileStatus()
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!data) return

    setMaintenanceEnabled(data.maintenanceEnabled)
    setTitle(data.title)
    setMessage(data.message)
  }, [data])

  const trimmedTitle = title.trim()
  const trimmedMessage = message.trim()
  const hasChanges = useMemo(() => {
    if (!data) return false

    return (
      maintenanceEnabled !== data.maintenanceEnabled ||
      trimmedTitle !== data.title ||
      trimmedMessage !== data.message
    )
  }, [data, maintenanceEnabled, trimmedMessage, trimmedTitle])
  const canSave =
    Boolean(data) &&
    hasChanges &&
    trimmedTitle.length > 0 &&
    trimmedMessage.length > 0 &&
    !updateMobileStatus.isPending
  const lastUpdatedLabel =
    dataUpdatedAt > 0
      ? new Date(dataUpdatedAt).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "Not synced yet"

  const handleSave = () => {
    if (!canSave) return

    updateMobileStatus.mutate({
      maintenanceEnabled,
      title: trimmedTitle,
      message: trimmedMessage,
    })
  }

  const handleRefresh = () => {
    void refetch()
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <RiShutDownLine className="text-primary size-5" />
              App availability
            </CardTitle>
            <CardDescription>
              Runtime control for whether users can enter the Wanderly mobile
              product.
            </CardDescription>
          </div>
          <Badge
            variant={maintenanceEnabled ? "outline" : "secondary"}
            className="h-8 w-fit px-3"
          >
            {maintenanceEnabled ? "Unavailable" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <RiErrorWarningLine className="size-4" />
            <AlertDescription>
              Could not load mobile availability. {getErrorMessage(error)}
            </AlertDescription>
          </Alert>
        ) : (
          <FieldGroup>
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Current state</p>
                      <p className="text-muted-foreground text-sm">
                        {maintenanceEnabled
                          ? STATUS_HELPER_TEXT.unavailable
                          : STATUS_HELPER_TEXT.available}
                      </p>
                    </div>
                    <span className="bg-background flex size-9 shrink-0 items-center justify-center rounded-lg border">
                      {maintenanceEnabled ? (
                        <RiErrorWarningLine className="size-5 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <RiCheckboxCircleLine className="text-primary size-5" />
                      )}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  <Field orientation="horizontal" className="items-center">
                    <FieldContent>
                      <FieldTitle>Set app unavailable</FieldTitle>
                      <FieldDescription>
                        Blocks users at app startup until this is turned off.
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      checked={maintenanceEnabled}
                      onCheckedChange={setMaintenanceEnabled}
                    />
                  </Field>
                </div>

                <div className="bg-muted/30 rounded-lg border px-4 py-3">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-normal">
                    Config key
                  </p>
                  <p className="mt-1 font-mono text-sm">mobile_status</p>
                </div>
              </div>

              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="app-availability-title">
                    User-facing title
                  </FieldLabel>
                  <Input
                    id="app-availability-title"
                    value={title}
                    maxLength={80}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <FieldDescription>
                    Short headline shown only when the app is unavailable.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="app-availability-message">
                    User-facing message
                  </FieldLabel>
                  <Textarea
                    id="app-availability-message"
                    value={message}
                    maxLength={320}
                    className="min-h-28 resize-y rounded-lg"
                    onChange={(event) => setMessage(event.target.value)}
                  />
                  <FieldDescription>
                    Give users a plain reason and what to do next.
                  </FieldDescription>
                </Field>
              </div>
            </div>

            {updateMobileStatus.isError ? (
              <Alert variant="destructive">
                <RiErrorWarningLine className="size-4" />
                <AlertDescription>
                  Could not save mobile availability.{" "}
                  {getErrorMessage(updateMobileStatus.error)}
                </AlertDescription>
              </Alert>
            ) : null}

            {updateMobileStatus.isSuccess && !hasChanges ? (
              <Alert>
                <RiCheckboxCircleLine className="size-4" />
                <AlertDescription>App availability was saved.</AlertDescription>
              </Alert>
            ) : null}

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-sm">
                Last synced {lastUpdatedLabel}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={handleRefresh}
                >
                  <RiRefreshLine className="size-4" />
                  Refresh
                </Button>
                <Button
                  type="button"
                  className="gap-2"
                  disabled={!canSave}
                  onClick={handleSave}
                >
                  <RiSaveLine className="size-4" />
                  {updateMobileStatus.isPending ? "Saving..." : "Save status"}
                </Button>
              </div>
            </div>
          </FieldGroup>
        )}
      </CardContent>
    </Card>
  )
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "Please try again."
}

export { MobileAvailabilitySettings }
