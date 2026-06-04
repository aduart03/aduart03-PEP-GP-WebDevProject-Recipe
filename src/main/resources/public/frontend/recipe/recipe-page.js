/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */

    // Add
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addRecipeButton = document.getElementById("add-recipe-submit-input");

    // Update
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateRecipeButton = document.getElementById("update-recipe-submit-input");

    // Delete
    const deleteRecipeInput = document.getElementById("delete-recipe-name-input");
    const deleteRecipeButton = document.getElementById("delete-recipe-submit-input");

    // List container
    const listRecipes = document.getElementById("recipe-list");

    // Admin link and logout button
    const adminLink = document.getElementById("admin-link");
    const adminLogoutButton = document.getElementById("logout-button");

    // Search Recipes
    const searchRecipeInput = document.getElementById("search-input");
    const searchRecipeButton = document.getElementById("search-button");
    

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token") ){
        adminLogoutButton.hidden = false;
    }
    

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     * Remember: The type value for "is-admin" is boolean (true or false)
     */
    if(sessionStorage.getItem("is-admin") === "true"){
        adminLink.hidden = false;
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeButton.addEventListener("click",addRecipe);

    updateRecipeButton.addEventListener("click", updateRecipe);

    deleteRecipeButton.addEventListener("click", deleteRecipe);

    searchRecipeButton.addEventListener("click",searchRecipes);

    adminLogoutButton.addEventListener("click",processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        // AAA - Arrange, Act, Assert
        // read sarch term, get the value: we will use later
        const searchTerm = searchRecipeInput.value.trim();
    
        // Validate recipe was input
        if (!searchTerm){
            alert("Please enter recipe name");
            return;
        }

        // Get request object 
        const requestOption = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }

        try{
            // build url -> get request
            const response = await fetch(`${BASE_URL}/recipes?name=${searchTerm}`, requestOption);
            
            refreshRecipeList();

        }catch(error){
            console.log("Error", error); alert(error);
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        // Get values
        const addNameFormInputs = addRecipeNameInput.value.trim();
        const addInstructionsFormInputs = addRecipeInstructionsInput.value.trim();
        const token = sessionStorage.getItem("auth-token");

        // Validate name and instructions
        if (!addNameFormInputs || !addInstructionsFormInputs){
            alert("Name or Instructions not procided. Input name and instructions for recipe!");
            return;
        }
        if (!token){
            alert("Please login first.");
            return;

        }

        // Create new recipe object
        const newRecipe={
            name : addNameFormInputs,
            instructions: addInstructionsFormInputs
        }

        // Create POST request object
        // Authorize (use Authorization header) token
        // 'Authorization' field found in Recipe controller
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
            body: JSON.stringify(newRecipe)
        };


        // Fetch logic
        try{
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
            if (response.status === 201){
                // On success: 
                // 1. clear inputs
                addRecipeNameInput.value ="";
                addRecipeInstructionsInput.value = "";

                // 2. fetch latest recipes
                await getRecipes();

                // 3. refresh the list
                refreshRecipeList();
                
            
            }else if (response.status === 401){
                alert("User not authorized");
                
            }else{
                alert("Unknown issue");
            }

        }catch(error){
            console.log("Error", error);
             alert(error);
        }

    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        // Fetch logic
        // No build request object needed to create but better if built for integrity and control.
        // Default request is 'Get' method.

        // Get request object 
        const requestOption = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }
    
        try{
            const response = await fetch(`${BASE_URL}/recipes`, requestOption); // returns response object
            if (response.status === 200){
                // On success:    
                recipes = await response.json(); 
                refreshRecipeList();
            
            }else if (response.status === 404){
                alert("No Recipes found");
                
            }else{
                alert("Unknown issue");
            }

        }catch(error){
            console.log("Error", error);
             alert(error);
        }


    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        // Clear current list (get rid of child elelments -> <li>'s)
        listRecipes.innerHTML = "";

        // Create <li> elements
        for (const recipe of recipes ){
            // Create list item
            const listItem = document.createElement("li");

            // add name and instrunction to list item
            listItem.textContent = `Recipe: ${recipe.name}\nInstructions: ${recipe.instructions}`;

            // add list item to un ordered list <ul>
            listRecipes.appendChild(listItem);

        }
        

    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
    }

});
