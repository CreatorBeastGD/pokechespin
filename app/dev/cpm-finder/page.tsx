"use client"

import { useEffect, useState } from "react";
import { PoGoAPI } from "../../../lib/PoGoAPI";

export default function CpmFinder() {

    
    const [pokemonList, setAllPokemonPB] = useState<any>(null);
    const [allMoves, setAllMoves] = useState<any>(null);
    const [imageLinks, setImageLinks] = useState<any>(null);
    const [allEnglishText, setAllEnglishText] = useState<any>(null);
    const [dmaxPokemon, setDmaxPokemon] = useState<any>(null);
    const [types, setTypes] = useState<any>(null);
    const [searchBarNames, setSearchBarNames] = useState<any>(null);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [contenders, setContenders] = useState<any[]>([]);

    // Variables
    const [movePower, setMovePower] = useState<number | null>(null);
    const [moveType, setMoveType] = useState<string | null>(null);
    const [weather, setWeather] = useState<string>("EXTREME");
    const [expectedCpm, setExpectedCpm] = useState<number | null>(null);
    const [baseAtk, setBaseAtk] = useState<number | null>(null);
    const [stabBonus, setStabBonus] = useState<boolean>(false);

    const [analyzingContenders, setAnalyzingContenders] = useState<boolean>(true);

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
              const dmax = await PoGoAPI.getAvailableMaxPokemonPB();
              setDmaxPokemon(dmax);
    
              const types = await PoGoAPI.getTypes();
              setTypes(types);
              
              setAllDataLoaded(true);
            };
            fetchAllPokemonPB();
        }, []);

        const CalculateLimits = () => {
            if (allDataLoaded) {
                // All data is loaded, you can use it here
                //console.log("Calculating contenders...")
                setAnalyzingContenders(true);
                setContenders([]);
                setTimeout(() => {
                    if (movePower && moveType && expectedCpm && baseAtk) {
                        const newContenders = PoGoAPI.CpmFinder(
                            movePower, // Move's power
                            moveType, // Move's type
                            weather, // Weather
                            expectedCpm, // Attacker's expected CPM
                            baseAtk, // Attacker's Base ATK. Not including IVs (Default 15)
                            stabBonus, // STAB bonus
                            types, // Type list, untouched
                            pokemonList // Pokémon list, untouched
                        )
                        //console.log(newContenders);
                        if (newContenders && typeof newContenders === "object") {
                            setContenders([newContenders.minimumCPMcontender, newContenders.maximumCPMcontender]);
                        } else {
                            setContenders([]);
                        }
                        //console.log(contenders);
                    }
                }, 10);
                setAnalyzingContenders(false);
            }
        };

    return (
        <>
            <h1>CPM Finder</h1>
            {allDataLoaded && (
                <div>
                    <p className="p-4">This tool helps you finding the upper and lower limits of a Pokémon's CPM based on one of its move data and a given expected CPM. This helps on obtaining a more precise range of CPM values of any Max Battle boss.</p>

                    <div className="flex flex-col flex-row items-center justify-center space-y-4">
                        <p>Move Power: <input type="number" className="text-red-600 font-black" placeholder="Move Power" onChange={(e) => setMovePower(Number(e.target.value))} /></p>
                        <p>Move Type: <select className="text-red-600 p-2" onChange={(e) => setMoveType(e.target.value)}>
                            <option className="text-red-600" value="">Select Move Type</option>
                            {types.map((type: any) => (
                                <option className="text-red-600" key={type.type} value={"POKEMON_TYPE_" + type.type.toUpperCase()}>{type.type}</option>
                            ))}
                        </select></p>
                        <p>Weather: <select className="text-red-600 p-2" onChange={(e) => setWeather(e.target.value)}>
                            <option className="text-red-600" value="EXTREME">Extreme</option>
                            <option className="text-red-600" value="SUNNY">Sunny</option>
                            <option className="text-red-600" value="RAINY">Rainy</option>
                            <option className="text-red-600" value="FOG">Fog</option>
                            <option className="text-red-600" value="PARTLY_CLOUDY">Partly Cloudy</option>
                            <option className="text-red-600" value="CLOUDY">Cloudy</option>
                            <option className="text-red-600" value="WINDY">Windy</option>
                            <option className="text-red-600" value="SNOW">Snowy</option>
                        </select></p>
                        <p>Expected CPM: <input type="number" className="text-red-600 font-black" placeholder="Expected CPM" onChange={(e) => setExpectedCpm(Number(e.target.value))} /></p>
                        <p>Attacker' Base Attack: <input type="number" className="text-red-600 font-black" placeholder="Base ATK" onChange={(e) => setBaseAtk(Number(e.target.value))} /></p>
                        <p><input type="checkbox" onChange={(e) => setStabBonus(e.target.checked)} /> STAB Bonus</p>
                        <button onClick={CalculateLimits}>Calculate Limits</button>
                    </div>

                    {contenders.length > 0 ? (
                        <div>
                            <h2 className="p-4">Contenders</h2>
                            <p className="p-4">Minimun Contender: {contenders[0]?.pokemon.pokemonId}, level {contenders[0]?.level} with {contenders[0]?.defenseIV}IV defense ({contenders[0]?.cpm}CPM, expected damage of {contenders[0]?.expectedDamage})</p>
                            <p className="p-4">Maximum Contender: {contenders[1]?.pokemon.pokemonId}, level {contenders[1]?.level} with {contenders[1]?.defenseIV}IV defense ({contenders[1]?.cpm}CPM, expected damage of {contenders[1]?.expectedDamage})</p>
                        </div>
                    ) : (
                        <>{analyzingContenders ? <p className="p-4">Select "Calculate Limits" to get the best contenders. (Make sure to fill all fields first!)</p> : <p className="p-4">Analyzing contenders...</p>}</>
                    )}
                </div>
            )}
        </>
    )
}