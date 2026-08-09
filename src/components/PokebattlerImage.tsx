import { PoGoAPI } from "../../lib/PoGoAPI";
import Image from "next/image";
import { PBPokemonData } from "./PokemonData";

type PokebattlerImageProps = {
    imageLinks: any;
    englishText: any;
    allMoves: any;
    pokemonData?: PBPokemonData | null;
}

export function PokebattlerImage({
    imageLinks,
    englishText,
    allMoves,
    pokemonData,
}: PokebattlerImageProps)
{
    const resolvedPokemonData = pokemonData ?? new PBPokemonData(
        "Dark",
        "DARKRAI_SHADOW_FORM",
        { level: 50, atk: 15, def: 15, hp: 11 },
        "SNARL_FAST",
        "SHADOW_BALL",
        true,
        false,
        { attack: 0, guard: 0, spirit: 0 }
    );
    return (
        <div className="flex flex-col items-center justify-center relative">
            <p className="absolute top-4 left-0 bg-black text-white text-xxs py-1 px-2 rounded-br-lg">
                {PoGoAPI.getPokemonNamePB(resolvedPokemonData.pokemonId, englishText)}
            </p>
            <p className="absolute top-8 left-0 bg-black text-white text-xxxs py-1 px-2 rounded-br-lg">
                {resolvedPokemonData.customName}
            </p>

            <p className="absolute bottom-0 left-0 bg-black text-white text-tiny py-1 px-2 rounded">
                Lv. {resolvedPokemonData.stats.level} 
            </p>
            <p className="absolute bottom-0 right-0 bg-black text-white text-xxs py-1 px-2 rounded">
                {resolvedPokemonData.stats.atk}/{resolvedPokemonData.stats.def}/{resolvedPokemonData.stats.hp}
            </p>
            <p className="absolute bottom-8 right-0 bg-black text-white text-xxxs py-1 px-2 rounded">
                {PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(resolvedPokemonData.fastAttackId, allMoves)).moveId)}
            </p>
            <p className="absolute bottom-5 right-0 bg-black text-white text-xxxs py-1 px-2 rounded">
                {PoGoAPI.formatMoveName((PoGoAPI.getMovePBByID(resolvedPokemonData.chargedAttackId, allMoves)).moveId)}
            </p>
            {PoGoAPI.IsGigantamax(resolvedPokemonData.pokemonId) ? (
                <Image
                unoptimized
                src={"https://static.pokebattler.com/images/gigantamax_coin.png"}
                alt="Gigantamax Coin"
                width={20}
                height={20}
                style={{ objectFit: 'scale-down', width: '20px', height: '20px' }}
                className="absolute bottom-6 left-1"
            />
            ) : resolvedPokemonData.isDynamax ? (
                <Image
                unoptimized
                src={"https://static.pokebattler.com/images/dynamax_coin.png"}
                alt="Dynamax Coin"
                width={20}
                height={20}
                style={{ objectFit: 'scale-down', width: '20px', height: '20px' }}
                className="absolute bottom-6 left-1"
            />
            ) : null}
            <Image
            unoptimized
            className={"rounded-lg shadow-lg mb-4 mt-4 border border-gray-200 " + (PoGoAPI.IsShadow(resolvedPokemonData.pokemonId) ? "bg-gradient-to-t from-purple-900 to-violet-100" : PoGoAPI.IsMega(resolvedPokemonData.pokemonId) ? "bg-gradient-to-br from-red-200 via-green-200 to-blue-200" : PoGoAPI.IsPrimal(resolvedPokemonData.pokemonId) ? "bg-gradient-to-br from-blue-500 via-black-500 to-red-500" : "bg-white")}
            src={"https://static.pokebattler.com/assets/pokemon/256/" + PoGoAPI.getPokemonImageByID(resolvedPokemonData.pokemonId, imageLinks, resolvedPokemonData.isShiny)}
            alt={resolvedPokemonData.customName + " | Pokémon GO Damage Calculator"}
            width={100}
            height={100}
            style={{ objectFit: 'scale-down', width: '100px', height: '100px' }}
        />
        </div>
    )
}