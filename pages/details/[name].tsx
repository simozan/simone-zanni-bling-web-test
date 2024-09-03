"use client"
import './details.css'

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Link from 'next/link';

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
    types: { type: { name: string } }[];
}

export default function Details() {
    const router = useRouter();
    const { name } = router.query;
    const [pokemon, setPokemon] = useState<Pokemon | null>(null)

    useEffect(() => {
        if (name) {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
                .then((response) => {
                    console.log(response.data);
                    setPokemon(response.data)
                })
                .catch((error) => {
                    console.error("Error fetching Pokémon details", error);
                });
        }
    }, [name]);
    if (!pokemon) return <div>Loading...</div>
    return (
        <main className="main">
            < div className='card'>
                <h1 className='details-title'>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} </h1>
                <div className='details-container'>
                    <div className='details-images'>
                        <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} className='details-image' />
                        <img src={pokemon.sprites.other['official-artwork'].front_shiny} alt={`${pokemon.name} shiny`} className='details-image' />
                    </div>
                    <ul className='details-list'>
                        <li className='details-item'> <strong>ID: </strong>{pokemon.id}</li>
                        <li className='details-item'><strong> Height: </strong>{pokemon.height}</li>
                        <li className='details-item'> <strong>Weight: </strong>{pokemon.weight}</li>
                        <li className='details-item'> <strong>Abilities: </strong>{pokemon.abilities.map((a) => a.ability.name).join(', ')}</li>
                        <li className='details-item'> <strong>Stats: </strong>
                            <ul>{pokemon.stats.map((s) =>
                                <li>{s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1)}: {s.base_stat}</li>)}
                            </ul>
                        </li>
                        <li className='details-item'><strong>Types: </strong> {pokemon.types.map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(', ')}</li>
                    </ul>
                </div>
            </div>
            <Link href="/" passHref> <button className='back-button'>Back</button> </Link>
        </main>
    );
}

