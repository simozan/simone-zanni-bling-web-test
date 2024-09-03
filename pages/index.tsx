"use client";
import './home.css';

import { useState } from "react"
import { useEffect } from "react"
import { useRef } from 'react';
import { useCallback } from 'react';
import axios from "axios"
import { useRouter } from 'next/navigation';
interface Pokemon {
    name: string;
    url: string;
}

interface PokemonType {
    name: string;
    url: string;
}

export default function Home() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
    const [nextUrl, setNextUrl] = useState<string>('https://pokeapi.co/api/v2/pokemon/')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [types, setTypes] = useState<PokemonType[]>([])
    const [selectedType, setSelectedType] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const router = useRouter()
    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    // fetch pokémon data

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

    // fetch available pokémon types

    const getTypes = async () => {
        axios.get('https://pokeapi.co/api/v2/type')
            .then((response) => {
                console.log(response.data.results);

                setTypes(response.data.results)
            })
            .catch((error) => {
                console.error('error fetching ponémon types: ', error);
            })
    }

    useEffect(() => {
        getPokemon(nextUrl);
        getTypes();
    }, []);

    // handle changes to the selected pokémon type

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        setSelectedType(selected);
        if (selected) {
            setIsLoading(true);
            axios.get(`https://pokeapi.co/api/v2/type/${selected}`)
                .then((response) => {
                    const pokemonData = response.data.pokemon.map((p: any) => p.pokemon);
                    setPokemonList(pokemonData);
                    setNextUrl('');
                })
                .catch((error) => {
                    console.error('error fetching ponémon by type: ', error);
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setPokemonList([]);
            getPokemon('https://pokeapi.co/api/v2/pokemon/')
        }
    }


    // handle form submission for search

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/details/${searchQuery.toLowerCase()}`)
        }
    }

    // Callback to load more Pokémon

    const loadMoreCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && nextUrl && !isLoading) {
                getPokemon(nextUrl)
            }
        },
        [nextUrl, isLoading]
    )

    // Set up IntersectionObserver to trigger loading more Pokémon when reaching the bottom of the list

    useEffect(() => {
        const observer = new IntersectionObserver(loadMoreCallback, {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        });
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current)
            }
        }
    }, [loadMoreCallback]);

    return (<main className="main">
        <h1 className="title" >Pokémon</h1>
        <form onSubmit={handleSearchSubmit} className='search-bar'>
            <input
                type="text"
                placeholder='Search Pokémon...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-input'
            />
            <button type="submit" className='search-button'>Search</button>
        </form>
        <select value={selectedType} onChange={handleTypeChange} className='type-select'>
            <option value="">All types</option>
            {types.map((type: PokemonType) => (
                <option key={type.name} value={type.name}>
                    {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </option>
            ))}
        </select>
        <ul className="pokemon-list">
            {pokemonList.map((eachPokemon: Pokemon) => (
                <li key={eachPokemon.name} className="pokemon-item">
                    <a href={`/details/${eachPokemon.name}`} className="pokemon-link">{eachPokemon.name.charAt(0).toUpperCase() + eachPokemon.name.slice(1)}</a>
                </li>
            ))}
        </ul>
        {/* {nextUrl && !selectedType && (
            <button onClick={() => getPokemon(nextUrl)} disabled={isLoading} className='load-button'>
                {isLoading ? `Loading...` : `Load more`}
            </button>
        )} */}
        <div ref={loadMoreRef} style={{ height: '20px' }}></div>
    </main>)
}