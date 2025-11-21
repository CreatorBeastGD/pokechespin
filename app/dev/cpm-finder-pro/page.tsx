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
    const [contendersPokemon, setContendersPokemon] = useState<any[]>([]);

    // Variables
    const [movePower, setMovePower] = useState<number>(100);
    const [moveType, setMoveType] = useState<string>("POKEMON_TYPE_NORMAL");
    const [weather, setWeather] = useState<string>("EXTREME");
    const [expectedCpm, setExpectedCpm] = useState<number>(0.5);
    const [baseAtk, setBaseAtk] = useState<number>(150);
    const [stabBonus, setStabBonus] = useState<boolean>(false);
    const [jump, setJump] = useState<number>(0.000001);
    const [limit, setLimit] = useState<number>(0.000005);
    const [pokemonId, setPokemonId] = useState<string>("CHARIZARD");

    const [analyzingContenders, setAnalyzingContenders] = useState<boolean>(true);

    const [switchPokemon, setSwitchPokemon] = useState<boolean>(false);

    const [showMinContenders, setShowMinContenders] = useState<boolean>(true);

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

        const CalculateLimitsPokemon = () => {
            if (allDataLoaded) {
                // All data is loaded, you can use it here
                //console.log("Calculating contenders...")
                setAnalyzingContenders(true);
                setContendersPokemon([]);
                const pokemonData = PoGoAPI.getPokemonPBByID(pokemonId.toUpperCase(), pokemonList)[0];
                if (pokemonData) {
                    setTimeout(() => {
                        if (pokemonId && expectedCpm) {
                            const newContenders = PoGoAPI.CpmFinderByPokemonData(
                                pokemonData,
                                expectedCpm,
                                types,
                                pokemonList,
                                allMoves,
                                limit,
                                limit,
                                jump
                            );
                            if (newContenders && typeof newContenders === "object") {
                                setContendersPokemon([newContenders.minimumCPMcontender, newContenders.maximumCPMcontender, newContenders.minContenderList, newContenders.maxContenderList]);
                            } else {
                                setContendersPokemon([]);
                            }
                            //console.log(contendersPokemon);
                        }
                    }, 10);
                }
                setAnalyzingContenders(false);
            }
        };

        const CalculateLimits = () => {
            if (allDataLoaded) {
                // All data is loaded, you can use it here
                //console.log("Calculating contenders...")
                setAnalyzingContenders(true);
                setContenders([]);
                setTimeout(() => {
                    if (movePower && (moveType !== "null") && expectedCpm && baseAtk) {
                        const newContenders = PoGoAPI.CpmFinderV2(
                            movePower, // Move's power
                            moveType, // Move's type
                            weather, // Weather
                            expectedCpm, // Attacker's expected CPM
                            baseAtk, // Attacker's Base ATK. Not including IVs (Default 15)
                            stabBonus, // STAB bonus
                            types, // Type list, untouched
                            pokemonList, // Pokémon list, untouched
                            limit, // Limit of CPM range to check (default 0.00005)
                            limit, // Limit of CPM range to check (default 0.00005)
                            jump // Jump value for each iteration (default 0.00000001)
                        )
                        //console.log(newContenders);
                        if (newContenders && typeof newContenders === "object") {
                            setContenders([newContenders.minimumCPMcontender, newContenders.maximumCPMcontender, newContenders.minContenderList, newContenders.maxContenderList]);
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
            <h1 className="text-2xl font-bold flex flex-row items-center justify-center">CPM Finder PRO</h1>
            <div className="flex flex-row items-center justify-center p-4">
                <button className="bg-blue-500 text-white p-2 rounded " onClick={() => {setSwitchPokemon(!switchPokemon); setAnalyzingContenders(true)}}>{!switchPokemon ? "Switch to CPM Finder by Pokémon ID" : "Switch to CPM Finder by Attack Power"}</button>
            </div>
            {allDataLoaded ? (!switchPokemon ? (
                <div>
                    <p className="p-4">This tool helps you finding the upper and lower limits of a Pokémon's CPM based on one of its move data and a given expected CPM. This helps on obtaining a more precise range of CPM values of any Max Battle boss.</p>

                    <div className="flex flex-col flex-row items-center justify-center space-y-4">
                        <p>Move Power: <input type="number" className="text-red-600 font-black" placeholder="Move Power" onChange={(e) => setMovePower(Number(e.target.value))} value={movePower} /></p>
                        <p>Move Type: <select className="text-red-600 p-2" onChange={(e) => setMoveType(e.target.value)} value={moveType}>
                            <option className="text-red-600" value="null">Select Move Type</option>
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
                        <p>Expected CPM: <input type="number" className="text-red-600 font-black" placeholder="Expected CPM" onChange={(e) => setExpectedCpm(Number(e.target.value))} value={expectedCpm} /></p>
                        <p>Attacker' Base Attack: <input type="number" className="text-red-600 font-black" placeholder="Base ATK" onChange={(e) => setBaseAtk(Number(e.target.value))} value={baseAtk} /></p>
                        <p><input type="checkbox" onChange={(e) => setStabBonus(e.target.checked)} checked={stabBonus} /> STAB Bonus</p>
                        <p>Additive: <input type="number" className="text-red-600 font-black" placeholder="Jump" onChange={(e) => setJump(Number(e.target.value))} value={jump} /></p>
                        <p>Limit: <input type="number" className="text-red-600 font-black" placeholder="Limit" onChange={(e) => setLimit(Number(e.target.value))} value={limit} /></p>

                        <button onClick={CalculateLimits}>Calculate Limits</button>
                    </div>

                    {contenders.length > 0 ? (
                        <div>
                            <div>
                                <h2 className="p-4">Contenders</h2>
                                {contenders[0].pokemon != null && <p className="p-4">Minimum Contender: {contenders[0]?.pokemon.pokemonId}, level {contenders[0]?.level} with {contenders[0]?.defenseIV}IV defense ({contenders[0]?.cpm}CPM, expected damage of {contenders[0]?.expectedDamage})</p>}
                                {contenders[1].pokemon != null && <p className="p-4">Maximum Contender: {contenders[1]?.pokemon.pokemonId}, level {contenders[1]?.level} with {contenders[1]?.defenseIV}IV defense ({contenders[1]?.cpm}CPM, expected damage of {contenders[1]?.expectedDamage})</p>}
                            </div>
                            <div className="flex flex-row justify-between space-x-4 p-4 m-4">
                                <div>
                                <h2 className="p-4">All Minimum Contenders (sorted by CPM)</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pokemon</th>
                                            <th>Level</th>
                                            <th>DefIV</th>
                                            <th>CPM</th>
                                            <th>Expected Damage</th>
                                            <th>Real Damage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contenders[2].length > 0 ? contenders[2].map((contender: any, index: number) => (
                                            <tr key={index}>
                                                <td className="px-4 p-2">{contender.pokemon.pokemonId}</td>
                                                <td className="px-4 p-2">{contender.level}</td>
                                                <td className="px-4 p-2">{contender.defenseIV}IV</td>
                                                <td className="px-4 p-2">{contender.cpm} CPM</td>
                                                <td className="px-4 p-2">{(Number)(contender.expectedDamage)}</td>
                                                <td className="px-4 p-2">{contender.realDamage}</td>
                                            </tr>
                                        )) : <tr><td colSpan={5} className="p-2">No contenders found.</td></tr>}
                                    </tbody>
                                </table>
                                
                                </div>
                                <div>
                                    <h2 className="p-4">All Maximum Contenders (sorted by CPM)</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Pokemon</th>
                                                <th>Level</th>
                                                <th>DefIV</th>
                                                <th>CPM</th>
                                                <th>Expected Damage</th>
                                                <th>Real Damage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contenders[3].length > 0 ? contenders[3].map((contender: any, index: number) => (
                                                <tr key={index}>
                                                    <td className="px-4 p-2">{contender.pokemon.pokemonId}</td>
                                                    <td className="px-4 p-2">{contender.level}</td>
                                                    <td className="px-4 p-2">{contender.defenseIV}IV</td>
                                                    <td className="px-4 p-2">{contender.cpm} CPM</td>
                                                    <td className="px-4 p-2">{(Number)(contender.expectedDamage)}</td>
                                                    <td className="px-4 p-2">{contender.realDamage}</td>
                                                </tr>
                                            )) : <tr><td colSpan={5} className="p-2">No contenders found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>{analyzingContenders ? <p className="p-4">Select "Calculate Limits" to get the best contenders. (Make sure to fill all fields first!)</p> : <p className="p-4">Analyzing contenders...</p>}</>
                    )}
                </div>
            ) : (
                <div>
                    <p className="p-4">This tool helps you finding the upper and lower limits of a Pokémon's CPM based on one of its move data and a given expected CPM. This helps on obtaining a more precise range of CPM values of any Max Battle boss.</p>

                    <div className="flex flex-col flex-row items-center justify-center space-y-4">
                        <p>Pokémon ID: <input type="text" className="text-red-600 font-black" placeholder="CHARIZARD" onChange={(e) => setPokemonId(e.target.value)} value={pokemonId} /></p>

                        <p>Expected CPM: <input type="number" className="text-red-600 font-black" placeholder="Expected CPM" onChange={(e) => setExpectedCpm(Number(e.target.value))} value={expectedCpm} /></p>
                        <p>Additive: <input type="number" className="text-red-600 font-black" placeholder="Jump" onChange={(e) => setJump(Number(e.target.value))} value={jump} /></p>
                        <p>Limit: <input type="number" className="text-red-600 font-black" placeholder="Limit" onChange={(e) => setLimit(Number(e.target.value))} value={limit} /></p>

                        <button onClick={CalculateLimitsPokemon}>Calculate Limits</button>
                    </div>

                    {contendersPokemon.length > 0 ? (
                        <div className="p-4 m-4">
                            <div>
                                <h2 className="p-4">Contenders</h2>
                                {contendersPokemon[0].pokemon != null && <p className="p-4">Minimum Contender: {contendersPokemon[0]?.pokemon.pokemonId}, level {contendersPokemon[0]?.level} with {contendersPokemon[0]?.defenseIV}IV defense ({contendersPokemon[0]?.cpm}CPM, expected damage of {contendersPokemon[0]?.expectedDamage})</p>}
                                {contendersPokemon[1].pokemon != null && <p className="p-4">Maximum Contender: {contendersPokemon[1]?.pokemon.pokemonId}, level {contendersPokemon[1]?.level} with {contendersPokemon[1]?.defenseIV}IV defense ({contendersPokemon[1]?.cpm}CPM, expected damage of {contendersPokemon[1]?.expectedDamage})</p>}
                            </div>
                            <button className="bg-blue-500 text-white p-2 rounded flex flex-row " onClick={() => setShowMinContenders(!showMinContenders)}>{showMinContenders ? "Show Maximum contenders" : "Show Minimum contenders"}</button>
                            <div className="flex flex-row justify-between space-x-4 p-4 m-4">
                                {showMinContenders ? (
                                    <div>
                                    <h2 className="p-4">All Minimum Contenders (sorted by CPM)</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Move</th>
                                                <th>WB</th>
                                                <th>Type</th>
                                                <th>Pokemon</th>
                                                <th>Level</th>
                                                <th>DefIV</th>
                                                <th>CPM</th>
                                                <th>Expected Damage</th>
                                                <th>Real Damage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contendersPokemon[2].length > 0 ? contendersPokemon[2].map((contender: any, index: number) => (
                                                <tr key={index}>
                                                    <td className="px-4 p-2">{contender.moveId}</td>
                                                    <td className="px-4 p-2">{contender.weatherBoost == 1 ? "No": "Yes"}</td>
                                                    <td className="px-4 p-2">{contender.spread == 1 ? "Spread" : "Target"}</td>
                                                    <td className="px-4 p-2">{contender.pokemon.pokemonId}</td>
                                                    <td className="px-4 p-2">{contender.level}</td>
                                                    <td className="px-4 p-2">{contender.defenseIV}IV</td>
                                                    <td className="px-4 p-2">{contender.cpm} CPM</td>
                                                    <td className="px-4 p-2">{(Number)(contender.expectedDamage)}</td>
                                                    <td className="px-4 p-2">{contender.realDamage}</td>
                                                </tr>
                                            )) : <tr><td colSpan={5} className="p-2">No contenders found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                                ) : (
                                    <div>
                                    <h2 className="p-4">All Maximum Contenders (sorted by CPM)</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Move</th>
                                                <th>WB</th>
                                                <th>Type</th>
                                                <th>Pokemon</th>
                                                <th>Level</th>
                                                <th>DefIV</th>
                                                <th>CPM</th>
                                                <th>Expected Damage</th>
                                                <th>Real Damage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contendersPokemon[3].length > 0 ? contendersPokemon[3].map((contender: any, index: number) => (
                                                <tr key={index}>
                                                    <td className="px-4 p-2">{contender.moveId}</td>
                                                    <td className="px-4 p-2">{contender.weatherBoost == 1 ? "No": "Yes"}</td>
                                                    <td className="px-4 p-2">{contender.spread == 1 ? "Spread" : "Target"}</td>
                                                    <td className="px-4 p-2">{contender.pokemon.pokemonId}</td>
                                                    <td className="px-4 p-2">{contender.level}</td>
                                                    <td className="px-4 p-2">{contender.defenseIV}IV</td>
                                                    <td className="px-4 p-2">{contender.cpm} CPM</td>
                                                    <td className="px-4 p-2">{(Number)(contender.expectedDamage)}</td>
                                                    <td className="px-4 p-2">{contender.realDamage}</td>
                                                </tr>
                                            )) : <tr><td colSpan={5} className="p-2">No contenders found.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                                )}
                                
                            </div>
                        </div>
                    ) : (
                        <>{analyzingContenders ? <p className="p-4">Select "Calculate Limits" to get the best contenders. (Make sure to fill all fields first!)</p> : <p className="p-4">Analyzing contenders...</p>}</>
                    )}
                </div>
            )) : (<p>Loading all data from PokeBattler API...</p>)}
        </>
    )
}