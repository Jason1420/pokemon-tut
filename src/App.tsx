import React from 'react';
import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { log } from 'console';
import PokemonCollection from './components/PokemonCollection';
import { Pokemon } from './interface';
interface Pokemons {
  name: string,
  url: string
}
export interface Detail {
  id: number,
  isOpened: boolean
}
const App: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [nextUrl, setNextUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id: 0,
    isOpened: false
  })
  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20')
      setNextUrl(res.data.next)

      res.data.results.forEach(async (pokemon: Pokemons) => {
        const poke = await axios.get(pokemon.url)
        setPokemons((p) => [...p, poke.data])
      })
    }
    getPokemon();
    setLoading(false);

  }, [])
  const loadMore = async () => {
    setLoading(true);
    const res = await axios.get(nextUrl)
    setNextUrl(res.data.next)

    res.data.results.forEach(async (pokemon: Pokemons) => {
      const poke = await axios.get(pokemon.url)
      setPokemons((p) => [...p, poke.data])
      setLoading(false);
    })
  }
  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header"> Pokemon</header>
        <PokemonCollection
          pokemons={pokemons}
          viewDetail={viewDetail}
          setDetail={setDetail}
        />
        {!viewDetail.isOpened && (
          <div className="btn">
            <button onClick={loadMore}>
              {loading ? "Loading..." : "Load more"}{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
