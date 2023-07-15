document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the search button element
  var searchBtn = document.getElementById("search-recipes-btn");
  searchBtn.addEventListener("click", searchRecipes);

  // Array to store recipe cards
  var recipeCards = [];

  // Object to map recipe cards to days of the week
  var recipeCardMap = {
    MON: [],
    TUE: [],
    WED: [],
    THUR: [],
    FRI: [],
    SAT: [],
    SUN: [],
  };

  // Function to handle recipe search
  function searchRecipes() {
    // Retrieve the recipe input and clear the recipe results
    var recipeInput = document.getElementById("recipe-input").value;
    var recipeResults = document.getElementById("recipe-results");
    recipeResults.innerHTML = "";

    // Set the API key and URLs
    var apiKey = "7c607f931c8643b38454af560516623b";
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
        // Display the recipe details
        data.results.forEach(function (recipe) {
          var card = createRecipeCard(recipe);
          recipeResults.appendChild(card);
        });
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  }

  // Function to create a recipe card
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
      fetchRecipeDetails(recipe.id);
    });
    content.appendChild(viewButton);

    // Create the delete button
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      deleteRecipeCard(card);
    });
    content.appendChild(deleteButton);

    // Set the draggable attribute
    card.draggable = true;
    card.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", recipe.id);
    });

    recipeCards.push(card);

    return card;
  }

  // Function to delete a recipe card
  function deleteRecipeCard(card) {
    var recipeId = card.dataset.id;

    for (var key in recipeCardMap) {
      var index = recipeCardMap[key].findIndex(function (card) {
        return card.dataset.id === recipeId;
      });

      if (index !== -1) {
        recipeCardMap[key].splice(index, 1);
        localStorage.setItem(
          key,
          JSON.stringify(
            recipeCardMap[key].map(function (card) {
              return card.dataset.id;
            }),
          ),
        );
      }
    }

    card.remove();
  }

  // Function to fetch recipe details including ingredients
  function fetchRecipeDetails(recipeId) {
    var apiKey = "7c607f931c8643b38454af560516623b";
    var recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(recipeUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (recipeData) {
        var ingredients = recipeData.extendedIngredients.map(function (
          ingredient,
        ) {
          return ingredient.original;
        });

        displayRecipeDetails(recipeData.title, recipeData.image, ingredients);
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  }

  // Function to display recipe details in a modal
  function displayRecipeDetails(title, image, ingredients) {
    var modal = document.createElement("div");
    modal.classList.add("modal");

    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    var modalTitle = document.createElement("h3");
    modalTitle.textContent = title;

    var modalImage = document.createElement("img");
    modalImage.src = image;
    modalImage.alt = title;

    var modalIngredients = document.createElement("ul");
    modalIngredients.classList.add("modal-ingredients");
    ingredients.forEach(function (ingredient) {
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

  // Function to handle the drop event
  function handleDrop(event) {
    event.preventDefault();

    var recipeId = event.dataTransfer.getData("text/plain");
    var recipeCard = document.querySelector(
      ".recipe-card[data-id='" + recipeId + "']",
    );

    if (recipeCard) {
      var dropZone = event.target.closest(".drop-zone");

      if (dropZone) {
        var currentDropZone = recipeCard.closest(".drop-zone");
        if (currentDropZone) {
          var deleteButton = currentDropZone.querySelector(".delete-button");
          recipeCardMap[currentDropZone.id].splice(
            recipeCardMap[currentDropZone.id].indexOf(recipeCard),
            1,
          );
          if (deleteButton) {
            deleteButton.remove();
          }
        }

        dropZone.appendChild(recipeCard);
        recipeCardMap[dropZone.id].push(recipeCard);

        // Create the delete button
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function () {
          deleteRecipeCard(recipeCard);
        });
        recipeCard.querySelector(".recipe-content").appendChild(deleteButton);
      }
    }

    saveRecipesToLocalStorage();
  }

  // Function to handle the drag over event
  function handleDragOver(event) {
    event.preventDefault();
    var dropZone = event.target.closest(".drop-zone");
    if (dropZone) {
      dropZone.classList.add("dragover");
    }
  }

  // Function to handle the drag leave event
  function handleDragLeave(event) {
    var dropZone = event.target.closest(".drop-zone");
    if (dropZone) {
      dropZone.classList.remove("dragover");
    }
  }

  // Add event listeners for drop zones
  var dropZones = document.querySelectorAll(".drop-zone");
  dropZones.forEach(function (dropZone) {
    dropZone.addEventListener("drop", handleDrop);
    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragleave", handleDragLeave);
  });

  // Function to save recipe cards to local storage
  function saveRecipesToLocalStorage() {
    for (var key in recipeCardMap) {
      var recipeIds = recipeCardMap[key].map(function (recipeCard) {
        return recipeCard.dataset.id;
      });
      localStorage.setItem(key, JSON.stringify(recipeIds));
    }
  }

  // Function to load saved recipe cards from local storage
  function loadSavedRecipes() {
    for (var key in recipeCardMap) {
      if (localStorage.getItem(key)) {
        var recipeIds = JSON.parse(localStorage.getItem(key)) || [];
        recipeIds.forEach(function (recipeId) {
          // Check if the recipe card already exists
          var existingCard = recipeCards.find(function (card) {
            return card.dataset.id === recipeId;
          });

          // If the card doesn't exist, render it
          if (!existingCard) {
            var recipeCard = renderCard(recipeId, key);
            if (recipeCard) {
              recipeCardMap[key].push(recipeCard);
              var dropZone = document.getElementById(key);
              dropZone.appendChild(recipeCard);
            }
          }
        });
      } else {
        localStorage.setItem(key, JSON.stringify([]));
      }
    }
  }

  // Function to render a recipe card based on the recipe ID and key
  function renderCard(recipeId, keyID) {
    var apiKey = "7c607f931c8643b38454af560516623b";
    var recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(recipeUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (recipeData) {
        var card = createRecipeCard(recipeData);
        var dropZone = document.getElementById(keyID);
        if (dropZone) {
          dropZone.appendChild(card);
          recipeCardMap[dropZone.id].push(card);
        }
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  }

  // Function to check if a recipe ID exists in local storage for a given key
  function storageCheck(recipeID, keyID) {
    var recipeIds = JSON.parse(localStorage.getItem(keyID)) || [];
    return recipeIds.includes(recipeID);
  }

  // Load saved recipes on page load
  loadSavedRecipes();
});
