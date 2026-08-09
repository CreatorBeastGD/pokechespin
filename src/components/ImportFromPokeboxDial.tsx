"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PoGoAPI } from "../../lib/PoGoAPI"
import { ScrollArea } from "./ui/scroll-area";
import { PokebattlerImage } from "./PokebattlerImage";
import { useEffect, useState } from "react";
import { PBPokemonData } from "./PokemonData";
import Image from "next/image";


export function PokeboxButton({
  imageLinks,
  englishText,
  allMoves,
  onSelectPokemon,
}: {
  imageLinks: any;
  englishText: any;
  allMoves: any;
  onSelectPokemon?: (pokemon: PBPokemonData) => void;
}) {
    const [passedPokeboxData, setPassedPokeboxData] = useState<PBPokemonData[]>([]);
    const [filter, setFilter] = useState<string>("");

    const [pokeboxId, setPokeboxId] = useState<string | null>(null);

    const [pokeboxIdText, setPokeboxIdText] = useState<string>("");

    function savePokeboxIDToLocalStorage(id: string) {
        localStorage.setItem("pokeboxId", id);
        setPokeboxId(id);

        fetchPokeboxData();
    }

    const fetchPokeboxData = async () => {
            try {
                const pokeboxId = await localStorage.getItem("pokeboxId");
                setPokeboxId(pokeboxId);

                if (!pokeboxId) {
                    return;
                }
                const data = await PoGoAPI.getAllPokemonFromPokeboxPB(pokeboxId!);

                const convertedPokeboxData: PBPokemonData[] = data.map((pokemon: any) => {
                return new PBPokemonData(
                    pokemon.name,
                    pokemon.pokemonId,
                    {
                        level: pokemon.level,
                        atk: pokemon.individualAttack,
                        def: pokemon.individualDefense,
                        hp: pokemon.individualStamina
                    },
                    pokemon.quickMove,
                    pokemon.cinematicMove,
                    pokemon.shiny,
                    pokemon.dynamax,
                    {
                        attack: Math.min(Math.max(pokemon.maxPowerLevel, 1), 3),
                        guard: Math.min(Math.max(pokemon.maxShieldLevel, 0), 3),
                        spirit: Math.min(Math.max(pokemon.maxHealLevel, 0), 3)
                    }
                );
                });

                setPassedPokeboxData(convertedPokeboxData);
            } catch (error) {
                console.error("Error fetching Pokebox data:", error);
            }
        };


    useEffect(() => {
        fetchPokeboxData();
    }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-2 mr-2">
          <Image 
            unoptimized src={"https://www.pokebattler.com/favicon.ico"} alt="Pokebattler Logo" width={20} height={20}
          />
        Import from Pokebox</Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-2 border-white rounded-lg w-[80%] ">
        <DialogHeader>
          <DialogTitle>Import from Pokebox </DialogTitle>
          <DialogDescription>
            PokéChespin integrates with <a href="https://pokebattler.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Pokebattler</a> to allow you to import your Pokémon directly on the site from your Pokebox.
          </DialogDescription>
          <DialogDescription>
            You can also <a href="https://pokebattler.com/user/subscription?promo=POKECHESPIN20" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">subscribe to Pokebattler</a> to unlock additional Pokebox slots and support the development of PokéChespin with a 20% discount on your first month!
          </DialogDescription>
          
        </DialogHeader>
            {pokeboxId ? (
              <>
              <input
                    type="text"
                    placeholder="Filter name"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-800 text-white rounded px-2 py-1 w-full mt-2 "
                />
              <ScrollArea className="w-full h-[225px] rounded-lg border border-gray-200 bg-black px-4">
                <div className="flex flex-row flex-wrap gap-x-4 justify-center">
                    {passedPokeboxData.filter((pokemon) => 
                        pokemon.customName.toLowerCase().includes(filter.toLowerCase()) ||
                        pokemon.pokemonId.toLowerCase().includes(filter.toLowerCase())
                    ).map((pokemon, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      
                      {onSelectPokemon && (
                        <DialogClose asChild>
                          <button
                            onClick={() => onSelectPokemon(pokemon)}
                          ><PokebattlerImage imageLinks={imageLinks} englishText={englishText} allMoves={allMoves} pokemonData={pokemon} />
                          </button>
                        </DialogClose>
                      )}
                    </div>
                    ))} {passedPokeboxData.filter((pokemon) => 
                        pokemon.customName.toLowerCase().includes(filter.toLowerCase()) ||
                        pokemon.pokemonId.toLowerCase().includes(filter.toLowerCase())
                    ).length === 0 && (
                        <p className="text-white text-center mt-4">No Pokémon found.</p>
                    )}
                </div>
            </ScrollArea>
            </>
            ) : (
              <>
                <DialogDescription>
                    No Pokebattler ID or Username found. Log in to Pokebattler and find your ID <a href="https://www.pokebattler.com/user" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>.
                </DialogDescription>
                <div className="flex flex-row items-center justify-center">
                      <input
                      type="text"
                      placeholder="Your Pokebattler ID or Username"
                      value={pokeboxIdText}
                      onChange={(e) => setPokeboxIdText(e.target.value)}
                      className="bg-gray-800 text-white rounded px-2 py-1 w-full mt-2 text-sm"
                  />
                  <Button
                    onClick={() => {
                      if (pokeboxIdText) {
                        savePokeboxIDToLocalStorage(pokeboxIdText);
                      }
                    }}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm"
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
      </DialogContent>
      
    </Dialog>
  )
}
