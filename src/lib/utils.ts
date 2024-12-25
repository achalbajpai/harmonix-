import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function breakString(text: string, wordLimit: number) {
  const words = text.split(" ");
  const brokenText = [];
  for (let i = 0; i < words.length; i += wordLimit) {
    brokenText.push(words.slice(i, i + wordLimit).join(" "));
  }
  return brokenText;
}
