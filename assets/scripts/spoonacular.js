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
    var apiKey = "f333b11c932045d8a56e644e90f0821c";
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
    // Create the card container
    var card = document.createElement("div");
    card.classList.add("recipe-card");

    // Create the card image
    var image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.title;
    image.classList.add("recipe-image");
    card.appendChild(image);

    // Create the card content
    var content = document.createElement("div");
    content.classList.add("recipe-content");
    card.appendChild(content);

    // Create the title element
    var title = document.createElement("h5");
    title.textContent = recipe.title;
    title.classList.add("recipe-title");
    content.appendChild(title);

    // Create the "View" button
    var viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.classList.add("view-button");
    viewButton.addEventListener("click", function () {
      displayRecipeDetails(recipe);
    });
    content.appendChild(viewButton);

    // Return the completed card
    return card;
  }

  // Function to display recipe details in a modal
  function displayRecipeDetails(recipe) {
    // Create the modal container
    var modal = document.createElement("div");
    modal.classList.add("modal");

    // Create the modal content
    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Create the modal title
    var modalTitle = document.createElement("h3");
    modalTitle.textContent = recipe.title;

    // Create the modal image
    var modalImage = document.createElement("img");
    modalImage.src = recipe.image;
    modalImage.alt = recipe.title;

    // Create the modal ingredients
    var modalIngredients = document.createElement("ul");
    modalIngredients.classList.add("modal-ingredients");
    recipe.ingredients.forEach(function (ingredient) {
      var listItem = document.createElement("li");
      listItem.textContent = ingredient;
      modalIngredients.appendChild(listItem);
    });

    // Append modal elements
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalImage);
    modalContent.appendChild(modalIngredients);
    modal.appendChild(modalContent);

    // Add close button to the modal
    var closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function () {
      modal.remove(); // Remove the modal from the DOM
    });
    modalContent.appendChild(closeButton);

    // Append modal to the document body
    document.body.appendChild(modal);
  }
});
