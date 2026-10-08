"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

import TypeBadge from "./TypeBadge";


interface SearchBarMoveEditorSuperMegaProps {
  onSelect: (pokemon: any) => void;
  allMoves: any;
  allMegaMoves: any;
  allEnglishText: any;
  allTypes?: any;
  autoUpdaterHandler?: any;
  deletedMoveId?: string;
}

export default function SearchBarMoveEditorSuperMega({ 
    onSelect, 
    allMoves, 
    allMegaMoves,
    allEnglishText,
    allTypes,
    autoUpdaterHandler,
    deletedMoveId,
  }: SearchBarMoveEditorSuperMegaProps, ) {

  const [moveData, setMoveData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableForms, setAvailableForms] = useState<any[]>([]);
  const [clickedSuggestion, setClickedSuggestion] = useState<boolean>(false);

  const [customMove, setCustomMove] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [customList, setCustomList] = useState<any[]>([]);

  const [customType, setCustomType] = useState<string>("");
  const [customDamage, setCustomDamage] = useState<number>(0);
  const [customEnergy, setCustomEnergy] = useState<number>(0);
  const [customDuration, setCustomDuration] = useState<number>(0);

  const [customMoveData, setCustomMoveData] = useState<any[]>([]);

  useEffect(() => {
    if (clickedSuggestion) {
      searchMove();
      setClickedSuggestion(false);
    }
  } , [clickedSuggestion]);

  

  const searchMove = (move?: any) => {
    //console.log(move);
    setLoading(true);
    setError(null);
    setSuggestions([])
    let searchParam = move?.moveId ? move.moveId : customMove.trim().toUpperCase();
    try {
      console.log("Searching for move:", searchParam);
      const response = PoGoAPI.getMovePBByID(searchParam, allMoves);
      
      if (!response) {
        setMoveData(null);
        setAvailableForms([]);
        setCustomList([]);
        setError("Move not found.");
        return;
      }

      console.log(response)

      setMoveData(response);
      onSelect(response);

      setCustomDamage(response.power);
      setCustomEnergy(response.energyDelta);
      setCustomDuration(response.durationMs);
      setCustomType(response.type);

      //console.log(response);
      
    } finally {
      setLoading(false);
    }
  };


  const selectedMove = moveData; //? getSelectedForm() : null;

  const showID = localStorage.getItem("showIDs") === "true";

    const handleMoveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMove(value);
    if (value.length > 0) {
      const filteredMoves = [PoGoAPI.getMovePBByName(value, allMegaMoves, false)].flat();
      setSuggestions(filteredMoves);
    } else {
      setSuggestions([]);
    }
  }

  const handleMoveSuggestionClick = (suggestion: any) => {
    if (suggestion.moveId) {
      setCustomMove(suggestion.moveId);
      setTimeout(() => {
        searchMove(suggestion);
      }, 100);   
    }
  };

  const saveCustomMove = () => {
    if (!selectedMove) return;
    const customMoveData = {
      moveId: selectedMove.moveId,
      power: customDamage,
    };
    console.log("Custom move data to save:", customMoveData);
    // Here you would typically send this data to your backend or save it in local storage
    PoGoAPI.setCustomMegaMoveValues(customMoveData);
    
    setCustomMoveData(PoGoAPI.getAllCustomMegaMoveValues());
    setMoveData(PoGoAPI.getMovePBByID(selectedMove.moveId, allMoves));
    
    if (autoUpdaterHandler) {
      autoUpdaterHandler(true);
    }

    alert("Custom move values saved for " + PoGoAPI.getMoveNamePB(selectedMove.moveId, allEnglishText) + "!");
  }

  const resetToDefault = () => {
    if (!selectedMove) return;
    PoGoAPI.setCustomMegaMoveValuesToDefault(selectedMove.moveId);
    setMoveData(PoGoAPI.getMovePBByID(selectedMove.moveId, allMoves));

    setCustomDamage(PoGoAPI.getMovePBByID(selectedMove.moveId, allMoves).power);
    
    setCustomMoveData(PoGoAPI.getAllCustomMegaMoveValues());
    
    if (autoUpdaterHandler) {
      autoUpdaterHandler(true);
    }

    alert("Custom move values reset to default for " + PoGoAPI.getMoveNamePB(selectedMove.moveId, allEnglishText) + "!");
  }

  const getNextCustomEnergy = (symbol: string) => {
    if (symbol === "+") {
      return customEnergy <= -100 ? -100 : (customEnergy === -50) ? -100 : -50;
    } else {
      return customEnergy >= -33 ? -33 : (customEnergy === -50) ? -33 : -50;
    }
  }

  useEffect(() => {
    setCustomMoveData(PoGoAPI.getAllCustomMegaMoveValues());
  }, []);
  
  useEffect(() => {
    if (deletedMoveId) {
      if (deletedMoveId === selectedMove?.moveId) {
        setMoveData(null);
      }
    }
  }, [deletedMoveId]);

  return (
    <>
      <Input
        placeholder="Mega Move ID"
        type="text"
        value={customMove}
        onChange={(e) => handleMoveChange(e)}
        onKeyDown={(e) => e.key === "Enter" && handleMoveSuggestionClick(suggestions[0])}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 resp-box-suggest ">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.moveId}
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleMoveSuggestionClick(suggestion)}
          >
          {suggestion.moveId}
          </li>
          ))}
        </ul>
      )}
      <div>
        <Button onClick={searchMove} className="mt-4 mb-2 mr-2">Search</Button>
        <Button onClick={saveCustomMove} className="mt-4 mb-2 mr-2">Save</Button>
        <Button onClick={resetToDefault} className="mt-4 mb-2">Default</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Clicking "Default" will reset the move's values to their original state. This action cannot be undone, so make sure you want to reset before clicking it.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Custom move data exists for {customMoveData.length} moves (
          {customMoveData.map((move: any) => move.moveId).join(", ")}
      )
      </p>
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {(moveData) ? (
      <>
        <Card className="mt-4 p-4">
          <div>
            <h2 className="text-xl font-bold">Name: {PoGoAPI.formatMoveName(selectedMove.moveId)}</h2>
            {showID && <p className="text-xs italic text-gray-500">ID: {selectedMove.moveId}</p>}
            <p className="text-lg my-2 font-bold">Type: <TypeBadge type={PoGoAPI.formatTypeName(selectedMove.type)} /></p>
          
            
            
              <div className="grid grid-cols-1 mb-4">
                <p>Damage: {selectedMove.power}</p>
                <p>Energy Cost: {Math.abs(selectedMove.energyDelta)}</p>
                <p>Duration: {selectedMove.durationMs / 1000} s</p>
                <div className="w-[50%] flex flex-row justify-between mt-2 space-x-2">
                  {(-(selectedMove).energyDelta) <= 100 && (
                    <TypeBadge type={PoGoAPI.formatTypeName((selectedMove).type)} show={false} />
                  )}
                  {(-(selectedMove).energyDelta) <= 50 && (
                    <TypeBadge type={PoGoAPI.formatTypeName((selectedMove).type)} show={false} />
                  )}
                  {(-(selectedMove).energyDelta) <= 33 && (
                    <TypeBadge type={PoGoAPI.formatTypeName((selectedMove).type)} show={false} />
                  )}
                </div>
            </div>

            
          </div>
        </Card>
          <Card className="mt-4 p-4">
              <>
              <h2 className="text-xl font-bold">
                Edit Super Mega move
              </h2>
              <p>Power</p>
              <div className="w-full flex flex-row justify-between items-center">
                <Button onClick={() => setCustomDamage(customDamage <= 0 ? 0 : customDamage - 5)} className="mx-2">-5</Button>
                <Button onClick={() => setCustomDamage(customDamage <= 0 ? 0 : customDamage - 1)} className="mx-2">-1</Button>
                <p className="inline-block  ">{customDamage}</p> 
                <Button onClick={() => setCustomDamage(customDamage >= 1000 ? 1000 : customDamage + 1)} className="mx-2">+1</Button>
                <Button onClick={() => setCustomDamage(customDamage >= 1000 ? 1000 : customDamage + 5)} className="mx-2">+5</Button>
              </div>
              </>
        </Card>
      </>      
      ) : (
        <p>No move selected</p>
      )}
    </>
  );
}