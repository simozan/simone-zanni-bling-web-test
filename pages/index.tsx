"use client";
import './home.css';

import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"

interface Pokemon {
    name: string;
    url: string;
}

export default function Home() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
    const [nextUrl, setNextUrl] = useState<string>('https://pokeapi.co/api/v2/pokemon/')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getPokemon = async (url: string) => {
        setIsLoading(true);
        axios.get(url)
            .then((response) => {
                const pokemonData = response.data;
                console.log(pokemonData);

                setPokemonList((prev) => [...prev, ...pokemonData.results]);
                setNextUrl(pokemonData.next)
            })
            .catch((error) => {
                console.error('Error fetching Pokémon data: ', error);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        getPokemon(nextUrl)
    }, [])
    return (<main className="main">
        <h1 className="title" >Pokemon</h1>
        <ul className="pokemon-list">
        {pokemonList.map((eachPokemon: Pokemon) => (
          <li key={eachPokemon.name} className="pokemon-item">
            <a href={`/details/${eachPokemon.name}`} className="pokemon-link">{eachPokemon.name}</a>
          </li>
        ))}
        </ul>
        {nextUrl && (
            <button onClick={()=> getPokemon(nextUrl)} disabled={isLoading} className='load-button'>
                {isLoading ? `Loading...`: `Load more`}
            </button>
        )}
        </main>)
}