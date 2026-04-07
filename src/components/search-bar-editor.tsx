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


interface SearchBarEditorProps {
  onSelect: (pokemon: any) => void;
  pokemonList: any;
  searchBarNames: any;
  allMoves: any;
  assets: any;
  allEnglishText: any;
  raidMode?: string;
  slot?: number;
  paramsLoaded?: boolean;
  allTypes?: any;
  memberSlot?: number;
  customMoveDeletionChecker?: boolean;
  setCustomMoveDeletionChecker?: any;
  deletedMoveId?: string;
  setDeletedMoveId?: any;
}

export default function SearchBarEditor({ 
    onSelect, 
    raidMode, 
    pokemonList, 
    searchBarNames, 
    allMoves, 
    assets, 
    allEnglishText,
    slot,
    paramsLoaded,
    allTypes,
    memberSlot,
    customMoveDeletionChecker,
    setCustomMoveDeletionChecker,
    deletedMoveId,
    setDeletedMoveId
  }: SearchBarEditorProps, ) {

    const raidModeLevelMultiplier = PoGoAPI.convertStats([40, 15, 15, 15], raidMode)[0];

  const [pokemon, setPokemon] = useState<string>("");
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<string>("normal");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuickMove, setSelectedQuickMove] = useState<string | null>(null);
  const [selectedChargedMove, setSelectedChargedMove] = useState<string | null>(null);
  const [stats, setStats] = useState<any>([50, 15, 15, 15]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedBonuses, setSelectedBonuses] = useState<any[]>(["EXTREME", false, false, 0]);
  const [availableForms, setAvailableForms] = useState<any[]>([]);
  const [clickedSuggestion, setClickedSuggestion] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [showWeaknesses, setShowWeaknesses] = useState<boolean>(false);

  const [importMaxMove, setImportMaxMove] = useState<number[]>([1, 0, 0]);
  

  const [customFastMove, setCustomFastMove] = useState<string>("");
  const [fmSuggestions, setFMSuggestions] = useState<any[]>([]);
  const [customFMList, setCustomFMList] = useState<any[]>([]);

  const [customChargedMove, setCustomChargedMove] = useState<string>("");
  const [cmSuggestions, setCMSuggestions] = useState<any[]>([]);
  const [customCMList, setCustomCMList] = useState<any[]>([]);

  const [customPokeData, setCustomPokeData] = useState<any[]>([]);


  const handleQuickMoveSelect = (moveId: string, move: any) => {
    setSelectedQuickMove(moveId);
  };

  const handleStatsSelect = (stats: any) => {
    setStats(stats);
    
  }

  const handleBonusSelect = (bonus: any) => {
    setSelectedBonuses(bonus);
    
  }
  
  useEffect(() => {
    if (clickedSuggestion) {
      searchPokemon();
      setClickedSuggestion(false);
    }
  } , [clickedSuggestion]);

  const searchPokemonInit = (pokemonD: any) => {
    setPokemon(pokemonD.pokedex.pokemonId);
    handleQuickMoveSelect("", null);
    handleChargedMoveSelect("", null);
    setLoading(true);
    setError(null);
    try {
      const response = PoGoAPI.getPokemonPBByID(pokemonD.pokemonId, pokemonList)[0];
      if (!response) {
        setPokemonData(null);
        setAvailableForms([]);
        setCustomFMList([]);
        setCustomCMList([]);
        setError("Pokemon not found.");
        return;
      }
      setPokemonData(response);
      onSelect(response);
      const allForms = pokemonList.filter((p: any) => p.pokedex.pokemonId === pokemonD.pokedex.pokemonId && (p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX"));
      
      setAvailableForms(allForms);
      setSelectedForm(pokemonD.pokemonId);
      
      // Si es un APEX, añadimos el bonus de Shadow
      if (response?.pokemonId.endsWith("_S_FORM") || response?.pokemonId.endsWith("_SHADOW_FORM")) {
        setTimeout(() => {
          handleBonusChange(1, true);
        }, 2);
      } else {
        setTimeout(() => {
          handleBonusChange(1, false);
        }, 2);
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Un movimiento custom se ha borrado, si estamos viendo un Pokémon con movimientos custom, refrescamos los movimientos para mostrar que el movimiento ha sido borrado
    if (customMoveDeletionChecker) {
      setTimeout(() => {
        if (pokemonData) {
          const pokemonDataRefreshed = PoGoAPI.getPokemonPBByID(pokemonData.pokemonId, pokemonList)[0];
          setPokemonData(pokemonDataRefreshed);
          
          let newCustomFMoves = customFMList.filter((moveId) => moveId !== deletedMoveId);
          let newCustomCMoves = customCMList.filter((moveId) => moveId !== deletedMoveId);
          setCustomFMList(newCustomFMoves);
          setCustomCMList(newCustomCMoves);

        }
        setCustomMoveDeletionChecker(false);
      }, 2);
    }
  }, [customMoveDeletionChecker]);

  const searchPokemon = () => {
    setLoading(true);
    setError(null);
    handleQuickMoveSelect("", null);
    handleChargedMoveSelect("", null);
    setSelectedForm("normal");
    setSuggestions([])
    let searchParam = PoGoAPI.getKey(pokemon, searchBarNames);
    try {
      const response = PoGoAPI.getPokemonPBByID(searchParam, pokemonList)[0];
      if (!response) {
        setPokemonData(null);
        setAvailableForms([]);
        setCustomFMList([]);
        setCustomCMList([]);
        setError("Pokemon not found.");
        return;
      }
      setPokemonData(response);
      onSelect(response);
      const allForms = PoGoAPI.getPokemonPBByName(pokemon.toUpperCase(), pokemonList).filter((p: any) => p.pokemonId !== "URSHIFU_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_GIGANTAMAX" && p.pokemonId !== "ZACIAN_GIGANTAMAX" && p.pokemonId !== "ZACIAN_CROWNED_SWORD_GIGANTAMAX" && p.pokemonId !== "ZAMAZENTA_CROWNED_SHIELD_GIGANTAMAX");
      setAvailableForms(allForms);// Construir nueva URL

      let customFMoves = [...(response.quickMoves ?? [])];
      setCustomFMList(customFMoves);

      let customCMoves = [...(response.cinematicMoves ?? [])];
      setCustomCMList(customCMoves);
      
      // Si es un APEX, añadimos el bonus de Shadow
      if (response?.pokemonId.endsWith("_S_FORM") || response?.pokemonId.endsWith("_SHADOW_FORM")) {
        setTimeout(() => {
          handleBonusChange(1, true);
        }, 2);
      } else {
        setTimeout(() => {
          handleBonusChange(1, false);
        }, 2);
      }

    } finally {
      setLoading(false);
    }
  };

  const searchForm = (form: string) => {
    setLoading(true);
    setError(null);
    handleQuickMoveSelect("", null);
    handleChargedMoveSelect("", null);
    try {
      const response = PoGoAPI.getPokemonPBByID(form, pokemonList)[0];
      if (!response) {
        setPokemonData(null);
        setAvailableForms([]);
        setCustomFMList([]);
        setCustomCMList([]);
        setError("Pokemon not found.");
        return;
      }
      setPokemonData(response);
      onSelect(response);
      
      let customFMoves = [...(response.quickMoves ?? [])];
      setCustomFMList(customFMoves);

      let customCMoves = [...(response.cinematicMoves ?? [])];
      setCustomCMList(customCMoves);
      
      // Si es un APEX, añadimos el bonus de Shadow
      if (response?.pokemonId.endsWith("_S_FORM") || response?.pokemonId.endsWith("_SHADOW_FORM")) {
        setTimeout(() => {
          handleBonusChange(1, true);
        }, 2);
      } else {
        setTimeout(() => {
          handleBonusChange(1, false);
        }, 2);
      }
    
    } finally {
      setLoading(false);
    }
  };

  const handleChargedMoveSelect = (moveId: string, move: any, write: boolean = true) => {
    setSelectedChargedMove(moveId);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedForm(event.target.value);
    onSelect(searchForm(event.target.value));
  };

  // [level, attack, defense, stamina]
  const handleChangeStat = (value: number[], index: number) => {
  if (index === 0 && (value[0] < 1 || value[0] > 51)) return;
  if (index > 0 && (value[0] < 0 || value[0] > 15)) return;

  setStats((prev: number[]) => {
    const newStats = [...prev];
    newStats[index] = value[0];
    return newStats;
  });
};

  // Bonuses = [weather-boost, shadow, mega, friendship]
  const handleBonusChange = (bonusIndex: number, value: any) => {
    setSelectedBonuses((prev: any) => {
      const newBonuses = [...prev];
      newBonuses[bonusIndex] = value;
      return newBonuses;
    });
  };



  const handleSuggestionClick = (suggestion: any) => {
    setPokemon(suggestion);
    setClickedSuggestion(true);
    setSuggestions([]);
  };

  const exportPokemon = () => {
    if (!pokemonData || !selectedQuickMove || !selectedChargedMove) {
      setError("To export, please select a Pokémon and both moves.");
      return;
      
    }

    const exportData = {
      pokemon: pokemonData.pokemonId,
      stats: stats,
      quickMove: selectedQuickMove ? selectedQuickMove : null,
      chargedMove: selectedChargedMove ? selectedChargedMove : null,
      bonuses: selectedBonuses,
      maxmoves: importMaxMove,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pokemonData.pokemonId.toLowerCase()}_attackerdata.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const importPokemon = async () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      
      input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = async (event) => {
              try {
                  const data = JSON.parse(event.target?.result as string);
                  if (data.pokemon && data.stats && data.quickMove && data.chargedMove && data.bonuses) {
                      setIsImporting(true);
                      try {
                          // Primero obtenemos todos los datos necesarios
                          const pokemonData = PoGoAPI.getPokemonPBByID(data.pokemon, pokemonList)[0];
                          const quickMove = PoGoAPI.getMovePBByID(data.quickMove, allMoves);
                          const chargedMove = PoGoAPI.getMovePBByID(data.chargedMove, allMoves);

                          if (!(pokemonData.quickMoves).includes(data.quickMove)) 
                        {
                            setError("The selected Quick Move is not available for this Pokémon.");
                            setIsImporting(false);
                            return;
                        }

                          else if (!(pokemonData.cinematicMoves).includes(data.chargedMove)) {
                              setError("The selected Charged Move is not available for this Pokémon.");
                              setIsImporting(false);
                              return;
                          }
                          
                          else if (data.stats.length !== 4 || data.bonuses.length !== 4) {
                              setError("Invalid data format in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.stats[0] < 1 || data.stats[0] > 51 || data.stats[1] < 0 || data.stats[1] > 15 || data.stats[2] < 0 || data.stats[2] > 15 || data.stats[3] < 0 || data.stats[3] > 15) {
                              setError("Invalid stats in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.bonuses[3] < 0 || data.bonuses[3] > 5) {
                              setError("Invalid friendship level in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.maxmoves.length !== 3 || data.maxmoves.some((move: number) => move < 0 || move > 3)) {
                              setError("Invalid max moves in the imported file.");
                              setIsImporting(false);
                              return;
                          }

                         else if (data.maxmoves[0] < 1) {
                              setError("Invalid max moves in the imported file.");
                              setIsImporting(false);
                              return;
                          }


                          // Luego actualizamos todo en orden
                          await searchPokemonInit(pokemonData);
                          handleStatsSelect(data.stats);
                          handleBonusSelect(data.bonuses);
                          handleQuickMoveSelect(data.quickMove, quickMove);
                          handleChargedMoveSelect(data.chargedMove, chargedMove, true);

                          setImportMaxMove(data.maxmoves || [1, 0, 0]);

                          //console.log("Import successful, importing on link...");

                      } finally {
                          setTimeout(() => {
                            setIsImporting(false);
                          }, 350);
                      }
                  } else {
                      setError("Invalid file format.");
                  }
              } catch (error) {
                  setError("Error reading file: " + error);
              }
          };
          reader.readAsText(file);
      };
      input.click();
  };

  const selectedPokemon = pokemonData //? getSelectedForm() : null;

  const raidmode = raidMode ? raidMode : "normal";
  
  const effAttack = Calculator.getEffectiveAttack(selectedPokemon?.stats?.baseAttack, (slot == 1 ? stats[1] : (slot == 2 && raidMode === "normal") ? stats[1] : 15), slot == 1 ? stats[0] : (slot == 2 && raidMode === "normal") ? stats[0] : raidModeLevelMultiplier);
  const effDefense = Calculator.getEffectiveDefense(selectedPokemon?.stats?.baseDefense, (slot == 1 ? stats[2] : (slot == 2 && raidMode === "normal") ? stats[2] : 15), slot == 1 ? stats[0] : (slot == 2 && raidMode === "normal") ? stats[0] : raidModeLevelMultiplier);
  const effStamina = Calculator.getEffectiveStamina(selectedPokemon?.stats?.baseStamina, (slot == 1 ? stats[3] : (slot == 2 && raidMode === "normal") ? stats[3] : 15), slot == 1 ? stats[0] : (slot == 2 && raidMode === "normal") ? stats[0] : raidModeLevelMultiplier);

  //console.log(selectedPokemon? selectedPokemon : "null");

  const suffixes = ["_MEGA", "_MEGA_X", "_MEGA_Y", "_MEGA_Z"];

  const weaknesses = selectedPokemon ? PoGoAPI.getAllWeaknesses(selectedPokemon.type, selectedPokemon.type2, allTypes) : null;

  const uniqueForms = availableForms.filter(
  (form: any, index: number, self: any[]) =>
    index === self.findIndex((f) => f.pokemonId === form.pokemonId)
  );

  const showID = localStorage.getItem("showIDs") === "true";

    const handleMoveChange = (e: React.ChangeEvent<HTMLInputElement>, moveType: string) => {
    const value = e.target.value;
    if (moveType === "fast") {
      setCustomFastMove(value);
      if (value.length > 0) {
        const filteredMoves = PoGoAPI.getMovePBByName(value, allMoves, true, [selectedPokemon?.quickMoves, customFMList].flat());
        setFMSuggestions(filteredMoves);
      } else {
        setFMSuggestions([]);
      }
    } else {
      setCustomChargedMove(value);
      if (value.length > 0) {
        const filteredMoves = PoGoAPI.getMovePBByName(value, allMoves, false, [selectedPokemon?.cinematicMoves, customCMList].flat());
        setCMSuggestions(filteredMoves);
      } else {
        setCMSuggestions([]);
      }
    }
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPokemon(value);

    // Filtrar sugerencias
    if (value.length > 0) {
      const filteredSuggestions = PoGoAPI.getPokemonPBBySpeciesName(value, pokemonList, allEnglishText).filter((p: any) => ((PoGoAPI.getPokemonNamePB(p.pokedex.pokemonId, allEnglishText))
        .toLowerCase()))
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleMoveSuggestionClick = (suggestion: any, moveType: string) => {
    if (suggestion.moveId) {
      if (moveType === "fast") {
        setCustomFastMove(suggestion.moveId);
        setFMSuggestions([]);
      } else {
        setCustomChargedMove(suggestion.moveId);
        setCMSuggestions([]);
      }

    }
  };
  
  function handleAddCustomMove(moveType: string): void {
    if (moveType === "fast") {
      let newList = [...customFMList];
      newList.push(customFastMove);
      setCustomFMList(newList);
      setCustomFastMove("");
    } else {
      let newList = [...customCMList];
      newList.push(customChargedMove);
      setCustomCMList(newList);
      setCustomChargedMove("");
    }
  }

  function deleteMoveFromList(moveType: string, moveId: string) {
    if (moveType === "fast" && customFMList.length > 1) {
      setCustomFMList(customFMList.filter((id) => id !== moveId));
    } else if (moveType === "charged" && customCMList.length > 1) {
      setCustomCMList(customCMList.filter((id) => id !== moveId));
    }
  }



  function saveCustomMovesToPokemon() {
    PoGoAPI.setCustomPokemonMoves(selectedPokemon.pokemonId, customFMList, customCMList);
    setTimeout(() => {
      setCustomPokeData(PoGoAPI.getAllCustomPokemonMoves());
      alert("Custom moves saved for " + PoGoAPI.getPokemonNamePB(selectedPokemon.pokemonId, allEnglishText) + "!");
    }, 2);
  }

  function resetCustomMovesToDefault() {
    PoGoAPI.setCustomPokemonMovesToDefault(selectedPokemon.pokemonId);

    setTimeout(() => {
      const pokemonData = PoGoAPI.getPokemonPBByID(selectedPokemon.pokemonId, pokemonList)[0];
      setCustomFMList(pokemonData.quickMoves);
      setCustomCMList(pokemonData.cinematicMoves);
      setCustomPokeData(PoGoAPI.getAllCustomPokemonMoves());
      alert("Custom moves reset to default for " + PoGoAPI.getPokemonNamePB(selectedPokemon.pokemonId, allEnglishText) + "!");
    }, 2);
  }

  useEffect(() => {
    setCustomPokeData(PoGoAPI.getAllCustomPokemonMoves());
  }, []);

  return (
    <>
      <Input
        placeholder="Search for a Pokémon"
        type="text"
        value={pokemon}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && searchPokemon()}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 resp-box-suggest ">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.pokemonId}
              className="p-2 cursor-pointer hover:bg-gray-200 "
              onClick={() => handleSuggestionClick(PoGoAPI.getPokemonNamePB(suggestion.pokemonId, allEnglishText))}
            >
              {PoGoAPI.getPokemonNamePB(suggestion.pokemonId, allEnglishText)}
            </li>
          ))}
        </ul>
      )}
      <div>
        <Button onClick={searchPokemon} className="mt-4 mb-2 mr-2">Search</Button>
        <Button onClick={saveCustomMovesToPokemon} className="mt-4 mb-2 mr-2">Save</Button>
        <Button onClick={resetCustomMovesToDefault} className="mt-4 mb-2">Default</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Clicking "Default" will reset the Pokémon's values to their original state. This action cannot be undone, so make sure you want to reset before clicking it.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Custom data exist for {Object.keys(customPokeData).length} Pokémon (
          {Object.entries(customPokeData).map(([pokeKey], index, arr) => (
            <span key={pokeKey}>{pokeKey}{index < arr.length - 1 ? ", " : ""}</span>
          ))}
        )
      </p>
      {loading || isImporting && (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4">
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {(pokemonData && !isImporting) ? (
        <div>
          <h2>Name: {PoGoAPI.getPokemonNamePB(selectedPokemon.pokemonId, allEnglishText)}</h2>
          {showID && <p className="text-xs italic text-gray-500">ID: {selectedPokemon.pokemonId}</p>}
          <p>Type(s): <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type)} />  {(selectedPokemon.type2) && <TypeBadge type={PoGoAPI.formatTypeName(selectedPokemon.type2)} />} <button onClick={() => setShowWeaknesses(!showWeaknesses)}>?</button></p>
          

          {weaknesses && showWeaknesses && (
            <WeaknessResistanceTable weaknesses={weaknesses} />
          )}
          
          <select onChange={handleFormChange} value={selectedForm} className="mt-2 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-2 rounded-lg">
            {uniqueForms.map((form: any) => (
              <option key={form.pokemonId} value={form.pokemonId}>
                {PoGoAPI.getPokemonNamePB(form.pokemonId, allEnglishText)}
              </option>
            ))}
          </select>

          <p>Stats (CP {raidmode == "normal" ? Calculator.getPCs(effAttack, effDefense, effStamina) : Calculator.getRawPCs(selectedPokemon?.stats?.baseAttack, selectedPokemon?.stats?.baseDefense, Calculator.getRaidBossHP(raidmode))}) </p>
          <div className="flex flex-row items-center space-x-2">
            <p>Attack: {selectedPokemon.stats?.baseAttack}</p>
            
          </div>
          <Progress color={"bg-red-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseAttack / 505) * 100}/>
          
          <div className="flex flex-row items-center space-x-2">
            <p>Defense: {selectedPokemon.stats?.baseDefense}</p> 
            
          </div>
          <Progress color={"bg-green-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseDefense / 505) * 100}/>
          
          <div className="flex flex-row items-center space-x-2">
            <p>Stamina: {selectedPokemon.stats?.baseStamina} </p> 
          </div>
          
          <Progress color={"bg-yellow-600"} className="w-[60%]" value={(selectedPokemon.stats?.baseStamina / 505) * 100}/>
          
            <Image
              unoptimized
                className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 p-2 " + ((selectedBonuses[1] === true && (slot === 1 || (slot === 2 && raidMode === "normal"))) ? "bg-gradient-to-t from-purple-900 to-violet-100" : "bg-white") + " dark:bg-gray-800 dark:border-gray-700"}
                src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(selectedPokemon.pokemonId, assets )}
                alt={selectedPokemon.pokemonId + " | Pokémon GO Damage Calculator"}
                width={400}
                height={400}
                style={{ objectFit: 'scale-down', width: '200px', height: '200px' }}
            />
          {(slot === 1 || (slot === 2 && raidMode === "normal")) && 
          <div className="grid grid-cols-1 mb-4">
          
        </div>
          }
          <div className="flex flex-row space-x-4">
            <div>
              <p>Fast Attacks:</p>
              {customFMList.map((move: string) => (
                PoGoAPI.getMovePBByID(move, allMoves)?.type && (<Card
                  key={move}
                  className={`mb-4`}
                >
                  <CardHeader>
                    <CardTitle>{PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(move, allMoves)).moveId)}{(selectedPokemon?.eliteQuickMove ?? []).includes(move) ? " *" : ((selectedPokemon?.customQuickMoves ?? []).includes(move) ? " +" : "")}</CardTitle>
                    {showID && <p className="text-xs italic text-gray-500">{PoGoAPI.getMovePBByID(move, allMoves).moveId}</p>}
                    <div>
                      <Button className="text-xs bg-red-500 p-2" onClick={() => deleteMoveFromList("fast", move)}>
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                </Card>)
              ))}
              <Card>
                <CardHeader>
                  <CardTitle>New Fast Move</CardTitle>
                  <div>
                    <Input
                      placeholder="Move ID"
                      type="text"
                      value={customFastMove}
                      onChange={(e) => handleMoveChange(e, "fast")}
                      onKeyDown={(e) => e.key === "Enter" && handleMoveSuggestionClick(fmSuggestions[0], "fast")}
                    />
                    {fmSuggestions.length > 0 && (
                      <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 resp-box-suggest ">
                        {fmSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.moveId}
                            className="p-2 cursor-pointer hover:bg-gray-200 "
                            onClick={() => handleMoveSuggestionClick(suggestion, "fast")}
                          >
                            {suggestion.moveId}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button className="text-xs bg-green-500 mr-2 p-2" onClick={() => handleAddCustomMove("fast")}>
                      Add
                    </Button>
                  </div>
                </CardHeader>
              </Card>  
            </div>

            <div>
              <p>Charged Attacks:</p>
              {customCMList.map((move: string) => (
                PoGoAPI.getMovePBByID(move, allMoves)?.type && (<Card
                  key={move}
                  className={`mb-4`}
                >
                  <CardHeader>
                      <CardTitle>{PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(move, allMoves)).moveId)}{(selectedPokemon?.eliteCinematicMove ?? []).includes(move) ? " *" : ((selectedPokemon?.customCinematicMoves ?? []).includes(move) ? " +" : "")}</CardTitle>
                      {showID && <p className="text-xs italic text-gray-500">{PoGoAPI.getMovePBByID(move, allMoves).moveId}</p>}
                      <div>
                        <Button className="text-xs bg-red-500 p-2" onClick={() => deleteMoveFromList("charged", move)}>
                          Delete
                        </Button>
                      </div>
                  </CardHeader>
                  </Card>)
              ))}

              <Card>
                <CardHeader>
                  <CardTitle>New Charged Move</CardTitle>
                  <div>
                    <Input
                      placeholder="Move ID"
                      type="text"
                      value={customChargedMove}
                      onChange={(e) => handleMoveChange(e, "charged")}
                      onKeyDown={(e) => e.key === "Enter" && handleMoveSuggestionClick(cmSuggestions[0], "charged")}
                    />
                    {cmSuggestions.length > 0 && (
                      <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 resp-box-suggest ">
                        {cmSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.moveId}
                            className="p-2 cursor-pointer hover:bg-gray-200 "
                            onClick={() => handleMoveSuggestionClick(suggestion, "charged")}
                          >
                            {suggestion.moveId}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button className="text-xs bg-green-500 mr-2 p-2" onClick={() => handleAddCustomMove("charged")}>
                      Add
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        (!isImporting) ? (<p>No Pokémon selected</p>) : (<p>Importing data...</p>)
      )}
    </>
  );
}