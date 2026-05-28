"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchBarAttacker from "@/components/search-bar-attacker";
import { PoGoAPI } from "../../lib/PoGoAPI";
import CalculateButton from "@/components/calculate-button";
import CalculateButtonSimulate from "@/components/calculate-button-simulate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CalculateButtonSimulateAdvanced from "@/components/calculate-button-advanced-simulate";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CookieBanner from "@/components/cookie-banner";
import Navbar from "@/components/navbar";
import { Calculator } from "../../lib/calculations";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import { Slider } from "@/components/ui/slider";
import CalculateButtonSimulateTurnBased from "@/components/calculate-button-turn-based";
import SearchBarEditor from "@/components/search-bar-editor";
import SearchBarMoveEditor from "@/components/search-bar-editor-move";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MyCustomMoves from "@/components/my-custom-moves";
import { set } from "mongoose";

export default function Home() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

  const [numMembers, setNumMembers] = useState<number>(searchParams.get("num_pokemon") ? parseInt(searchParams.get("num_pokemon") as string) : 1);
    
  const [attackingPokemon, setAttackingPokemon] = useState<any>(null);
  
  
  
  const [pokemonList, setAllPokemonPB] = useState<any>(null);
  const [searchBarNames, setSearchBarNames] = useState<any>(null);
  const [allMoves, setAllMoves] = useState<any>(null);
  const [imageLinks, setImageLinks] = useState<any>(null);
  const [allEnglishText, setAllEnglishText] = useState<any>(null);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);
  

  const [types, setTypes] = useState<any>(null);
  
  const [cleared, setCleared] = useState<boolean>(true);

  const [newMoveName, setNewMoveName] = useState<string>("");
  const [newMoveIsFast, setNewMoveIsFast] = useState<boolean>(true);

  const [alertMessage, setAlertMessage] = useState<string>("");

  const [autoUpdater, setAutoUpdater] = useState<boolean>(false);

  const [customMoveDeletionChecker, setCustomMoveDeletionChecker] = useState<boolean>(false);
  const [deletedMoveId, setDeletedMoveId] = useState<string>("");

  useEffect(() => {
    const fetchAllPokemonPB = async () => {
      
      
      const pokemonlist = await PoGoAPI.getAllPokemonPB();
      setAllPokemonPB(pokemonlist);
      //console.log("Fetched all Pokémon from PokeBattler API");

      const names = await PoGoAPI.getAllPokemonNames();
      setSearchBarNames(names);
      //console.log("Fetched all Pokémon names from API");

      const moves = await PoGoAPI.getAllMovesPB();
      setAllMoves(moves);
      //console.log("Fetched all moves from PokeBattler API");

      const images = await PoGoAPI.getAllPokemonImagesPB();
      setImageLinks(images);
      //console.log(images);
      //console.log("Fetched all images from PokeBattler API");

      const text = await PoGoAPI.getAllEnglishNamesPB();
      setAllEnglishText(text);
      //console.log(text);
      //console.log("Fetched all English text from PokeBattler API");

      const allTypesData = await PoGoAPI.getTypes();
      setTypes(allTypesData);
      //console.log("Fetched all types from PokeBattler API");
      //console.log(allTypesData);

      
      setAllDataLoaded(true);
    };
    fetchAllPokemonPB();
    
  }, []);

  const handleAttackerSelect = (pokemon: any) => {
    if (pokemon === null) {
      setCleared(false);

      setAttackingPokemon(pokemon);
      setTimeout(() => {
        setCleared(true);
      }, 100);
    }
  };

  const handleMoveSelect = (move: any) => {
    if (move === null) {
      setCleared(false);

      setAttackingPokemon(move);
      setTimeout(() => {
        setCleared(true);
      }, 100);
    }
  }

  function allPokemonSelected() {
    for (let i = 0; i < numMembers; i++) {
      if (!attackingPokemon[i]) {
        return false;
      }
    }
    return true;
  }


  const raidSurname = (raidMode: string) => {
    if (raidMode === "raid-t1") {
      return "Tier 1";
    } else if (raidMode === "raid-t3") {
      return "Tier 3";
    } else if (raidMode === "raid-t4") {
      return "Tier 4";
    } else if (raidMode === "raid-mega") {
      return "Mega";
    } else if (raidMode === "raid-t5") {
      return "Tier 5";
    } else if (raidMode === "raid-elite") {
      return "Elite";
    } else if (raidMode === "raid-primal") {
      return "Primal";
    } else if (raidMode === "raid-mega-leg") {
      return "Mega Legendary";
    } else if (raidMode === "raid-t7-supermega") {
      return "Super Mega";
    } else if (raidMode === "raid-t1-shadow") {
      return "Tier 1 Shadow";
    } else if (raidMode === "raid-t3-shadow") {
      return "Tier 3 Shadow";
    } else if (raidMode === "raid-t5-shadow") {
      return "Tier 5 Shadow";
    } else {
      return "Normal";
    }
  }

  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <div className="flex flex-col flex-row items-center justify-center space-y-4">
      <div className="flex flex-row items-center justify-center space-x-4">
        <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
        <a href="/pokemon-go-damage-calculator">
        <h1 className="mb-10 title">
        PokéChespin Editor
        </h1>
        </a>
      <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
      </div>
      <p className="linktext">Made by <a className="link" href="https://github.com/CreatorBeastGD">CreatorBeastGD</a></p>
      
      <Navbar/>
      <div className="flex responsive-test space-y-4 md:space-y-4 big-box">
        <Card className="md:w-1/2 w-full">
          <CardHeader>
            <CardTitle>Pokémon Editor</CardTitle>
            <CardDescription>Set a Pokémon and update its available moves. You can either add new moves or remove its moves. Newly added moves will be displayed with a "+" symbol on the calculator. Sharing a link with an existing move with a "+" symbol will work, but others can't see the move on the list.</CardDescription>
            <CardDescription><span>Note: Custom moves won't be saved on a database but on your local storage, so they will only be available for you and only on this browser. If you clear your cookies or access the calculator from another browser or device, these custom moves will be lost.</span></CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>
          </CardHeader>
          {(pokemonList && searchBarNames && allMoves) ? (
            <CardContent>
            
            
              <SearchBarEditor
                allEnglishText={allEnglishText}
                assets={imageLinks}
                allMoves={allMoves}
                searchBarNames={searchBarNames}
                pokemonList={pokemonList}
                onSelect={(pokemon) => handleAttackerSelect(pokemon)}
                slot={1}
                paramsLoaded={paramsLoaded}
                allTypes={types}
                customMoveDeletionChecker={customMoveDeletionChecker}
                setCustomMoveDeletionChecker={setCustomMoveDeletionChecker}
                deletedMoveId={deletedMoveId}
                setDeletedMoveId={setDeletedMoveId}
              /> 
          </CardContent>) : (
        <div className="flex flex-col items-center justify-center space-y-2 mt-4 mb-4">
          <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
          <p className="text-primary text-lg">Loading...</p>
        </div>
      )}
        </Card>
        <Card className="md:w-1/2 w-full">
          <CardHeader>
            <CardTitle>Move Editor</CardTitle>
            <CardDescription>Set a move and update any of its properties. You must be aware that these changes will only be reflected to your calculator. Sharing a link with a customized move won't pass its custom values.</CardDescription>
            <CardDescription><span>Note: Custom moves won't be saved on a database but on your local storage, so they will only be available for you and only on this browser. If you clear your cookies or access the calculator from another browser or device, these custom moves will be lost. Max moves cannot be edited.</span></CardDescription>
            <CardDescription><span className="italic text-xs">(Pick one result from suggestions)</span></CardDescription>

          </CardHeader>
          {(pokemonList && searchBarNames && allMoves) ? (
            <CardContent>
              <SearchBarMoveEditor
                allEnglishText={allEnglishText}
                allMoves={allMoves}
                onSelect={(move) => handleMoveSelect(move)}
                allTypes={types}
                autoUpdaterHandler={setAutoUpdater}
                deletedMoveId={deletedMoveId}
              /> 
            </CardContent>) : (
              <div className="flex flex-col items-center justify-center space-y-2 mt-4 mb-4">
                <Image unoptimized src="https://i.imgur.com/aIGLQP3.png" alt="Favicon" className="inline-block mr-2 favicon" width={32} height={32} />
                <p className="text-primary text-lg">Loading...</p>
              </div>
            )}
        </Card>
        <Card className="md:w-1/2 w-full ">
            <CardHeader >
              <CardTitle>Move Creator</CardTitle>
              <CardDescription>Create a new custom move. This will make a new fast or charged move available with some default properties, that you will be able to change in the Move Editor.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col w-[50%]">
                <p>Move name</p>
                <Input
                  placeholder="Enter move name"
                  value={newMoveName}
                  onChange={(e) => setNewMoveName(e.target.value)}
                />
              </div> 
              <div className="flex flex-col w-[50%]">
                <p>Move Kind: </p>
                <Button onClick={() => setNewMoveIsFast(!newMoveIsFast)} className={newMoveIsFast ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                  {newMoveIsFast ? "Fast Move" : "Charged Move"}
                </Button>
              </div> 
             </div>
             <Button onClick={() => {setAlertMessage(PoGoAPI.createCustomMove(newMoveName, newMoveIsFast, allMoves)); setAutoUpdater(!autoUpdater);}} className="mt-4 w-full">Create Move</Button>
             <p>{alertMessage}</p>

             <MyCustomMoves
              allEnglishText={allEnglishText}
              autoUpdater={autoUpdater}
              setAutoUpdater={setAutoUpdater}
              moveDeletionChecker={setCustomMoveDeletionChecker}
              deletedMoveId={setDeletedMoveId}
             />
            </CardContent>
        </Card>
      </div>
      
      <p className="bottomtext">Version {PoGoAPI.getVersion()}</p>
      <Avatar className="mb-4">
        <AvatarImage src="https://github.com/CreatorBeastGD.png" alt="CreatorBeastGD" />
        <AvatarFallback>CB</AvatarFallback>
      </Avatar>
      <p className="mb-4 bottomtext">Any issues? open a new issue or create a pull request on the <a className="link" href="https://github.com/CreatorBeastGD/pokemongo_damage_calculator/issues">repository</a> to help this project!</p>
      <h1 className="textslate">Pokémon GO Damage Calculator | PokéChespin</h1>
      
      <CookieBanner />
    </div>
    
  );
}