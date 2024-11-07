let baseURL = "https://pokeapi.co/api/v2";

async function fetchPokemon() {
  // Fetch pokemon data
  let data = await $.getJSON(`${baseURL}/pokemon/?limit=1000`);

  // Empty pokemon area before appending new elements
  $('#pokemon-area').empty();

  // Create a new array with 3 random urls
  let randomPokemonUrls = [];
  for (let i = 0; i < 3; i++) {
    let randomIdx = Math.floor(Math.random() * data.results.length);
    randomPokemonUrls.push(data.results[randomIdx].url);
  }

  // Fetch the Pokemon data for each URL, then fetch species data for each pokemon
  let pokemonData = await Promise.all(
    randomPokemonUrls.map(url => $.getJSON(url))
  );
  let speciesData = await Promise.all(
    pokemonData.map(p => $.getJSON(p.species.url))
  );

  // Append each pokemon data and species data to web page
  speciesData.forEach((d, i) => {
    let descriptionData = d.flavor_text_entries.find(
      entry => entry.language.name === "en"
    );
    let description = descriptionData ? descriptionData.flavor_text : "";
    let name = pokemonData[i].name;
    let imgSrc = pokemonData[i].sprites.front_default;

    // Construct the pokemon card
    let pokemonCard = makePokemonCard(name, imgSrc, description);
    
    // Append the pokemon card to the pokemon-area in your HTML
    $('#pokemon-area').append(pokemonCard);
  });
}

function makePokemonCard(name, imgSrc, description) {
  return `
  <div class="card">
    <h1>${name}</h1>
    <img src=${imgSrc} />
    <p>${description}</p>
  </div>
  `;
}

$("button").on("click", fetchPokemon);