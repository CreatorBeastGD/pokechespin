"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RaidStatus } from "@/components/RaidStatus";
import Topography from "@/components/Topography";
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

const pokemonTypeColors: Record<string, string> = {
  normal: "#919aa1",
  fighting: "#d5425f",
  flying: "#9bb3e1",
  poison: "#b962cf",
  ground: "#d68e5e",
  rock: "#cbbd8d",
  bug: "#99c32f",
  ghost: "#626dbd",
  steel: "#5497a3",
  fire: "#ffa152",
  water: "#5faadd",
  grass: "#5dbe67",
  electric: "#f7da5b",
  psychic: "#fb8684",
  ice: "#7dd2c7",
  dragon: "#0970bb",
  dark: "#656777",
  fairy: "#ffaef0",
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

const raidRemainingRedColorNumList = [30, 25, 20, 15, 10, 5, 4, 3, 2, 1 ,0];

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
  const [gameStyle, setGameStyle] = useState(false);
  const [showPokemonWindow, setShowPokemonWindow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [topographyDisabled, setTopographyDisabled] = useState(false);
  const [showHPValues, setShowHPValues] = useState(true);
  const [showDPS, setShowDPS] = useState(true);
  const [showDodgeButton, setShowDodgeButton] = useState(true);

  const pointerStart = useRef<{ x: number; y: number; target: HTMLElement } | null>(null);
  const gameCardRef = useRef<HTMLDivElement>(null);

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

        localStorage.getItem("showHPOnSoloRaid") === "false" ? setShowHPValues(false) : setShowHPValues(true);
        localStorage.getItem("showDPSOnSoloRaid") === "false" ? setShowDPS(false) : setShowDPS(true);
        
        setGameStyle(localStorage.getItem("raidGameStyle") === "true");
        setTopographyDisabled(localStorage.getItem("raidGameTopographyDisabled") === "true");
        setShowDodgeButton(localStorage.getItem("raidGameShowDodgeButton") !== "false");

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

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === gameCardRef.current);
    };

    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
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
  const allyChargedMoveMessage = gameStatus?.allyActiveMove?.isCharged
    ? `Using ${getMoveName(gameStatus.allyActiveMove.move)}`
    : null;
  const getPlayerMessage = (message?: string | null) =>
    message?.replace(/\s+for [\d,.]+ damage!/i, "!");
  const toggleGameFullscreen = async () => {
    const card = gameCardRef.current;
    if (!card) return;

    if (!document.fullscreenEnabled || typeof card.requestFullscreen !== "function") {
      setFullscreenError("Fullscreen is not supported by this browser.");
      return;
    }

    try {
      if (document.fullscreenElement === card) {
        await document.exitFullscreen();
      } else {
        await card.requestFullscreen();
      }
      setFullscreenError(null);
    } catch (fullscreenRequestError) {
      setFullscreenError(
        fullscreenRequestError instanceof Error
          ? fullscreenRequestError.message
          : "Could not enter fullscreen mode.",
      );
    }
  };
  const getMoveAnimationDuration = (move: any) => {
    const durationMs = Number(move?.durationMs);
    const normalizedDurationMs = Number.isFinite(durationMs) && durationMs > 0
      ? Math.ceil(durationMs / 500) * 500
      : 1000;

    return `${normalizedDurationMs / 2}ms`;
  };

  const activeIndex = gameStatus?.activeAllyIndex ?? 0;
  const topographyColor = config
    ? pokemonTypeColors[PoGoAPI.formatTypeName(config.defender.type).toLowerCase()] ?? "#4fff60"
    : "#4fff60";
  const topographySecondColor = config?.defender.type2
    ? pokemonTypeColors[PoGoAPI.formatTypeName(config.defender.type2).toLowerCase()]
    : undefined;
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
  const isRaidTimeWarning = raidRemainingRedColorNumList.includes(raidRemaining);
  const bossHealthPercent = gameStatus && gameStatus.enemyPokemonMaxHealth > 0
    ? Math.max(
        0,
        Math.ceil(((gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage) /
          gameStatus.enemyPokemonMaxHealth) *
          100),
      )
    : 0;
  const bossBackHealthPercent = gameStatus && gameStatus.enemyPokemonMaxHealth > 0
    ? Math.max(
        0,
        Math.ceil((((parseInt(gameStatus.simulationLog[gameStatus.simulationLog.length - 2]?.enemyHP) ?? 0)) /
          gameStatus.enemyPokemonMaxHealth) *
          100),
      )
    : 0;
  const bossHealthColor = bossHealthPercent > 50
    ? "bg-green-500"
    : bossHealthPercent > 25
      ? "bg-yellow-500"
      : "bg-red-500";
  const handlePagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      target: event.target as HTMLElement,
    };
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

    const target = start.target;
    const blockedButton = target.closest("button") as HTMLButtonElement | null;
    if (blockedButton?.disabled && target.closest("[data-fast-fallback]")) {
      if (gameStatus?.allyCooldown === 0) sendAction("fast");
      return;
    }

    if (blockedButton?.disabled) {
      if (
        !blockedButton.hasAttribute("data-no-fast") &&
        gameStatus?.allyCooldown === 0
      ) {
        sendAction("fast");
      }
      return;
    }

    if (target.closest("button, a, input, select, textarea, [data-no-fast]")) return;
    if (!gameStatus || gameStatus.allyCooldown > 0) return;
    sendAction("fast");
  };

  const clickSparkSettings = {
    sparkColor: gameStyle ? "#fff" : darkMode ? "#fff" : "#000",
    shape: "dot",
    sparkCount: 1000,
    sparkSize: 18,
    sparkRadius: 40,
    duration: 500,
    randomness: 0,
  };

  return (
    <>
      <Navbar />
      <ClickSparkWithProps
        {...clickSparkSettings}
        disabled={gameStyle}
      >
      <div
        className="container mx-auto max-w-3xl px-4 pb-10"
        style={{ touchAction: "pan-y" }}
        onPointerDown={gameStyle ? undefined : handlePagePointerDown}
        onPointerUp={gameStyle ? undefined : handlePagePointerUp}
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
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                className="w-full rounded-lg bg-primary py-2 text-white"
                onClick={() => {
                  window.location.href = "/" + window.location.search;
                }}
              >
                Back to PokéChespin for Raids
              </button>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-border p-1" aria-label="Raid interface">
                <Button
                  type="button"
                  size="sm"
                  variant={!gameStyle ? "default" : "ghost"}
                  data-no-fast
                  aria-pressed={!gameStyle}
                  onClick={() => {
                    setGameStyle(false);
                    setShowPokemonWindow(false);
                    localStorage.setItem("raidGameStyle", "false");
                  }}
                >
                  Classic UI
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={gameStyle ? "default" : "ghost"}
                  data-no-fast
                  aria-pressed={gameStyle}
                  onClick={() => {
                    setGameStyle(true);
                    localStorage.setItem("raidGameStyle", "true");
                  }}
                >
                  Game UI
                </Button>
              </div>
            </div>
            {gameStyle && (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button onClick={() => {
                  setTopographyDisabled(!topographyDisabled)
                  localStorage.setItem("raidGameTopographyDisabled", (!topographyDisabled).toString())
                }}>
                  {topographyDisabled ? "Enable" : "Disable"} Background
                </Button>
                <Button onClick={() => {
                  setShowDodgeButton(!showDodgeButton)
                  localStorage.setItem("raidGameShowDodgeButton", (!showDodgeButton).toString())
                }}>
                  {showDodgeButton ? "Hide" : "Show"} Dodge Button
                </Button>
              </div>
            )}
          </CardContent>
          
        </Card>
        <Card className="relative mt-4">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              {gameStatus && hasStartedRaid && !gameStyle && (
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
              gameStyle ? (
                <div
                  ref={gameCardRef}
                  className={"raid-game-background relative mx-auto max-w-[430px] select-none overflow-hidden rounded-3xl border border-stone-600 text-white shadow-xl"}
                  style={{ touchAction: "pan-y",
                    backgroundColor: topographyColor
                   }}
                  onPointerDown={(event) => {
                    handlePagePointerDown(event);
                    const target = event.target as HTMLElement;
                    if (!target.closest("button, a, input, select, textarea, [data-no-fast]")) {
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }
                  }}
                  onPointerUp={handlePagePointerUp}
                  
                >
                  <div className={"raid-game-topography pointer-events-none absolute inset-0 z-0"} aria-hidden="true" style={{
                    backgroundColor: topographyDisabled ? topographyColor+"20" : undefined
                   }}>
                    {!topographyDisabled && (
                      <Topography
                      color={topographyColor}
                      flash={isRaidTimeWarning}
                      lineCount={30}
                      lineWidth={0.9}
                      elevation={0.5}
                      foreground={0.2}
                      tilt={45}
                      speed={0.23}
                      direction="forward"
                      glow={0.9}
                      depthOfField={0}
                      fog={0.75}
                      hoverEffect="light"
                      clickEffect="none"
                      majorLines
                      scale={1.5}
                      detail={1}
                      morph={1}
                      brightness={2}
                      markers="dots"
                      glitch={0}
                      opacity={0.6}
                      mouseInteraction
                      mouseRadius={2.2}
                      mouseStrength={0}
                      trail={0.3}
                      parallax={0.42}
                      intro={false}
                      lightMode={false}
                      dpr={undefined}
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: topographySecondColor
                          ? `${topographySecondColor}10`
                          : undefined,
                      }}
                    />
                    )}
                  </div>
                  <ClickSparkWithProps
                    {...clickSparkSettings}
                    className="raid-game-spark-layer relative z-10"
                    disabled={false}
                  >
                  <div className="raid-game-panel px-4 pb-3 pt-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {PoGoAPI.getPokemonNamePB(config.defender.pokemonId, config.allEnglishText)}
                        </p>
                        <p className="text-xs text-stone-300">Raid Boss</p>
                      </div>                   
                      <strong className="rounded-full bg-stone-200 px-3 py-1 text-sm text-black">{raidRemaining.toFixed(0)}s</strong>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-stone-400 bg-amber-50 text-stone-900 hover:bg-amber-100 hover:text-black"
                          data-no-fast
                          onClick={() => {
                            setRunning(false);
                            initializeSimulation();
                          }}
                        >
                          Restart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-stone-400 bg-amber-50 text-stone-900 hover:bg-amber-100 hover:text-black"
                          data-no-fast
                          onClick={toggleGameFullscreen}
                        >
                          {isFullscreen ? "Exit" : "Fullscreen"}
                        </Button>
                      </div>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-stone-300">
                      <div
                        className={"relative z-10 h-full transition-[width,background-color] " + bossHealthColor}
                        style={{
                          width: `${bossHealthPercent}%`,
                        }}
                      />
                      <div
                        className="absolute inset-y-0 left-0 z-0 transition-[width,background-color] bg-orange-500"
                        style={{
                          width: `${bossBackHealthPercent}%`,
                        }}
                      />
                    </div>
                    {fullscreenError && (
                      <p className="mt-2 text-xs text-red-200" role="alert">
                        {fullscreenError}
                      </p>
                    )}
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <div className="flex flex-col items-start gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-14 w-14 whitespace-normal rounded-lg border-stone-400 bg-amber-50 px-1 text-[10px] leading-tight text-stone-900 hover:bg-amber-100 hover:text-black"
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-14 w-14 whitespace-normal rounded-lg border-stone-400 bg-amber-50 px-1 text-[10px] leading-tight text-stone-900 hover:bg-amber-100 hover:text-black"
                          data-no-fast
                          onClick={() => setRunning((current) => !current)}
                          disabled={gameStatus.timeout || gameStatus.enemyPokemonDamage >= gameStatus.enemyPokemonMaxHealth}
                        >
                          {running ? "Pause" : "Resume"}
                        </Button>
                        
                      </div>
                      <div className="flex max-w-[58%] flex-col items-end gap-1">
                        { showHPValues && (
                          <span className="rounded-full bg-amber-50/90 px-3 py-1 text-xs font-semibold text-stone-800">
                            {Math.max(0, gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage)} / {gameStatus.enemyPokemonMaxHealth} HP
                          </span>
                        )}
                        
                        {gameStatus.globalCurrentMessage?.message && (
                          <p className="text-right text-[10px] leading-tight text-stone-300">
                            {gameStatus.globalCurrentMessage.message}
                          </p>
                        )}
                        {showDPS && (
                          <p className="text-right text-[10px] leading-tight text-stone-300">
                            DPS: {gameStatus.enemyPokemonDamage > 0 && gameStatus.timer > 0
                              ? (gameStatus.enemyPokemonDamage / gameStatus.timer).toFixed(2)
                              : "0.00"
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="raid-game-stage relative h-[min(58vh,520px)] min-h-[390px] overflow-hidden"
                    style={{ touchAction: "pan-y" }}
                    aria-label="Battlefield: tap to use a fast attack or swipe horizontally to dodge"
                  >
                    <div className="absolute left-1/2 top-[42%] h-10 w-44 -translate-x-1/2 rounded-[50%] bg-stone-800/15 blur-sm" />
                    {gameStatus.enemyActiveMove?.isCharged &&
                      !gameStatus.enemyPrepPhase &&
                      gameStatus.enemyCurrentMessage?.message && (
                      <p
                        className="absolute right-4 z-10 w-2/3 rounded-lg bg-black/80 px-2 py-1 text-right text-base font-semibold leading-tight text-white shadow"
                        style={{ top: "calc(50% - 5.25rem)" }}
                        role="status"
                      >
                        {gameStatus.enemyCurrentMessage.message}
                      </p>
                    )}
                    {showDodgeButton && (
                      <Button
                        className="absolute right-4 top-1/2 z-10 h-16 w-16 -translate-y-1/2 rounded-lg border border-amber-800 bg-amber-700 p-1 text-xs text-white hover:bg-amber-800"
                        disabled={!running || gameStatus.allyCooldown > 0}
                        onClick={() => sendAction("dodge")}
                      >
                        Dodge
                    </Button>)}
                    <img
                      src={"https://static.pokebattler.com/assets/pokemon/128/" + enemySprite}
                      alt={PoGoAPI.getPokemonNamePB(config.defender.pokemonId, config.allEnglishText)}
                      draggable={false}
                      className={"pointer-events-none absolute right-[8%] top-[2%] h-36 w-36 select-none object-contain drop-shadow-lg sm:h-44 sm:w-44 " + enemySpriteMovement}
                      style={gameStatus.enemyActiveMove && !gameStatus.enemyPrepPhase ? { animationDuration: getMoveAnimationDuration(gameStatus.enemyActiveMove.move) } : undefined}
                    />
                    <img
                      src={"https://static.pokebattler.com/assets/pokemon/128/" + allySprite}
                      alt={PoGoAPI.getPokemonNamePB(config.attackers[activeIndex].pokemonId, config.allEnglishText)}
                      draggable={false}
                      className={"pointer-events-none absolute bottom-[12%] left-[7%] h-40 w-40 select-none object-contain drop-shadow-xl sm:h-48 sm:w-48 " + allySpriteMovement}
                      style={gameStatus.allyActiveMove ? { animationDuration: getMoveAnimationDuration(gameStatus.allyActiveMove.move) } : undefined}
                    />
                    {allyChargedMoveMessage && (
                      <p
                        className="absolute bottom-[6%] left-4 z-10 w-2/3 rounded-lg bg-black/80 px-2 py-1 text-left text-base font-semibold leading-tight text-white shadow"
                        role="status"
                      >
                        {allyChargedMoveMessage}
                      </p>
                    )}
                    <div className="absolute bottom-[44%] left-[7%] w-52 text-xs font-semibold text-white drop-shadow-md">
                      <div className="mb-1 flex justify-between gap-2 text-[11px] font-semibold">
                        <span className="truncate">{PoGoAPI.getPokemonNamePB(config.attackers[activeIndex].pokemonId, config.allEnglishText)}</span>
                        {showHPValues && <span>{Math.max(0, gameStatus.allyPokemonMaxHealth[activeIndex] - gameStatus.allyPokemonDamage[activeIndex])} HP</span>}
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-stone-300">
                        <div
                          className={`h-full ${getHealthColor(((gameStatus.allyPokemonMaxHealth[activeIndex] - gameStatus.allyPokemonDamage[activeIndex]) / gameStatus.allyPokemonMaxHealth[activeIndex]) * 100)}`}
                          style={{
                            width: `${Math.max(0, ((gameStatus.allyPokemonMaxHealth[activeIndex] - gameStatus.allyPokemonDamage[activeIndex]) / gameStatus.allyPokemonMaxHealth[activeIndex]) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="raid-game-panel space-y-2 p-3">
                    <div className={`grid justify-items-center gap-2 ${config.secondChargedMoves[activeIndex] ? "grid-cols-2" : "grid-cols-1"}`}>
                      {[
                        { move: config.chargedMoves[activeIndex], action: "charged" },
                        ...(config.secondChargedMoves[activeIndex] ? [{ move: config.secondChargedMoves[activeIndex], action: "charged2" }] : []),
                      ].map(({ move, action }) => {
                        const energyCost = -move.energyDelta;
                        const segmentCount = energyCost === 33 ? 3 : energyCost === 50 ? 2 : 0;
                        const energy = gameStatus.allyEnergy[activeIndex];
                        const completedCharges = segmentCount > 0
                          ? Math.min(segmentCount, Math.floor(energy / energyCost))
                          : 0;
                        const chargeProgress = segmentCount > 0
                          ? completedCharges === segmentCount
                            ? 100
                            : ((energy - completedCharges * energyCost) / energyCost) * 100
                          : 0;

                        return (
                          <Button
                            key={action}
                            className={"relative aspect-square h-auto w-full max-w-[88px] overflow-hidden whitespace-normal px-2 text-xs text-white disabled:pointer-events-auto " + getMoveTypeClass(move)}
                            data-no-fast
                            data-fast-fallback
                            disabled={
                              !running ||
                              gameStatus.allyCooldown > 0 ||
                              gameStatus.allyEnergy[activeIndex] < energyCost
                            }
                            onClick={() => sendAction(action)}
                          >
                            <span className="relative z-10">{getMoveName(move)}</span>
                            {segmentCount > 0 ? (
                              <>
                                <span
                                  className="pointer-events-none absolute inset-0 z-0 bg-white/30 transition-opacity"
                                  style={{ opacity: completedCharges / segmentCount }}
                                  aria-hidden="true"
                                />
                                <span
                                  className="pointer-events-none absolute inset-x-0 bottom-0 z-0 bg-white/40 transition-[height]"
                                  style={{ height: `${chargeProgress}%` }}
                                  aria-hidden="true"
                                />
                                <span className="pointer-events-none absolute right-1 top-1 z-10 rounded bg-black/60 px-1 text-[9px] leading-4 text-white">
                                  {completedCharges}/{segmentCount}
                                </span>
                              </>
                            ) : (
                              <span
                                className="pointer-events-none absolute inset-x-0 bottom-0 z-0 bg-white/35 transition-[height]"
                                style={{
                                  height: `${Math.max(0, Math.min(100, (energy / energyCost) * 100))}%`,
                                }}
                              />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-14 w-14 whitespace-normal rounded-lg border-stone-400 bg-amber-50 px-1 text-[10px] leading-tight text-stone-900 hover:bg-amber-100 hover:text-black"
                        data-no-fast
                        onClick={() => setShowPokemonWindow(true)}
                      >
                        Pokémon
                      </Button>
                    </div>
                    <p className="text-center text-[11px] text-stone-300">Tap the battlefield to attack · swipe sideways to dodge</p>
                  </div>
                  {showPokemonWindow && (
                    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/70 p-4 pb-2">
                      <div className="w-full rounded-2xl border border-gray-600 bg-gray-900 p-3 text-white shadow-xl" data-no-fast role="dialog" aria-modal="true" aria-label="Pokémon party">
                        <div className="mb-2 flex items-center justify-between">
                          <strong>My Battle Party</strong>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {config.attackers.map((attacker, index) => (
                            <Button
                              key={`${attacker.pokemonId}-${index}`}
                              variant="outline"
                              className={`h-auto min-w-0 flex-col gap-1 p-2 text-xs text-white ${index === activeIndex ? "border-blue-700 bg-gray-900" : "bg-gray-700"}`}
                              data-no-fast
                              disabled={
                                !running ||
                                gameStatus.allyCooldown > 0 ||
                                index === activeIndex ||
                                gameStatus.allyPokemonDamage[index] >= gameStatus.allyPokemonMaxHealth[index]
                              }
                              onClick={() => {
                                sendAction(`switch${index}`);
                                setShowPokemonWindow(false);
                              }}
                            >
                              <img
                                src={"https://static.pokebattler.com/assets/pokemon/128/" + PoGoAPI.getPokemonImageByID(attacker.pokemonId, config.imageLinks)}
                                alt=""
                                draggable={false}
                                className="h-12 w-12 select-none object-contain"
                              />
                              <span className="w-full truncate">{PoGoAPI.getPokemonNamePB(attacker.pokemonId, config.allEnglishText)}</span>
                              {showHPValues && (
                                <span className="w-full text-center text-[10px]">
                                  {Math.max(0, gameStatus.allyPokemonMaxHealth[index] - gameStatus.allyPokemonDamage[index])} / {gameStatus.allyPokemonMaxHealth[index]} HP
                                </span>
                              )}
                              <span className="h-1.5 w-full overflow-hidden rounded-full bg-stone-300">
                                <span
                                  className={`block h-full ${getHealthColor(((gameStatus.allyPokemonMaxHealth[index] - gameStatus.allyPokemonDamage[index]) / gameStatus.allyPokemonMaxHealth[index]) * 100)}`}
                                  style={{
                                    width: `${Math.max(0, ((gameStatus.allyPokemonMaxHealth[index] - gameStatus.allyPokemonDamage[index]) / gameStatus.allyPokemonMaxHealth[index]) * 100)}%`,
                                  }}
                                />
                              </span>
                            </Button>
                          ))}
                        </div>
                        <Button
                          className="mx-auto mt-3 flex min-w-28 bg-amber-50 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-100 hover:text-black"
                          variant="outline"
                          data-no-fast
                          onClick={() => setShowPokemonWindow(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                  {!hasStartedRaid && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/50 p-4 backdrop-blur-[2px]">
                      {fullscreenError && (
                        <p className="text-center text-sm text-red-200" role="alert">
                          {fullscreenError}
                        </p>
                      )}
                      <Button
                        className="h-14 min-w-[10rem] px-8 text-lg shadow-xl"
                        data-no-fast
                        onClick={initializeSimulation}
                      >
                        Start raid
                      </Button>
                      <Button
                        variant="outline"
                        className="border-stone-400 bg-amber-50 text-stone-900 hover:bg-amber-100"
                        data-no-fast
                        onClick={toggleGameFullscreen}
                      >
                        {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                      </Button>
                    </div>
                  )}
                  </ClickSparkWithProps>
                  {!running && hasStartedRaid && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
                      <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                        Paused
                      </p>
                    </div>
                  )}
                  {gameStatus.isRelobby > 0 && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
                      <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                        Relobbying...
                      </p>
                    </div>
                  )}
                  {gameStatus.enemyPokemonDamage >= gameStatus.enemyPokemonMaxHealth && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
                      <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                        YOU WIN!
                      </p>
                    </div>
                  )}
                  {gameStatus.timeout && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
                      <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                        Timeout reached.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
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
                      draggable={false}
                      className={"absolute right-1/4 top-1/3 h-20 w-20 -translate-y-1/2 select-none object-contain opacity-40 transition-transform duration-300 ease-out " + allySpriteMovement}
                      style={gameStatus.allyActiveMove ? { animationDuration: getMoveAnimationDuration(gameStatus.allyActiveMove.move) } : undefined}
                    />
                    <img
                      src={"https://static.pokebattler.com/assets/pokemon/128/" + enemySprite}
                      alt=""
                      draggable={false}
                      className={"absolute right-1 top-1/3 h-20 w-20 -translate-y-1/2 select-none object-contain opacity-40 transition-transform duration-300 ease-out " + enemySpriteMovement}
                      style={gameStatus.enemyActiveMove && !gameStatus.enemyPrepPhase ? { animationDuration: getMoveAnimationDuration(gameStatus.enemyActiveMove.move) } : undefined}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{PoGoAPI.getPokemonNamePB(config.defender.pokemonId, config.allEnglishText)}</span>
                          {showHPValues && (
                            <span>
                              {Math.max(0, gameStatus.enemyPokemonMaxHealth - gameStatus.enemyPokemonDamage)} / {gameStatus.enemyPokemonMaxHealth} HP
                            </span>
                          )}
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
                        {showHPValues && (
                          <span>
                          {Math.max(0, gameStatus.allyPokemonMaxHealth[activeIndex] - gameStatus.allyPokemonDamage[activeIndex])} / {gameStatus.allyPokemonMaxHealth[activeIndex]} HP
                        </span>
                        )}
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
                        {getPlayerMessage(gameStatus.allyCurrentMessage?.message)}
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
                      data-fast-fallback
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
                        data-fast-fallback
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
                          draggable={false}
                          className="h-12 w-12 select-none object-contain sm:h-16 sm:w-16"
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
              )
            )}
            
          </CardContent>
          {config && gameStatus && !hasStartedRaid && !gameStyle && (
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
          {!gameStyle && config && gameStatus && !running && hasStartedRaid && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
              <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                Paused
              </p>
            </div>
          )}
          {!gameStyle && config && gameStatus && gameStatus.isRelobby > 0 && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
              <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                Relobbying...
              </p>
            </div>
          )}
          {!gameStyle && config && gameStatus && gameStatus.enemyPokemonDamage >= gameStatus.enemyPokemonMaxHealth && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
              <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                YOU WIN!
              </p>
            </div>
          )}
          {!gameStyle && config && gameStatus && gameStatus.timeout && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl">
              <p className="bg-black rounded-xl bg-background/60 px-4 py-2 text-lg font-semibold text-stone-300 backdrop-blur-[2px]">
                Timeout reached.
              </p>
            </div>
          )}
        </Card>
      </div>
      </ClickSparkWithProps>
    </>
  );
}
