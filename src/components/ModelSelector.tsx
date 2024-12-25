"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModelSelectorProps {
  model: "llama3-8b-8192" | "gemma2-9b-it";
  setModel: React.Dispatch<
    React.SetStateAction<"llama3-8b-8192" | "gemma2-9b-it">
  >;
}

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="jself-startj">
        <Button variant="outline" className="w-18">
          {model}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={model}
          onValueChange={(e) =>
            setModel(e as "llama3-8b-8192" | "gemma2-9b-it")
          }
        >
          {" "}
          <DropdownMenuRadioItem value="llama3-8b-8192">
            llama3-8b-8192
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gemma2-9b-it">
            gemma2-9b-it
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
