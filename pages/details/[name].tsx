"use client"

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

interface Pokemon {
    name: string;
    sprites: {
        other: {
            'official-artwork': {
                front_default: string;
                front_shiny: string;
            }
        }
    }
    id: number;
    height: number;
    weight: number;
    abilities: { ability: { name: string } }[];
    stats: { stat: { name: string }; base_stat: number }[];
}

export default function Details() {
    const router = useRouter();
    const { name } = router.query;
    const [pokemon, setPokemon] = useState<Pokemon | null>(null)

    useEffect(() => {
        if (name) {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
                .then((response) => {
                    setPokemon(response.data)
                })
                .catch((error) => {
                    console.error("Error fetching Pokémon details", error);
                });
        }
    }, [name]);
    if (!pokemon) return <div>Loading...</div>
    return (
<div>
    <h1>{pokemon.name}</h1>
    <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name}/>
    <img src={pokemon.sprites.other['official-artwork'].front_shiny} alt={`${pokemon.name} shiny`}/>
<ul>
    <li> ID: {pokemon.id}</li>
    <li> Height: {pokemon.height}</li>
    <li> Weight: {pokemon.weight}</li>
    <li> Abilities: {pokemon.abilities.map((a) => a.ability.name).join(', ')}</li>
    <li> Stats: {pokemon.stats.map((s) => `${s.stat.name}: ${s.base_stat}`).join(', ')}</li>
</ul>
</div>
    );
}

