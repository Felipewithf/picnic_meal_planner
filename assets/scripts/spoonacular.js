// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Get the search button element
  var searchBtn = document.getElementById("search-recipes-btn");

  // Add a click event listener to the search button
  searchBtn.addEventListener("click", searchRecipes);

  // Function to handle recipe search
  function searchRecipes() {
    // Get the user input for the recipe
    var recipeInput = document.getElementById("recipe-input").value;

    // Get the element to display recipe results
    var recipeResults = document.getElementById("recipe-results");

    // Clear previous search results
    recipeResults.innerHTML = "";

    // API configuration
    var apiKey = "68dfc415d3384f629db4dbe0916db7cb";
    var searchUrl = "https://api.spoonacular.com/recipes/complexSearch";
    var recipeUrl =
      "https://api.spoonacular.com/recipes/{recipeId}/information";
    var params = {
      apiKey: apiKey,
      query: recipeInput,
      number: 3, // Number of recipes to retrieve
    };

    //The search request URL
    var searchQueryString = Object.keys(params)
      .map(function (key) {
        return key + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
    var searchRequestUrl = searchUrl + "?" + searchQueryString;

    // Fetch the recipes based on the search query
    fetch(searchRequestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Fetch recipe details for each recipe
        var recipePromises = data.results.map(function (recipe) {
          var recipeDetailsUrl =
            recipeUrl.replace("{recipeId}", recipe.id) + "?apiKey=" + apiKey;
          return fetch(recipeDetailsUrl)
            .then(function (response) {
              return response.json();
            })
            .then(function (recipeData) {
              // Add ingredients to the recipe object
              recipe.ingredients = recipeData.extendedIngredients.map(function (
                ingredient,
              ) {
                return ingredient.original;
              });
              return recipe;
            });
        });

        // Resolve all recipe promises
        return Promise.all(recipePromises);
      })
      .then(function (recipeDetails) {
        // Display search results as cards in recipe-results div
        recipeDetails.forEach(function (recipe) {
          var recipeCard = createRecipeCard(recipe);
          recipeResults.appendChild(recipeCard);
        });
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  }

  // Function to create a recipe card
  function createRecipeCard(recipe) {
    var card = document.createElement("div");
    card.classList.add("recipe-card");

    // Recipe image
    var image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.title;
    card.appendChild(image);

    // Recipe content
    var content = document.createElement("div");
    content.classList.add("recipe-content");
    card.appendChild(content);

    // Recipe title
    var title = document.createElement("h5");
    title.textContent = recipe.title;
    content.appendChild(title);

    // Recipe ingredients
    var ingredientsTitle = document.createElement("h6");
    ingredientsTitle.textContent = "Ingredients:";
    content.appendChild(ingredientsTitle);

    var ingredients = document.createElement("ul");
    ingredients.classList.add("recipe-ingredients");
    recipe.ingredients.forEach(function (ingredient) {
      var listItem = document.createElement("li");
      listItem.textContent = ingredient;
      ingredients.appendChild(listItem);
    });
    content.appendChild(ingredients);

    return card;
  }
});
