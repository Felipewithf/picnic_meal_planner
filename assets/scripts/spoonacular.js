document.addEventListener("DOMContentLoaded", function () {
  // Search button event listener
  var searchBtn = document.getElementById("search-recipes-btn");
  searchBtn.addEventListener("click", searchRecipes);

  function searchRecipes() {
    // Retrieve the recipe input and clear the recipe results
    var recipeInput = document.getElementById("recipe-input").value;
    var recipeResults = document.getElementById("recipe-results");
    recipeResults.innerHTML = "";

    // Set the API key and URLs
    var apiKey = "f333b11c932045d8a56e644e90f0821c";
    var searchUrl = "https://api.spoonacular.com/recipes/complexSearch";
    var recipeUrl =
      "https://api.spoonacular.com/recipes/{recipeId}/information";

    // Set the search parameters
    var params = {
      apiKey: apiKey,
      query: recipeInput,
      number: 3,
    };

    // Build the search query string
    var searchQueryString = Object.keys(params)
      .map(function (key) {
        return key + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
    var searchRequestUrl = searchUrl + "?" + searchQueryString;

    // Perform the search request
    fetch(searchRequestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Process the recipe details
        var recipePromises = data.results.map(function (recipe) {
          var recipeDetailsUrl =
            recipeUrl.replace("{recipeId}", recipe.id) + "?apiKey=" + apiKey;
          return fetch(recipeDetailsUrl)
            .then(function (response) {
              return response.json();
            })
            .then(function (recipeData) {
              recipe.ingredients = recipeData.extendedIngredients.map(function (
                ingredient,
              ) {
                return ingredient.original;
              });
              return recipe;
            });
        });

        return Promise.all(recipePromises);
      })
      .then(function (recipeDetails) {
        // Display the recipe details
        recipeDetails.forEach(function (recipe) {
          var card = createRecipeCard(recipe);
          recipeResults.appendChild(card);
        });
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  }

  // Create recipe card
  function createRecipeCard(recipe) {
    // Create the recipe card element
    var card = document.createElement("div");
    card.classList.add("recipe-card");
    card.dataset.id = recipe.id;

    // Create the image element
    var image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.title;
    image.classList.add("recipe-image");
    card.appendChild(image);

    // Create the content element
    var content = document.createElement("div");
    content.classList.add("recipe-content");
    card.appendChild(content);

    // Create the title element
    var title = document.createElement("h5");
    title.textContent = recipe.title;
    title.classList.add("recipe-title");
    content.appendChild(title);

    // Create the view button
    var viewButton = document.createElement("button");
    viewButton.textContent = "View Recipe";
    viewButton.classList.add("view-button");
    viewButton.addEventListener("click", function () {
      displayRecipeDetails(recipe);
    });
    content.appendChild(viewButton);

    // Set the draggable attribute
    card.draggable = true;
    card.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", recipe.id);
    });

    return card;
  }

  // Delete recipe card
  function deleteRecipeCard(card) {
    card.remove();
  }

  // Display recipe details
  function displayRecipeDetails(recipe) {
    var modal = document.createElement("div");
    modal.classList.add("modal");

    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    var modalTitle = document.createElement("h3");
    modalTitle.textContent = recipe.title;

    var modalImage = document.createElement("img");
    modalImage.src = recipe.image;
    modalImage.alt = recipe.title;

    var modalIngredients = document.createElement("ul");
    modalIngredients.classList.add("modal-ingredients");
    recipe.ingredients.forEach(function (ingredient) {
      var listItem = document.createElement("li");
      listItem.textContent = ingredient;
      modalIngredients.appendChild(listItem);
    });

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalImage);
    modalContent.appendChild(modalIngredients);
    modal.appendChild(modalContent);

    var closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function () {
      modal.remove();
    });
    modalContent.appendChild(closeButton);

    document.body.appendChild(modal);
  }

  // Handle drop event
  function handleDrop(event) {
    event.preventDefault();

    var recipeId = event.dataTransfer.getData("text/plain");
    var recipeCard = document.querySelector(
      ".recipe-card[data-id='" + recipeId + "']",
    );

    if (recipeCard) {
      var dropZone = event.target.closest(".drop-zone");

      if (dropZone) {
        dropZone.appendChild(recipeCard);

        // Add delete button dynamically
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function () {
          deleteRecipeCard(recipeCard);
        });
        recipeCard.querySelector(".recipe-content").appendChild(deleteButton);

        var recipeDetails = getRecipeDetails(recipeId);
        displayRecipeDetails(recipeDetails);
      }
    }
  }

  // Handle drag over event
  function handleDragOver(event) {
    event.preventDefault();
    var dropZone = event.target.closest(".drop-zone");
    if (dropZone) {
      dropZone.classList.add("dragover");
    }
  }

  // Handle drag leave event
  function handleDragLeave(event) {
    var dropZone = event.target.closest(".drop-zone");
    if (dropZone) {
      dropZone.classList.remove("dragover");
    }
  }

  var dropZones = document.querySelectorAll(".drop-zone");
  dropZones.forEach(function (dropZone) {
    // Add event listeners for drop zone
    dropZone.addEventListener("drop", handleDrop);
    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragleave", handleDragLeave);
  });
});
