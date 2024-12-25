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
import { VoiceType } from "@/types/types";

interface VoiceSelectorProps {
  voiceType: VoiceType;
  setVoiceType: React.Dispatch<React.SetStateAction<VoiceType>>;
}

export function VoiceSelector({ voiceType, setVoiceType }: VoiceSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="jself-startj">
        <Button variant="outline" className="w-18">
          {voiceType.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={voiceType}
          onValueChange={(e) => setVoiceType(e as VoiceType)}
        >
          {" "}
          <DropdownMenuRadioItem value="male">Male</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="female">Female</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
