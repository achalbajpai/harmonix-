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
import { GenreType } from "@/types/types";

interface GenreSelectorProps {
  genre: GenreType;
  setGenre: React.Dispatch<React.SetStateAction<GenreType>>;
}

export function GenreSelector({ genre, setGenre }: GenreSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="self-start">
        <Button variant="outline" className="w-24">
          {genre.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={genre}
          onValueChange={(e) => setGenre(e as GenreType)}
        >
          <DropdownMenuRadioItem value="pop">Pop</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="edm">EDM</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="urban">Urban</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="classical">
            Classical
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
