// Swal.fire({
//     title: 'Sweet!',
//     text: 'Modal with a custom image.',
//     imageUrl: 'https://unsplash.it/400/200',
//     imageWidth: 400,
//     imageHeight: 200,
//     imageAlt: 'Custom image',
//   })

// GLOBAL VARIABLES
const URL = "https://pokeapi.co/api/v2";
const endPokemon = "/pokemon/";
const endType = "/type/";
const limit = 1017;
const myCount = document.querySelector("#count");
const myButtons = document.querySelector("#type");
const myButton = document.querySelector("#cards");
const errorImg =
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/029b8bd9-cb5a-41e4-9c7e-ee516face9bb/dayo3ow-7ac86c31-8b2b-4810-89f2-e6134caf1f2d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAyOWI4YmQ5LWNiNWEtNDFlNC05YzdlLWVlNTE2ZmFjZTliYlwvZGF5bzNvdy03YWM4NmMzMS04YjJiLTQ4MTAtODlmMi1lNjEzNGNhZjFmMmQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ooubhxjHp9PIMhVxvCFHziI6pxDAS8glXPWenUeomWs";
const typePokemons = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

addEventListener("DOMContentLoaded", async () => {
  renderButtonsTypesPokemons();
  callPokemonsDef();
  callTypePokemons();
});

let renderButtonsTypesPokemons = () => {
  let id = 1;
  typePokemons.forEach((element) => {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute(
      "class",
      "btn btn-light btn-outline-warning buttonType"
    );
    button.setAttribute("id", id);
    button.setAttribute("name", element);
    button.textContent = element;
    myButtons.append(button);
    id = id + 1;
  });
};

let callPokemonsDef = async () => {
  let count = document.createElement("div");

  for (let i = 1; i <= limit; i++) {
    let res = await (await fetch(`${URL}${endPokemon}${i}`)).json();
    let div = document.createElement("div");
    div.setAttribute("class", "col");

    res.sprites.front_default
      ? div.insertAdjacentHTML(
          "beforeend",
          `
            <button type="button" class="btn btn-light btn-outline-warning boton">
              <img src="${res.sprites.front_default}" class="img-fluid" alt="${res.name}">
              <div class="h6">${res.name}</div>
            </button>
              `
        )
      : div.insertAdjacentHTML(
          "beforeend",
          `
            <button type="button" class="btn btn-light btn-outline-warning boton">
              <img src="${errorImg}" class="img-fluid error-img" alt="${res.name}">
              <div class="h6">${res.name}</div>
            </button>
              `
        );

    myButton.append(div);

    count.innerHTML = `<div class="h4">Total pokemones: ${i}</div>`;
    myCount.append(count);
  }
};

let callTypePokemons = () => {
  let button = document.querySelectorAll(".buttonType");
  button.forEach((element) => {
    let type = element.getAttribute("id");
    element.addEventListener("click", async (e) => {
      let res = await (await fetch(`${URL}${endType}${type}`)).json();
      console.log(res);
      myCount.innerHTML = "";
      myButton.innerHTML = "";

      let count = document.createElement("div");
      let i = 1;

      for (let pokemon of res.pokemon) {
        let pokemonUrl = pokemon.pokemon.url;
        let pokemonDetails = await (await fetch(pokemonUrl)).json();

        let div = document.createElement("div");
        div.setAttribute("class", "col");

        pokemonDetails.sprites.front_default
          ? div.insertAdjacentHTML(
              "beforeend",
              `
                <button type="button" class="btn btn-light btn-outline-warning boton">
                  <img src="${pokemonDetails.sprites.front_default}" class="img-fluid" alt="${pokemonDetails.name}">
                  <div class="h6">${pokemonDetails.name}</div>
                </button>
                  `
            )
          : div.insertAdjacentHTML(
              "beforeend",
              `
                <button type="button" class="btn btn-light btn-outline-warning boton">
                  <img src="${errorImg}" class="img-fluid error-img" alt="${pokemonDetails.name}">
                  <div class="h6">${pokemonDetails.name}</div>
                </button>
                  `
            );

        myButton.append(div);

        count.innerHTML = `<div class="h4">Total pokemones: ${i}</div>`;
        myCount.append(count);
        i = i + 1;
      }
    });
  });
};
