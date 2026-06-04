/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

// Get References
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const addIngredientSubmitButton = document.getElementById("add-ingredient-submit-button");

const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const deleteIngredientSubmitButton = document.getElementById("delete-ingredient-submit-button");

const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

addIngredientSubmitButton.addEventListener("click", addIngredient);

deleteIngredientSubmitButton.addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */

const ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
window.addEventListener("DOMContentLoaded", getIngredients)

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    //Get input
    const addIngredientValue = addIngredientNameInput.value.trim();
    const token = sessionStorage.getItem("auth-token"); // Session token

    // Validate
    if (!addIngredientValue){
        alert("No ingredient added!");
        return;
    }

    // Ingredient object
    const newIngredient = {
        ingredients: addIngredientValue
    }

    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(newIngredient)
    };

    // Fetch logic
    try{
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        if (response.status === 201){
            // On success: 
            // 1. clear inputs
            addIngredientNameInput.value ="";

            getIngredients();
            refreshIngredientList();
            
        
        }else{
            alert("Could not add ingredient");
        }

    }catch(error){
        console.log("Error", error);
         alert(error);
    }

}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    const token = sessionStorage.getItem("auth-token"); // Session token

    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    };

    // Fetch logic
    try{
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        ingredients = await response.json();

        if (response.status === 201){
            // On success: 
            // 1. clear inputs
            addIngredientNameInput.value ="";

            refreshIngredientList();
            
        
        }else{
            alert("Could not add ingredient");
        }

    }catch(error){
        console.log("Error", error);
         alert(error);
    }


}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const deleteIngredientValue = deleteIngredientNameInput.value.trim();
    const token = sessionStorage.getItem("auth-token"); // Session token

    // Validate
    if (!deleteIngredientValue){
        alert("No ingredient added!");
        return;
    }

    const deleteRequestOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    };

    // Fetch logic
    try{
        const ingredientToDelete = ingredients.find(
            ingredient => ingredient.name === deleteIngredientValue
        );

        if (!ingredientToDelete) {
            alert("Ingredient not found");
            return;
        }

        const response = await fetch(
            `${BASE_URL}/ingredients/${ingredientToDelete.id}`,
            deleteRequestOptions
        );

        if (response.status === 200) {

            deleteIngredientNameInput.value = "";

            await getIngredients();

        } else {
            alert("Could not delete ingredient");
        }

    }catch(error){
        console.log("Error", error);
         alert(error);
    }

}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML= "";

    // Create <li> elements
    for (const ingredient of ingredients ){
        // Create list item
        const listItem = document.createElement("li");

        // add name and instrunction to list item
        listItem.appendChild(document.createElement("p")).textContent = `Ingredient Name : ${ingredient.name}\n`;

        // add list item to un ordered list <ul>
        ingredientListContainer.appendChild(listItem);

    }

}
