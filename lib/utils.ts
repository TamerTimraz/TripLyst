import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (isoDate: string) => {
  console.log("The date:", isoDate)
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export const formatDateNum = (isoDate: string) => {
  console.log("The date:", isoDate)
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })
}