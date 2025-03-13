"use client"

import React, { use, useEffect, useState } from 'react';
import { PoGoAPI } from '../../../lib/PoGoAPI';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import CookieBanner from '@/components/cookie-banner';



const BreakpointsPage = () => {
    const [attackingPokemon, setAttackingPokemon] = useState<any>(null);
    const [defendingPokemon, setDefendingPokemon] = useState<any>(null);
    const [selectedQuickMoveAttacker, setSelectedQuickMoveAttacker] = useState<any | null>(null);
    const [selectedChargedMoveAttacker, setSelectedChargedMoveAttacker] = useState<any | null>(null);
    const [selectedMaxMoveAttacker, setSelectedMaxMoveAttacker] = useState<any | null>(null);
    const [raidMode, setRaidMode] = useState<any>("normal");
    const [bonusAttacker, setBonusAttacker] = useState<any[]>(["EXTREME", false, false, 0]);
    const [bonusDefender, setBonusDefender] = useState<any[]>(["EXTREME", false, false, 0]);
    const [pokemonList, setAllPokemonPB] = useState<any>(null);
    const [allMoves, setAllMoves] = useState<any>(null);
    const [allEnglishText, setAllEnglishText] = useState<any>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
    const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);
    const [weather, setWeather] = useState<any>("EXTREME");
    const [types, setTypes] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [allBreakpoints, setAllBreakpoints] = useState<any>(null);
    const [allBreakpointsCinematic, setAllBreakpointsCinematic] = useState<any>(null);
    const [allBreakpointsMax, setAllBreakpointsMax] = useState<any>(null);
    const [calculatedBreakpoints, setCalculatedBreakpoints] = useState<any>(null);
    const [calculatedBreakpointsCinematic, setCalculatedBreakpointsCinematic] = useState<any>(null);
    const [calculatedBreakpointsMax, setCalculatedBreakpointsMax] = useState<any>(null);
    const [min, setMin] = useState<any>(null);
    const [max, setMax] = useState<any>(null);
    const [minCinematic, setMinCinematic] = useState<any>(null);
    const [maxCinematic, setMaxCinematic] = useState<any>(null);
    const [minMax, setMinMax] = useState<any>(null);
    const [maxMax, setMaxMax] = useState<any>(null);
    const [defenderStatsLoad, setDefenderStatsLoad] = useState<any>(null);
    const [attackerMaxMove, setAttackerMaxMove] = useState<any>(null);
      useEffect(() => {
        const fetchAllPokemonPB = async () => {
          const pokemonlist = await PoGoAPI.getAllPokemonPB();
          setAllPokemonPB(pokemonlist);
          //console.log("Fetched all Pokémon from PokeBattler API");
    
          const moves = await PoGoAPI.getAllMovesPB();
          setAllMoves(moves);
          //console.log("Fetched all moves from PokeBattler API");
    
          const text = await PoGoAPI.getAllEnglishNamesPB();
          setAllEnglishText(text);
          //console.log(text);
          //console.log("Fetched all English text from PokeBattler API");
          
          const types = await PoGoAPI.getTypes();
          setTypes(types);
          
          setAllDataLoaded(true);
        };
        fetchAllPokemonPB();
        
      }, []);

      useEffect (() => {
        if (allDataLoaded) {
            const urlParams = new URLSearchParams(window.location.search);
            const member = parseInt(urlParams.get('member') ?? '1');
            const slot = parseInt(urlParams.get('slot') ?? '1');
            const attacker = urlParams.get('attacker'+member+""+slot);
            const defender = urlParams.get('defender');
            const attackerFastAttack = urlParams.get('attacker_fast_attack'+member+""+slot);
            const attackerCinematicAttack = urlParams.get('attacker_cinematic_attack'+member+""+slot);
            const attackerMaxMove = urlParams.get('attacker_max_moves'+member+""+slot) || '1,0,0';
            const raidmode = urlParams.get('raid_mode') || 'normal';
            const weather = urlParams.get('weather') || 'EXTREME';
            const defenderStats = urlParams.get('defender_stats') || '50,15,15,15';


            if (attacker) {setAttackingPokemon(PoGoAPI.getPokemonPBByID(attacker, pokemonList)[0])} ;
            if (defender) {setDefendingPokemon(PoGoAPI.getPokemonPBByID(defender, pokemonList)[0])};
            const attackerMM = attackerMaxMove.split(',').map((move: string) => parseInt(move));
            setAttackerMaxMove(attackerMM);
            if (attackerFastAttack) {
              const fastAttack = PoGoAPI.getMovePBByID(attackerFastAttack, allMoves)
              setSelectedQuickMoveAttacker(fastAttack)
              const maxAttack = PoGoAPI.getDynamaxAttack(attacker, fastAttack.type, allMoves, attackerMM[0]);
              setSelectedMaxMoveAttacker(maxAttack)
            };
            if (attackerCinematicAttack) {setSelectedChargedMoveAttacker(PoGoAPI.getMovePBByID(attackerCinematicAttack, allMoves))};
            setRaidMode(raidmode);
            setWeather(weather);
            setDefenderStatsLoad(defenderStats.split(',').map((stat: string) => parseInt(stat)));
            
            if (!attacker || !defender || !attackerFastAttack || !attackerCinematicAttack) {
                setError("Missing parameters");
            }
            else {
                setParamsLoaded(true);
            }

            const urlSP = new URLSearchParams(window.location.search);
            urlSP.delete('member');
            urlSP.delete('slot');
            window.history.replaceState({}, '', `${window.location.pathname}?${urlSP}`);
            
            
        }
      }, [allDataLoaded]);

      useEffect(() => {
        if (paramsLoaded) {
            
            const breakpoints = calculateBreakpoints(selectedQuickMoveAttacker);
            const breakpointsCinematic = calculateBreakpoints(selectedChargedMoveAttacker);
            const breakpointsMax = calculateBreakpoints(selectedMaxMoveAttacker);
            setAllBreakpoints(breakpoints);
            setCalculatedBreakpoints(true);
            setAllBreakpointsCinematic(breakpointsCinematic);
            setCalculatedBreakpointsCinematic(true);
            setAllBreakpointsMax(breakpointsMax);
            setCalculatedBreakpointsMax(true);
            
            const { min, max } = getMinMax(breakpoints);
            setMin(min);
            setMax(max);

            const { min: minCinematic, max: maxCinematic } = getMinMax(breakpointsCinematic);
            setMinCinematic(minCinematic);
            setMaxCinematic(maxCinematic);

            const { min: minMax, max: maxMax } = getMinMax(breakpointsMax);
            setMinMax(minMax);
            setMaxMax(maxMax);
        }
      }, [paramsLoaded]);

      const calculateBreakpoints = (move: any) => {
        const rows = 32*2 - 1; // Example value for rows
        const cols = 16; // Example value for cols
        const table: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
        const attackerBonus = [weather, bonusAttacker[1] === "true", bonusAttacker[2] === "true", parseInt(bonusAttacker[3])];
        const defenderBonus = [weather, bonusDefender[1] === "true", bonusDefender[2] === "true", parseInt(bonusDefender[3])];
        //console.log(attackerBonus);
        // Breakpoints will be calculated from level 20 to level 50
        for (let i = 20; i <= 51; i+=0.5) {
            // Attacker attack stat will go from 0 to 15
            for (let j = 0; j <= 15; j++) {
                const attackerStats = [i, j, 15, 15];
                const defenderStats = defenderStatsLoad;
                const damage = PoGoAPI.getDamage(attackingPokemon, defendingPokemon, move, types, attackerStats, defenderStats, attackerBonus, defenderBonus, raidMode);
                //console.log("Damage: " + damage + " at level " + i + " with " + j + " attack");
                table[2*(i-20)][j] = damage;

            }
        }
        return table;
    }

    const getColor = (value: number, min: number, max: number) => {
        const ratio = (value - min) / (max - min);
        const colorValue = Math.floor(255 - ratio * 255);
        return `rgb(${0}, ${0.6*(255-colorValue)}, ${0})`;
      };
    
      const getMinMax = (data: number[][]) => {
        let min = Infinity;
        let max = -Infinity;
        //console.log(data);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] < min) {
                    min = data[i][j];
                }
                if (data[i][j] > max) {
                    max = data[i][j];
                }
            }
        }
        return { min, max };
      };

      const prettierRaidMode = (raidMode: string) => {
        if (raidMode === "raid-t1-dmax") {
          return "Tier 1 Dynamax Raid";
        } else if (raidMode === "raid-t2-dmax") {
          return "Tier 2 Dynamax Raid";
        } else if (raidMode === "raid-t3-dmax") {
          return "Tier 3 Dynamax Raid";
        } else if (raidMode === "raid-t4-dmax") {
          return "Tier 4 Dynamax Raid";
        } else if (raidMode === "raid-t5-dmax") {
          return "Tier 5 Dynamax Raid";
        } else if (raidMode === "raid-t6-gmax") {
          return "Gigantamax Raid";
        } else {
          return "Gym Battle";
        }
      }
      const copyURL = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert("URL copied to clipboard!");
      }

      const downloadAsPNG = () => {
        const element = document.getElementById('breakpoints-container');
        if (element) {
          element.style.height = 'auto';
          element.style.width = '100%';
          element.style.overflow = 'visible';
          const scale = window.devicePixelRatio || 2;

          html2canvas(element, {backgroundColor: null, scale: scale}).then(canvas => {
            const link = document.createElement('a');
            link.download = 'breakpoints.png';
            link.href = canvas.toDataURL();
            link.click();
          });
        }
      }

    return (
        <>
        {paramsLoaded && allDataLoaded && !error && calculatedBreakpoints ? (
            <div className="flex flex-col flex-row justify-center space-y-4 py-4 bg-black">
                <Card className="py-4 my-4 mx-auto shadow-md bg-white rounded-lg text-center p-4 md:p-8 md:mt-8">
                    <CardHeader>
                        <CardTitle>Breakpoints</CardTitle>
                        <CardDescription>
                            Breakpoints for {PoGoAPI.getPokemonNamePB(attackingPokemon.pokemonId, allEnglishText)} with {PoGoAPI.getMoveNamePB(selectedQuickMoveAttacker.moveId, allEnglishText)}, {PoGoAPI.getMoveNamePB(selectedChargedMoveAttacker.moveId, allEnglishText)} and {PoGoAPI.formatMoveName(selectedMaxMoveAttacker.moveId)} Lv.{attackerMaxMove[0]} against {prettierRaidMode(raidMode)} Boss {PoGoAPI.getPokemonNamePB(defendingPokemon.pokemonId, allEnglishText)} {raidMode === "normal" ? ("(Level " + defenderStatsLoad[0] + " " + defenderStatsLoad[1] + "-" + defenderStatsLoad[2] + "-" + defenderStatsLoad[3] + ")") : ""}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row justify-center space-x-4">
                            <a href={`/dynamax${window.location.search}`} className="w-full py-2 text-white bg-primary rounded-lg mt-4 mb-4">
                                <button className="w-full h-full">
                                    Go Back
                                </button>
                            </a>
                            <button className='w-full py-2 text-white bg-primary rounded-lg mt-4 mb-4' onClick={copyURL}>
                                Copy URL
                            </button>
                            <button className='w-full py-2 text-white bg-primary rounded-lg mt-4 mb-4' onClick={/*downloadAsPNG*/() => alert("This feature is currently unavailable.")}>
                                Download as a PNG (Currently unavailable)
                            </button>
                        </div>
                    
                    </CardContent>
                </Card>
                <div id="breakpoints-container" className="flex flex-col justify-center space-y-4">
                  <h2>Breakpoints for {PoGoAPI.getMoveNamePB(selectedQuickMoveAttacker.moveId, allEnglishText)}</h2>
                <table  >
                    <thead>
                    <tr>
                        <th>IVs/Level</th>
                        {allBreakpoints.map((_: any, index: any) => (
                        <th className="text-xs" key={index } style={{ padding: '0 3px' }}>{(index / 2) + 20}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {allBreakpoints[0]?.map((iv: any, ivIndex: any) => (
                        <tr key={ivIndex}>
                        <td>{ivIndex} IVs</td>
                        {allBreakpoints.map((level: any, levelIndex: any) => (
                            <td key={levelIndex} style={{ 
                                textAlign: 'center',
                                backgroundColor: getColor(level[ivIndex], min, max), 
                                borderBottom: (level[ivIndex] !== level[ivIndex + 1] ? '1px solid #000' : 'none'),
                                borderRight: levelIndex < allBreakpoints.length - 1 && allBreakpoints[levelIndex][ivIndex] !== allBreakpoints[levelIndex + 1][ivIndex] ? '1px solid #000' : 'none'
                                }}>
                            {level[ivIndex]}
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h2>Breakpoints for {PoGoAPI.getMoveNamePB(selectedChargedMoveAttacker.moveId, allEnglishText)}</h2>
                <table>
                    <thead>
                    <tr>
                        <th>IVs/Level</th>
                        {allBreakpointsCinematic.map((_: any, index: any) => (
                        <th className="text-xs" key={index} style={{ padding: '0 5px' }}> {(index / 2) + 20}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {allBreakpointsCinematic[0]?.map((_: any, ivIndex: any) => (
                        <tr key={ivIndex}>
                        <td>{ivIndex} IVs</td>
                        {allBreakpointsCinematic.map((level: any, levelIndex: any) => (
                            <td key={levelIndex} style={{ 
                                textAlign: 'center',
                                backgroundColor: getColor(level[ivIndex], minCinematic, maxCinematic), 
                                borderBottom: (level[ivIndex] !== level[ivIndex + 1] ? '1px solid #000' : 'none'),
                                borderRight: levelIndex < allBreakpointsCinematic.length - 1 && allBreakpointsCinematic[levelIndex][ivIndex] !== allBreakpointsCinematic[levelIndex + 1][ivIndex] ? '1px solid #000' : 'none'
                                }}>
                            {level[ivIndex]}
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h2>Breakpoints for {PoGoAPI.formatMoveName(selectedMaxMoveAttacker.moveId)}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>IVs/Level</th>
                      {allBreakpointsMax.map((_: any, index: any) => (
                        <th className="text-xs" key={index} style={{ padding: '0 5px' }}> {(index / 2) + 20}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allBreakpointsMax[0]?.map((_: any, ivIndex: any) => (
                      <tr key={ivIndex}>
                        <td>{ivIndex} IVs</td>
                        {allBreakpointsMax.map((level: any, levelIndex: any) => (
                          <td key={levelIndex} style={{ 
                            textAlign: 'center',
                            backgroundColor: getColor(level[ivIndex], minMax, maxMax), 
                            borderBottom: (level[ivIndex] !== level[ivIndex + 1] ? '1px solid #000' : 'none'),
                            borderRight: levelIndex < allBreakpointsMax.length - 1 && allBreakpointsMax[levelIndex][ivIndex] !== allBreakpointsMax[levelIndex + 1][ivIndex] ? '1px solid #000' : 'none'
                            }}>
                            {level[ivIndex]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>  
            </div>

        ) : (
            error ? <p>{error}
            <a href={`/dynamax${window.location.search}`} className="w-full py-2 text-white bg-primary rounded-lg mt-4 mb-4">
                                <button className="w-full">
                                    Go Back
                                </button>
                            </a>
                            </p> : <p>Loading...</p>
        )}
        
        <CookieBanner />
        </>
    );
};

export default BreakpointsPage;