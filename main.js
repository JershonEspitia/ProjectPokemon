// GLOBAL VARIABLES
const URL = "https://pokeapi.co/api/v2";
const endPokemonAll = "/pokemon?limit=100000&offset=0";
const endPokemon = "/pokemon/";
const endType = "/type/";

const pokemonUriDB = "https://6509d046f6553137159c1074.mockapi.io";
const endPokemonDB = "/pokemons";

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

let listUpdateStats = null;

addEventListener("DOMContentLoaded", async () => {
  searchPokemon();
  resetPage();
  renderButtonsTypesPokemons();
  pokemonsDefault();
  callTypePokemons();
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});

let searchPokemon = () => {
  document.querySelector("#btn-submit").addEventListener("click", async () => {
    const searchIdOName = document
      .querySelector("#input-valor")
      .value.toLowerCase()
      .trim();
    let res;

    try {
      res = await (await fetch(`${URL}${endPokemon}${searchIdOName}`)).json();

      if (res) {
        myButton.innerHTML = "";
        myCount.innerHTML = "";

        let div = document.createElement("DIV");
        div.setAttribute("class", "col");

        res.sprites.front_default
          ? div.insertAdjacentHTML(
              "beforeend",
              `
                  <button id="${res.name}" type="button" class="btn btn-light btn-outline-warning boton-card">
                    <img src="${res.sprites.front_default}" class="img-fluid" alt="${res.name}">
                    <div class="h6">${res.name}</div>
                  </button>
                    `
            )
          : div.insertAdjacentHTML(
              "beforeend",
              `
                  <button id="${res.name}" type="button" class="btn btn-light btn-outline-warning">
                    <img src="${errorImg}" class="img-fluid error-img" alt="${res.name}">
                    <div class="h6">${res.name}</div>
                  </button>
                    `
            );

        myButton.append(div);

        let buttonCard = document.querySelector(".boton-card");
        buttonCard.addEventListener("click", async () => {

          let existDB = await consultDB(buttonCard);

          if (existDB) {

            // showCancelButton: true,
            // confirmButtonText: "Sí, eliminar",
            // cancelButtonColor: '#d33',
    
            Swal.fire({
              title: existDB.title,
              imageUrl: existDB.imageUrl ? existDB.imageUrl : errorImg,
              html: existDB.html,
              imageWidth: 300,
              imageHeight: 300,
    
              showConfirmButton: false,
    
              showCancelButton: true,
              cancelButtonColor: '#9C0909',
              cancelButtonText: "Cerrar",
    
            });
          } else {
            Swal.fire({
              title: res.name,
              imageUrl: res.sprites.front_default
                ? res.sprites.front_default
                : errorImg,
              html: `
                ${res.stats
                  .map(
                    (data) =>
                      `<input type="range" max="200" value="${data.base_stat}"><label><b>${data.base_stat}</b> ${data.stat.name} </label><br>`
                  )
                  .join("")}
              `,
              imageWidth: 300,
              imageHeight: 300,
    
              showConfirmButton: true,
              confirmButtonColor: '#0006FF',
              confirmButtonText: "Actualizar",
    
              showCancelButton: true,
              cancelButtonColor: '#9C0909',
              cancelButtonText: "Cerrar",
            });
          }
          updateStats();
          updateDB();
        });
      }
    } catch (error) {
      myButton.innerHTML = "";
      myCount.innerHTML = "";

      let div = document.createElement("DIV");
      div.setAttribute("class", "col");

      div.insertAdjacentHTML(
        "beforeend",
        `
          <button type="button" class="btn btn-light btn-outline-warning">
            <img src="${errorImg}" class="img-fluid error-img" alt="none">
            <div class="h6">No encontrado</div>
          </button>
        `
      );
      myButton.append(div);
    }
  });
};

let resetPage = () => {
  let buttonReset = document.querySelector("#btn-reset");
  buttonReset.addEventListener("click", () => {
    window.location.reload();
  });
};

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

let renderPokemons = async (list_, limit_) => {
  let count = document.createElement("DIV");
  let list = list_;
  let limit = limit_;
  let i = 1;
  let listPokDetails = [];

  for (let pokemon of list) {
    let pokemonUrl = pokemon.url;
    let pokemonDetails = await (await fetch(pokemonUrl)).json();
    listPokDetails.push(pokemonDetails);

    let div = document.createElement("DIV");
    div.setAttribute("class", "col");

    pokemonDetails.sprites.front_default
      ? div.insertAdjacentHTML(
          "beforeend",
          `
            <button id="${pokemonDetails.name}" type="button" class="btn btn-light btn-outline-warning boton-card">
              <img src="${pokemonDetails.sprites.front_default}" class="img-fluid" alt="${pokemonDetails.name}">
              <div class="h6">${pokemonDetails.name}</div>
            </button>
              `
        )
      : div.insertAdjacentHTML(
          "beforeend",
          `
            <button type="button" class="btn btn-light btn-outline-warning boton-card">
              <img src="${errorImg}" class="img-fluid error-img" alt="${pokemonDetails.name}">
              <div class="h6">${pokemonDetails.name}</div>
            </button>
              `
        );

    myButton.append(div);

    i != limit
      ? (count.innerHTML = `<div class="h4">CARGANDO...</div><div class="h4">Total pokemones: ${i}</div>`)
      : (count.innerHTML = `<div class="h4">Total pokemones: ${i}</div>`);

    myCount.append(count);
    i = i + 1;
  }

  infoPokemon(listPokDetails);
};

let pokemonsDefault = async () => {
  let res = await (await fetch(`${URL}${endPokemonAll}`)).json();
  let list = res.results;
  let limit = res.count;
  renderPokemons(list, limit);
};

let callTypePokemons = () => {
  let button = document.querySelectorAll(".buttonType");
  button.forEach((element) => {
    let type = element.getAttribute("id");
    element.addEventListener("click", async (e) => {
      let arrayPokemons = [];
      let res = await (await fetch(`${URL}${endType}${type}`)).json();
      let limit = 0;

      res.pokemon.forEach((element) => {
        arrayPokemons.push(element.pokemon);
        limit = limit + 1;
      });
      myCount.innerHTML = "";
      myButton.innerHTML = "";
      renderPokemons(arrayPokemons, limit);
    });
  });
};

let infoPokemon = async (listPokDetails_) => {
  let listPokDetails = listPokDetails_;
  let buttonCard = document.querySelectorAll(".boton-card");

  buttonCard.forEach((element, index) => {
    element.addEventListener("click", async () => {

      let existDB = await consultDB(element);

      if (existDB) {
        console.log("existDB.html", existDB.html);

        // showCancelButton: true,
        // confirmButtonText: "Sí, eliminar",
        // cancelButtonColor: '#d33',

        Swal.fire({
          title: existDB.title,
          imageUrl: existDB.imageUrl ? existDB.imageUrl : errorImg,
          html: existDB.html,
          imageWidth: 300,
          imageHeight: 300,

          showConfirmButton: false,

          showCancelButton: true,
          cancelButtonColor: '#9C0909',
          cancelButtonText: "Cerrar",

        });
      } else {
        console.log("SE EJECUTA ELSE EXISTDB");

        Swal.fire({
          title: listPokDetails[index].name,
          imageUrl: listPokDetails[index].sprites.front_default
            ? listPokDetails[index].sprites.front_default
            : errorImg,
          html: `
            ${listPokDetails[index].stats
              .map(
                (data) =>
                  `<input type="range" max="200" value="${data.base_stat}"><label><b>${data.base_stat}</b> ${data.stat.name} </label><br>`
              )
              .join("")}
          `,
          imageWidth: 300,
          imageHeight: 300,

          showConfirmButton: true,
          confirmButtonColor: '#0006FF',
          confirmButtonText: "Actualizar",

          showCancelButton: true,
          cancelButtonColor: '#9C0909',
          cancelButtonText: "Cerrar",
        });

        updateStats();
        updateDB();
      }
    });
  });
};

let consultDB = async (element_) => {
  let element = element_;
  let id = element.getAttribute("id");
  try {
    let resDB = await (await fetch(`${pokemonUriDB}${endPokemonDB}`)).json();
    let dataPokemon;
    resDB.map((data) => {
      if (data.title === id) {
        dataPokemon = data;
      }
    });
    return dataPokemon;
  } catch (error) {
    console.log("ERROR: ", error);
  }
};

let updateStats = ()=>{
  console.log("SE EJECUTA UPDATE STATS")
  let containerStats = document.querySelector(".swal2-html-container");

  if (listUpdateStats === null) {
    let updatedStats = [];
    let inputRanges = document.querySelectorAll(".swal2-container input[type='range']");

    inputRanges.forEach((inputRange) => {
      let statValue = Number(inputRange.value);
      let statName = inputRange.nextElementSibling.textContent.split(' ')[1];
      updatedStats.push({ name: statName, value: statValue });
    });

    listUpdateStats = updatedStats;
    console.log("listUpdateStats", listUpdateStats)
  }
  
  containerStats.addEventListener("input", (e) => {

    let updatedStats = [];
    let inputRanges = document.querySelectorAll(".swal2-container input[type='range']");

    if (e.target.type === "range") {
      const label = e.target.nextElementSibling; // Obtener el elemento de etiqueta siguiente al input
      label.innerHTML = `<b>${e.target.value}</b> ${label.textContent.split(' ')[1]}`;

      inputRanges.forEach((inputRange) => {
        let statValue = Number(inputRange.value);
        let statName = inputRange.nextElementSibling.textContent.split(' ')[1];
        updatedStats.push({ name: statName, value: statValue });
      });
    }
    
    listUpdateStats = updatedStats;
    console.log("listUpdateStats", listUpdateStats)

  });
}

let updateDB = ()=>{  
  console.log("SE EJECUTA UPDATE DB")
  let buttonConfirm = document.querySelector(".swal2-confirm");
  let title = document.querySelector(".swal2-title").textContent;
  let imageUrl = document.querySelector(".swal2-image").getAttribute("src");
  let html = {}

  listUpdateStats.map((data)=>{
    let {name, value} = data;
    html[name] = value;
  });

  listUpdateStats = { title, imageUrl, html };

  buttonConfirm.addEventListener("click", async()=>{

    if (listUpdateStats) {
      let config = {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          title: title,
          imageUrl: imageUrl,
          html: html
        })
      }
      let res = await(await fetch(`${pokemonUriDB}${endPokemonDB}`, config)).json();
      console.log(res)
    }
    
  });
};