"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-white" />
        ),
        info: (
          <InfoIcon className="size-4 text-white" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-white" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-white" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-white" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-sans font-semibold p-4 rounded-xl flex gap-3 shadow-2xl border",
          success: "!bg-emerald-500 !text-white !border-emerald-600",
          error: "!bg-rose-600 !text-white !border-rose-700",
          warning: "!bg-amber-500 !text-white !border-amber-600",
          info: "!bg-blue-500 !text-white !border-blue-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
