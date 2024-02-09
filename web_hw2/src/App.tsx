import React from 'react'
import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



interface Pokemon {
  name:string;
}

interface PokemonListResponse {
  results: Pokemon[];
}

export const App: React.FC = () => {
  let [pokemonNames, setPokemonNames] = React.useState<string[]>([]);

  const K = 386;
  async function fetchFirstKPokemonNames() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${K}`);
      const data: PokemonListResponse = await response.json();
      setPokemonNames(data.results.map(pokemon => pokemon.name));
    } catch (error) {
      console.error('Error fetching Pokémon names:', error);
      throw error;
    }
  }

  React.useEffect(() => {
    fetchFirstKPokemonNames();
  }, []);

  // const getRandomIndex = () => {
  //   return Math.floor(Math.random() * pokemonNames.length);
  // };

  // // Function to get 3 random pokemons
  // const getRandomNames = () => {
  //   const randomStrings: string[] = [];
  //   while (randomStrings.length < 3) {
  //     const index = getRandomIndex();
  //     if (!randomStrings.includes(pokemonNames[index])) {
  //       randomStrings.push(pokemonNames[index]);
  //     }
  //   }
  //   return randomStrings;
  // };
  
  return (
    <>
    <h1>My Pokemon</h1>
    <div >names</div>
    <div>
      <ul>
          {pokemonNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
      </ul>
    </div>
    </>
  )}


// interface PokemonData {
//   name: string;
//   spriteUrl: string;
//   height: number;
//   weight: number;
//   type: string;
//   // hp: string;
//   // attack: string;
//   // specialAttack: string;
//   // specialDefense: string;
//   // speed: string;
// }


// export const App: React.FC = () => {
//   let [pokemonData, setPokemonData] = React.useState<boolean>(false);


//   const fetchPokemonData = async () => {
//     fetch(`https://pokeapi.co/api/v2/pokemon/${rand}`)
//         .then((response: Response) => {
//             if (!response.ok) {
//               console.log("error in fetching");
//             }
//             else {
//                 response.json().then((data: PokemonData[]) => {
//                     console.log(data);
//                 });
//             }
//         })
//         .catch((error: Error) => {
//           console.log('Error fetching comments:', error);
//         })
//         .finally(() => {
           
//         });
//   };

//   let initialContext: AppContext = {
//     errorMessage: errorMessage,
//     query: query,
//     setQuery: (value: number) => {
//         setQuery(value);
//     },
//     onRetry: async () => {
//       fetchCommentData();
//     },
//   };


//   React.useEffect(() => {
//     fetchPokemonData();
//   }, []);

//   return (
//     <AppContext.Provider value={initialContext}>
//       <div className="app-container">
//         <div className="title-container">
//           <Title />
//         </div>
//         <div className="search-bar-container">
//           <SearchBar />
//         </div>
//         {showLoader && <Loader />}
//         <div className="comments-container">
//           {comments.map((comment, index) => {
//             return (
//               <Comment
//                 key={index}
//                 id={comment.id}
//                 name={comment.name}
//                 email={comment.email}
//                 body={comment.body}
//               />
//             );
//           })}
//           </div>
//         {errorMessage && <ErrorState />}
//       </div>
//     </AppContext.Provider>
//   );
// };

