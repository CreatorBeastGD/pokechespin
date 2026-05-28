"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { Calculator } from "../../lib/calculations";
import { Switch } from "./ui/switch";
import { useSearchParams, usePathname } from "next/navigation";
import TypeBadge from "./TypeBadge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Type } from "lucide-react";
import WeaknessResistanceTable from "./WeaknessResistanceTable";
import { set } from "mongoose";
import { Select } from "./ui/select";
import { SelectItem } from "@radix-ui/react-select";


interface MyCustomMovesProps {
  allEnglishText?: any;
  autoUpdater?: boolean;
  setAutoUpdater?: any;
  moveDeletionChecker?: any;
  deletedMoveId?: any;
}

export default function MyCustomMoves({ 
    allEnglishText,
    autoUpdater = false,
    setAutoUpdater,
    moveDeletionChecker,
    deletedMoveId,
  }: MyCustomMovesProps, ) {

  const [customList, setCustomList] = useState<any[]>([]);


  useEffect(() => {
    if (!localStorage) return;
    const storedCustomMoves = PoGoAPI.getAllCustomMoves();
    if (storedCustomMoves) {
      setCustomList(storedCustomMoves);
    }
  }, []);

  useEffect(() => {
    if (autoUpdater) {
      const storedCustomMoves = PoGoAPI.getAllCustomMoves();
      setCustomList(storedCustomMoves);
      setAutoUpdater(false);
    }
  }, [autoUpdater]);


  function deleteMoveFromCustomList(moveId: string) {
    PoGoAPI.deleteCustomMove(moveId);
    setCustomList((prevList) => prevList.filter((move: any) => move.moveId !== moveId));
    deletedMoveId(moveId);
    moveDeletionChecker(true);
  }

  return (
    <>
      <p>My custom fast moves</p>
      {customList.filter((move: any) => move.energyDelta > 0).map((move: any) => (
        <div key={move.moveId} className="relative border p-2 mb-2 rounded bg-gray-100">
          <p className="text-lg"><strong>{PoGoAPI.getMoveNamePB(move.moveId, allEnglishText)}</strong></p>
          <p className="text-sm text-muted-foreground">({move.moveId})</p>
          <p>Type: {PoGoAPI.formatTypeName(move.type)}</p>
          
          <button className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded "
          onClick={() => {
            deleteMoveFromCustomList(move.moveId);
          }}>Delete</button> 
        </div>
      ))}

      <p>My custom charged moves</p>
      {customList.filter((move: any) => move.energyDelta <= 0).map((move: any) => (
        <div key={move.moveId} className="relative border p-2 mb-2 rounded bg-gray-100">
          <p className="text-lg"><strong>{PoGoAPI.getMoveNamePB(move.moveId, allEnglishText)}</strong></p>
          <p className="text-sm text-muted-foreground">({move.moveId})</p>
          <p>Type: {PoGoAPI.formatTypeName(move.type)}</p>
          <button className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded"
          onClick={() => {
            deleteMoveFromCustomList(move.moveId);
          }}
        >
          Delete
        </button> 
        </div>
      ))}
    </>
  );
}