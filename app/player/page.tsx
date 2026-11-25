"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RaidStatus } from "@/components/RaidStatus";
import { PoGoAPI } from "../../lib/PoGoAPI";
import { ClickSparkWithProps } from "@/components/calculate-button-turn-based-click-spark";

type PlayerConfig = {
  attackers: any[];
  defender: any;
  quickMoves: any[];
  chargedMoves: any[];
  secondChargedMoves: any[];
  defenderQuickMove: any;
  defenderChargedMove: any;
  attackerStats: number[][];
  defenderStats: number[];
  attackerBonuses: any[][];
  defenderBonuses: any[];
  raidMode: string;
  weather: string;
  advEffect: string;
  relobbyTime: number;
  energyResolveBug: boolean;
  types: any;
  allMoves: any;
  allEnglishText: any;
  imageLinks: any;
};

const cloneRaidStatus = (status: RaidStatus): RaidStatus => {
  const data = Object.fromEntries(
    Object.entries(status).filter(([, value]) => typeof value !== "function")
  );

  return Object.assign(
    Object.create(Object.getPrototypeOf(status)),
    structuredClone(data),
  ) as RaidStatus;
};

const runPlayerSimulationAction = (
  config: PlayerConfig,
  action: string,
  status: RaidStatus,
) =>
  PoGoAPI.RealTimeSimulatorAllyTurnRaid(
    config.attackers,
    config.defender,
    config.quickMoves,
    config.chargedMoves,
    config.secondChargedMoves,
    config.defenderQuickMove,
    config.defenderChargedMove,
    config.attackerStats,
    config.attackerBonuses,
    config.defenderBonuses,
    config.raidMode,
    config.weather,
    config.advEffect,
    action,
    cloneRaidStatus(status),
    config.types,
    config.allMoves,
    config.relobbyTime,
    config.energyResolveBug,
  );

export default function PlayerPage() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<PlayerConfig | null>(null);
  const [gameStatus, setGameStatus] = useState<RaidStatus | null>(null);
  const [running, setRunning] = useState(false);
  const [hasStartedRaid, setHasStartedRaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadConfig = async () => {
      try {
        const pokemonList = await PoGoAPI.getAllPokemonPB();
        const allMoves = await PoGoAPI.getAllMovesPB();
        const allEnglishText = await PoGoAPI.getAllEnglishNamesPB();
        const types = await PoGoAPI.getTypes();
        const imageLinks = await PoGoAPI.getAllPokemonImagesPB();

        PoGoAPI.customMoveFixer(pokemonList, allMoves);

        const numPokemon = Math.max(1, parseInt(searchParams.get("num_pokemon") ?? "1"));
        const raidMode = searchParams.get("raid_mode");
        const defenderId = searchParams.get("defender");
        const defenderQuickMoveId = searchParams.get("defender_fast_attack");
        const defenderChargedMoveId = searchParams.get("defender_cinematic_attack");

        if (!raidMode || raidMode === "normal" || !defenderId || !defenderQuickMoveId || !defenderChargedMoveId) {
          throw new Error("Missing required raid configuration.");
        }

        const attackers: any[] = [];
        const quickMoves: any[] = [];
        const chargedMoves: any[] = [];
        const secondChargedMoves: any[] = [];
        const attackerStats: number[][] = [];
        const attackerBonuses: any[][] = [];

        for (let i = 1; i <= numPokemon; i++) {
          const attackerId = searchParams.get(`attacker${i}`);
          const quickMoveId = searchParams.get(`attacker_fast_attack${i}`);
          const chargedMoveId = searchParams.get(`attacker_cinematic_attack${i}`);
          const secondChargedMoveId = searchParams.get(`attacker_cinematic_attack${i}_2`);
          const statsParam = searchParams.get(`attacker_stats${i}`);
          const bonusParam = searchParams.get(`attacker_bonuses${i}`);

          if (!attackerId || !quickMoveId || !chargedMoveId) {
            throw new Error(`Missing Pokémon or moves for slot ${i}.`);
          }

          const attacker = PoGoAPI.getPokemonPBByID(attackerId, pokemonList)[0];
          if (!attacker) throw new Error(`Unknown attacker Pokémon: ${attackerId}`);

          const quickMove = PoGoAPI.getMovePBByID(quickMoveId, allMoves);
          const chargedMove = PoGoAPI.getMovePBByID(chargedMoveId, allMoves);
          const secondChargedMove = secondChargedMoveId
            ? PoGoAPI.getMovePBByID(secondChargedMoveId, allMoves)
            : null;

          if (!quickMove || !chargedMove) throw new Error(`Missing move data for slot ${i}.`);

          quickMoves.push(quickMove);
          chargedMoves.push(chargedMove);
          secondChargedMoves.push(secondChargedMove);
          attackers.push(attacker);
          attackerStats.push(
            statsParam ? statsParam.split(",").map((value) => parseFloat(value)) : [50, 15, 15, 15]
          );

          const bonus = bonusParam
            ? bonusParam.split(",")
            : [searchParams.get("weather") ?? "EXTREME", "false", "false", "0"];
          attackerBonuses.push([
            bonus[0] || searchParams.get("weather") || "EXTREME",
            bonus[1] === "true",
            bonus[2] === "true",
            parseFloat(bonus[3] ?? "0"),
          ]);
        }

        const defender = PoGoAPI.getPokemonPBByID(defenderId, pokemonList)[0];
        const defenderQuickMove = PoGoAPI.getMovePBByID(defenderQuickMoveId, allMoves);
        const defenderChargedMove = PoGoAPI.getMovePBByID(defenderChargedMoveId, allMoves);

        if (!defender || !defenderQuickMove || !defenderChargedMove) {
          throw new Error("Missing defender Pokémon or moves.");
        }

        const defenderStatsParam = searchParams.get("defender_stats") ?? "50,15,15,15";
        const defenderStats = defenderStatsParam.split(",").map((value) => parseFloat(value));
        const defenderBonusParam = searchParams.get("defender_bonuses") ?? "EXTREME,false,false,0";
        const defenderBonus = defenderBonusParam.split(",");
        const weather = searchParams.get("weather") ?? attackerBonuses[0][0];

        if (cancelled) return;

        setConfig({
          attackers,
          defender,
          quickMoves,
          chargedMoves,
          secondChargedMoves,
          defenderQuickMove,
          defenderChargedMove,
          attackerStats,
          defenderStats,
          attackerBonuses,
          defenderBonuses: [
            weather,
            defenderBonus[1] === "true",
            defenderBonus[2] === "true",
            parseFloat(defenderBonus[3] ?? "0"),
          ],
          raidMode,
          weather,
          advEffect: searchParams.get("adv_effect") ?? "none",
          relobbyTime: parseInt(searchParams.get("relobby_time") ?? "8"),
          energyResolveBug: searchParams.get("energy_resolve_bug") === "true",
          types,
          allMoves,
          allEnglishText,
          imageLinks,
        });
        setError(null);
      } catch (loadError) {
        if (cancelled) return;
        setConfig(null);
        setError(loadError instanceof Error ? loadError.message : "Could not load the player configuration.");
      }
    };

    loadConfig();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    const updateDarkMode = () => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    };

    updateDarkMode();
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const createInitialSimulation = (currentConfig: PlayerConfig) =>
    PoGoAPI.RealTimeSimulatorAllyTurnRaid(
      currentConfig.attackers,
      currentConfig.defender,
      currentConfig.quickMoves,
      currentConfig.chargedMoves,
      currentConfig.secondChargedMoves,
      currentConfig.defenderQuickMove,
      currentConfig.defenderChargedMove,
      currentConfig.attackerStats,
      currentConfig.attackerBonuses,
      currentConfig.defenderBonuses,
      currentConfig.raidMode,
      currentConfig.weather,
      currentConfig.advEffect,
      "init",
      null,
      currentConfig.types,
      currentConfig.allMoves,
      currentConfig.relobbyTime,
      currentConfig.energyResolveBug,
    );

  useEffect(() => {
    if (!config) return;
    setGameStatus(createInitialSimulation(config));
    setRunning(false);
    setHasStartedRaid(false);
  }, [config]);

  const initializeSimulation = () => {
    if (!config) return;
    const status = createInitialSimulation(config);
    setGameStatus(status);
    setHasStartedRaid(true);
    setRunning(true);
  };

  useEffect(() => {
    if (!running || !config || !gameStatus) return;

    const interval = window.setInterval(() => {
      setGameStatus((current) => {
        if (!current || !config) return current;
        const tickResult = runPlayerSimulationAction(config, "tick", current);
        const next = tickResult.isRelobby === 2 &&
          !tickResult.timeout &&
          tickResult.enemyPokemonDamage < tickResult.enemyPokemonMaxHealth
          ? runPlayerSimulationAction(config, "relobby", tickResult)
          : tickResult;

        if (
          next.timeout ||
          next.enemyPokemonDamage >= next.enemyPokemonMaxHealth
        ) {
          setRunning(false);
        }

        return next;
      });
    }, 500);

    return () => window.clearInterval(interval);
  }, [running, config]);

  const sendAction = (action: string) => {
    if (!running || !config || !gameStatus) return;
    if (action !== "relobby" && gameStatus.isRelobby !== 0) return;
    if (action !== "relobby" && gameStatus.allyCooldown > 0) return;

    const realTimeAction =
      action === "fast" ? "rt-fast" :
      action === "charged" ? "rt-charged" :
      action === "charged2" ? "rt-charged2" :
      action === "dodge" ? "rt-dodge" :
      action;

    setGameStatus((current) => {
      if (!current) return current;
      if (action !== "relobby" && current.isRelobby !== 0) return current;
      if (action !== "relobby" && current.allyCooldown > 0) return current;
      if (
        action !== "relobby" &&
        !action.startsWith("switch") &&
        current.allyPokemonDamage[current.activeAllyIndex] >= current.allyPokemonMaxHealth[current.activeAllyIndex]
      ) {
        return current;
      }

      return runPlayerSimulationAction(config, realTimeAction, current);
    });
  };

  const getHealthColor = (percent: number) => {
    if (percent >= 50) return "bg-green-500";
    if (percent >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };
  const getMoveTypeClass = (move: any) =>
    `type-${String(move?.type ?? "normal").replace("POKEMON_TYPE_", "").toLowerCase()}`;
  const getMoveName = (move: any) =>
    move?.moveId ? PoGoAPI.formatMoveName(move.moveId) : "Move";
  const getMoveAnimationDuration = (move: any) => {
    const durationMs = Number(move?.durationMs);
    const normalizedDurationMs = Number.isFinite(durationMs) && durationMs > 0
      ? Math.ceil(durationMs / 500) * 500
      : 1000;

    return `${normalizedDurationMs / 2}ms`;
  };

  const activeIndex = gameStatus?.activeAllyIndex ?? 0;
  const allySprite = useMemo(
    () => config && PoGoAPI.getPokemonImageByID(config.attackers[activeIndex].pokemonId, config.imageLinks),
    [config, activeIndex],
  );
  const enemySprite = useMemo(
    () => config && PoGoAPI.getPokemonImageByID(config.defender.pokemonId, config.imageLinks),
    [config],
  );
  const allySpriteMovement = gameStatus?.allyCurrentMessage?.damage
    ? "translate-x-8 scale-110"
    : gameStatus?.allyActiveMove
      ? "raid-ally-attacking"
      : "translate-x-0 scale-100";
  const enemySpriteMovement = gameStatus?.enemyCurrentMessage?.damage
    ? "-translate-x-8 scale-110"
    : gameStatus?.enemyActiveMove && !gameStatus.enemyPrepPhase
      ? "raid-enemy-attacking"
      : "translate-x-0 scale-100";
  const raidRemaining = config && gameStatus
    ? Math.max(0, PoGoAPI.getRaidTime(config.raidMode) - gameStatus.timer)
    : 0;
  const handlePagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePagePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      sendAction("dodge");
      return;
    }

    const target = event.target as HTMLElement;
    const blockedButton = target.closest("button") as HTMLButtonElement | null;
    if (blockedButton?.disabled) {
      if (gameStatus?.allyCooldown === 0) sendAction("fast");
      return;
    }

    if (target.closest("button, a, input, select, textarea, [data-no-fast]")) return;
    if (!gameStatus || gameStatus.allyCooldown > 0) return;
    sendAction("fast");
  };

  return (
    <>
      <Navbar />
      <ClickSparkWithProps
        sparkColor={darkMode ? "#fff" : "#000"}
        shape="dot"
        sparkCount={1000}
        sparkSize={18}
        sparkRadius={40}
        duration={500}
        randomness={0}
        disabled={false}
      >
      <div
        className="container mx-auto max-w-3xl px-4 pb-10"
        onPointerDown={handlePagePointerDown}
        onPointerDownCapture={(event) => {
          const target = event.target as HTMLElement;
          const blockedButton = target.closest("button") as HTMLButtonElement | null;
          if (
            blockedButton?.disabled &&
            !blockedButton.hasAttribute("data-no-fast") &&
            gameStatus?.allyCooldown === 0
          ) {
            sendAction("fast");
          }
        }}
        onPointerUp={handlePagePointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        
        <Card className="relative mt-4">
          <CardHeader>
            <CardTitle>Real-Time Raid Player (BETA)</CardTitle>
            <CardDescription>
              Play the configured raid using the same turn-based battle engine, but with real-time interaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            To start the raid, click the "Start Raid" button below. It is highly recommended to play on mobile devices. Clicking anywhere in the main card will default to use a Fast Attack.
          </CardContent>
          <CardContent>
            Additional configurations:
            <p>Relobby Time: {config?.relobbyTime || 0}s</p>
            <p>Weather: {config?.weather || "None"}</p>
            <p>Adventure Effect: {config?.advEffect || "None"}</p>
            <button
            className="w-full py-2 text-white bg-primary rounded-lg mt-4 "
            onClick={() => {
              window.location.href = "/" + window.location.search;
            }}>
              Back to PokéChespin for Raids
            </button>
          </CardContent>
          
        </Card>
        <Card className="relative mt-4">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              {gameStatus && hasStartedRaid && (
                <Button
                  variant="outline"
                  size="sm"
                  data-no-fast
                  onClick={() => {
                    setRunning(false);
                    initializeSimulation();
                  }}
                >
                  Restart
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="rounded-lg border border-red-300 p-4 text-red-600">
                {error}
              </div>
            )}

            {!config && !error && <p>Loading raid configuration...</p>}

            {config && gameStatus && (
              <>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <Button
                    variant="outline"
                    className="min-w-24"
                    data-no-fast
                    onClick={() => sendAction("relobby")}
                    disabled={
                      !running ||
                      gameStatus.timer < 1 ||
                      gameStatus.simulationLog.length === 0
                    }
                  >
                    Relobby
                  </Button>
                  <strong className="text-lg">{raidRemaining}s</strong>
                </div>

                <Separator className="my-2" />
                <p className="text-sm">{gameStatus.globalCurrentMessage?.message}</p>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <img
                      src={"https://static.pokebattler.com/assets/pokemon/128/" + allySprite}
                      alt=""
                      className={"absolute right-1/4 top-1/3 h-20 w-20 -translate-y-1/2 object-contain opacity-40 transition-transform duration-300 ease-out " + allySpriteMovement}
                      style={gameStatus.allyActiveMove ? { animationDuration: getMoveAnimationDuration(gameStatus.allyActiveMove.move) } : undefined}
                    />
                    <img
                      src={"https://static.pokebattler.com/assets/pokemon/128/" + enemySprite}
                      alt=""
                      className={"absolute right-1 top-1/3 h-20 w-20 -translate-y-1/2 object-contain opacity-40 transition-transform duration-300 ease-out " + enemySpriteMovement}
                      style={gameStatus.enemyActiveMove && !gameStatus.enemyPrepPhase ? { animationDuration: getMoveAnimationDuration(gameStatus.enemyActiveMove.move) } : undefined}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{PoGoAPI.getPokemonNamePB(config.defender.pokemonId, config.allEnglishText)}</span>
                        <span>
                          {Math.max(0, gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage)} / {gameStatus.enemyPokemonMaxHealth} HP
                        </span>
                      </div>
                      <Progress
                        value={Math.max(0, ((gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage) / gameStatus.enemyPokemonMaxHealth) * 100)}
                        color={getHealthColor(((gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage) / gameStatus.enemyPokemonMaxHealth) * 100)}
                      />
                      <p className="mt-2 min-h-8 text-xs text-red-600">
                        {gameStatus.enemyCurrentMessage?.message}
                      </p>
                    </div>

                    <Separator className="my-3" />

                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{PoGoAPI.getPokemonNamePB(config.attackers[activeIndex].pokemonId, config.allEnglishText)}</span>
                        <span>
                          {Math.max(0, gameStatus.allyPokemonMaxHealth[activeIndex] - gameStatus.allyPokemonDamage[activeIndex])} / {gameStatus.allyPokemonMaxHealth[activeIndex]} HP
                        </span>
                      </div>
                      <Progress
                        value={Math.max(0, ((gameStatus.allyPokemonMaxHealth[activeIndex] - gameStatus.allyPokemonDamage[activeIndex]) / gameStatus.allyPokemonMaxHealth[activeIndex]) * 100)}
                        color={getHealthColor(((gameStatus.allyPokemonMaxHealth[activeIndex] - gameStatus.allyPokemonDamage[activeIndex]) / gameStatus.allyPokemonMaxHealth[activeIndex]) * 100)}
                      />
                      <div className="mt-1">
                        <Progress
                          value={Math.max(0, Math.min(100, gameStatus.allyEnergy[activeIndex]))}
                          color="bg-blue-500"
                          className="h-2"
                        />
                      </div>
                      <p className="mt-2 min-h-8 text-xs">
                        {gameStatus.allyCurrentMessage?.message}
                      </p>
                      <p className="text-xs">Energy: {gameStatus.allyEnergy[activeIndex]}/100</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-border bg-muted/30 p-2">
                  <div className="grid grid-cols-2 gap-2" data-no-fast>
                    <Button
                      className={"h-14 text-sm text-white disabled:pointer-events-auto " + getMoveTypeClass(config.quickMoves[activeIndex])}
                      disabled={!running || gameStatus.allyCooldown > 0}
                      onClick={() => sendAction("fast")}
                    >
                      {getMoveName(config.quickMoves[activeIndex])}
                    </Button>
                    <Button
                      className="h-14 text-sm disabled:pointer-events-auto"
                      disabled={!running || gameStatus.allyCooldown > 0}
                      onClick={() => sendAction("dodge")}
                    >
                      Dodge
                    </Button>
                  </div>
                  <div
                    className="mt-2 grid gap-2"
                    style={{
                      gridTemplateColumns: config.secondChargedMoves[activeIndex]
                        ? "repeat(2, minmax(0, 1fr))"
                        : "minmax(0, 1fr)",
                    }}
                    data-no-fast
                  >
                    <Button
                      className={"h-14 text-sm text-white disabled:pointer-events-auto " + getMoveTypeClass(config.chargedMoves[activeIndex])}
                      disabled={
                        !running ||
                        gameStatus.allyCooldown > 0 ||
                        gameStatus.allyEnergy[activeIndex] < -config.chargedMoves[activeIndex].energyDelta
                      }
                      onClick={() => sendAction("charged")}
                    >
                      {getMoveName(config.chargedMoves[activeIndex])}
                    </Button>
                    {config.secondChargedMoves[activeIndex] ? (
                      <Button
                        className={"h-14 text-sm text-white disabled:pointer-events-auto " + getMoveTypeClass(config.secondChargedMoves[activeIndex])}
                        data-no-fast
                        disabled={
                          !running ||
                          gameStatus.allyCooldown > 0 ||
                          gameStatus.allyEnergy[activeIndex] < -config.secondChargedMoves[activeIndex].energyDelta
                        }
                        onClick={() => sendAction("charged2")}
                      >
                        {getMoveName(config.secondChargedMoves[activeIndex])}
                      </Button>
                    ) : (
                      <div aria-hidden="true" />
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <div
                    className="grid w-full gap-1 sm:gap-2"
                    style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                    data-no-fast
                  >
                  {config.attackers.map((attacker, index) => (
                    <Button
                      key={`${attacker.pokemonId}-${index}`}
                      variant={index === activeIndex ? "default" : "outline"}
                      className="h-24 min-w-0 flex-col justify-center px-1 py-1 disabled:pointer-events-auto sm:h-28 sm:px-2"
                      data-no-fast
                      disabled={
                        !running ||
                        gameStatus.allyCooldown > 0 ||
                        index === activeIndex ||
                        gameStatus.allyPokemonDamage[index] >= gameStatus.allyPokemonMaxHealth[index]
                      }
                      onClick={() => sendAction(`switch${index}`)}
                    >
                      <div className="flex w-full flex-col items-center">
                        <img
                          src={"https://static.pokebattler.com/assets/pokemon/128/" + PoGoAPI.getPokemonImageByID(attacker.pokemonId, config.imageLinks)}
                          alt=""
                          className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                        />
                        <div className="mt-1 w-full">
                          <Progress
                            className="h-1.5 sm:h-2"
                            value={Math.max(0, ((gameStatus.allyPokemonMaxHealth[index] - gameStatus.allyPokemonDamage[index]) / gameStatus.allyPokemonMaxHealth[index]) * 100)}
                            color={getHealthColor(((gameStatus.allyPokemonMaxHealth[index] - gameStatus.allyPokemonDamage[index]) / gameStatus.allyPokemonMaxHealth[index]) * 100)}
                          />
                          <p className="mt-0.5 text-[9px] sm:text-[11px]">
                            {Math.max(0, gameStatus.allyPokemonMaxHealth[index] - gameStatus.allyPokemonDamage[index])}/{gameStatus.allyPokemonMaxHealth[index]}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    data-no-fast
                    onClick={() => setRunning((current) => !current)}
                    disabled={
                      gameStatus.timeout ||
                      gameStatus.enemyPokemonDamage >= gameStatus.enemyPokemonMaxHealth
                    }
                  >
                    {running ? "Pause" : "Resume"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          {config && gameStatus && !hasStartedRaid && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-background/60 p-4 backdrop-blur-[2px]">
              <Button
                className="h-14 min-w-[10rem] px-12 py-2 text-lg shadow-xl"
                data-no-fast
                onClick={initializeSimulation}
              >
                Start raid
              </Button>
            </div>
          )}
        </Card>
      </div>
      </ClickSparkWithProps>
    </>
  );
}
