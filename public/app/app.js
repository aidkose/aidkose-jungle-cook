// !FIREBASE FORM /////////////////////////////////////////
var _db = '';
var userExists = false;
var userFullName = '';
var _userProfileInfo = {};
// var currentRecipe = {};

function initFirebase() {
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			_db = firebase.firestore();
			console.log('auth change Logged In');
			if (user.displayName) {
				$('#fName-nav-header').html(user.displayName);
				$('.sign-out-btn').show();
				$('.nav-login-btn').hide();
				$('#create-recipes-header').html(
					`Hey ${user.displayName}, create your recipe!`
				);
				$('#your-recipes-header').html(
					`Hey ${user.displayName}, here are your recipes!`
				);
				$('#edit-recipes-header').html(
					`Hey ${user.displayName}, edit your recipe!`
				);
			}
			// $(".load").prop("disabled", false);
			userExists = true;
		} else {
			_db = '';
			_userProfileInfo = {};
			console.log('auth change Logged Out');
			$('#fName-nav-header').html('');
			// $(".load").attr("disabled", true);
			$('.nav-login-btn').show();
			$('.sign-out-btn').hide();
			$('.your-recipes').hide();
			userExists = false;
			userFullName = '';
		}
	});
}

function signOut() {
	firebase
		.auth()
		.signOut()
		.then(() => {
			console.log('Signed out');
			alert('Come back soon!');
		})
		.catch((error) => {
			console.log('Error signing out ' + errorMessage);
		});
}

function login() {
	let email = $('#login-email').val();
	let password = $('#login-password').val();
	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			var user = userCredential.user;
			console.log('Logged In');
			alert('Welcome back chef!');
			$('.nav-login-btn').hide();
			$('.sign-out-btn').show();
			$('.your-recipes').show();
			$('#login-email').val('');
			$('#login-password').val('');
			_db
				.collection('Users')
				.doc(user.uid)
				.get()
				.then((doc) => {
					console.log(doc.data());
					_userProfileInfo = doc.data();
					console.log('login user info', _userProfileInfo);
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					alert('Whoops! Something went wrong! ' + errorMessage);
				});
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert('Whoops! Something went wrong! ' + errorMessage);
		});
}

function createAccount() {
	let fName = $('#fName').val();
	let lName = $('#lName').val();
	let email = $('#email').val();
	let password = $('#password').val();
	let fullName = fName + ' ' + lName;
	$('#fName-nav-header').html(fName);
	let userObj = {
		firstName: fName,
		lastName: lName,
		email: email,
		recipes: [],
	};
	console.log(
		'Account Details: ' + fName + ' ' + lName + ' ' + email + ' ' + password
	);

	firebase
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			var user = userCredential.user;
			console.log('created account');
			alert(`Thank you for creating an account! Welcome to the kitchen!`);
			$('.nav-login-btn').hide();
			$('.sign-out-btn').show();
			$('.your-recipes').show();
			firebase.auth().currentUser.updateProfile({
				displayName: fName,
			});

			_db
				.collection('Users')
				.doc(user.uid)
				.set(userObj)
				.then(() => {
					console.log('doc added');
					_userProfileInfo = userObj;
					console.log('create userInfo', _userProfileInfo);
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log('create error ' + errorMessage);
				});
			userFullName = fullName;
			$('#fName-nav-header').html(userFullName);
			$('#fName').val('');
			$('#lName').val('');
			$('#email').val('');
			$('#password').val('');
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log('create error ' + errorMessage);
		});
}

// function signIn() {
//   firebase
//     .auth()
//     .signInAnonymously()
//     .then(() => {
//       console.log("Signed in");
//     })

//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       console.log("Error signing in " + errorMessage);
//     });
// }
// !FIREBASE FORM /////////////////////////////////////////
//
//
//
// !JSON ARRAY (BROWSE PAGE) //////////////////////////////
var RECIPES = [
	{
		recipeImage: 'recipe-pizza.jpg',
		recipeName: 'Supreme Pizza',
		recipeDescription:
			'Make pizza night super duper out of this world with homemade pizza. This recipe is supreme with vegetables and two types of meat. Yum!',
		recipeTime: '1h 24min',
		recipeServing: '4 servings',
		ingredientOne: '1/4 batch pizza dough',
		ingredientTwo: '2 tablespoons Last-Minute Pizza Sauce',
		ingredientThree: '10 slices pepperoni',
		ingredientFour: '1 cup cooked and crumbled Italian sausage',
		ingredientFive: '2 large mushrooms, sliced',
		ingredientSix: '1/4 bell pepper, sliced',
		ingredientSeven: '1 tablespoon sliced black olives',
		ingredientEight: '1 cup shredded mozzarella cheese',
		instructionOne:
			'Preheat the oven to 475°. Spray pizza pan with nonstick cooking or line a baking sheet with parchment paper.',
		instructionTwo:
			'Flatten dough into a thin round and place on the pizza pan.',
		instructionThree: 'Spread pizza sauce over the dough.',
		instructionFour: 'Layer the toppings over the dough in the order listed.',
		instructionFive:
			'Bake for 8 to 10 minutes or until the crust is crisp and the cheese melted and lightly browned.',
	},
	{
		recipeImage: 'recipe-burger.jpg',
		recipeName: 'Classic Burger',
		recipeDescription:
			'Sink your teeth into a delicious restaurant-style, hamburger recipe made from lean beef. Skip the prepackaged patties and take the extra time to craft up your own, and that little extra effort will be worth it.',
		recipeTime: '30 min',
		recipeServing: '4 servings',
		ingredientOne: '6lbs of ground beef',
		ingredientTwo: '16 poppyseed buns',
		ingredientThree: 'A head of lettuce',
		ingredientFour: '8 slices of tomatoe',
		ingredientFive: '8 slices of cheese',
		ingredientSix: '20 strips of bacon (optional)',
		ingredientSeven: 'A bottle of ketchup',
		ingredientEight: 'A bottle of mustard',
		instructionOne: 'Fire up the grill to 400 degrees',
		instructionTwo: 'Divide ground beef and flatten into patties',
		instructionThree: 'Cook until brown on the outside',
		instructionFour: 'Add toppings',
		instructionFive: 'Enjoy!',
	},
	{
		recipeImage: 'recipe-pilaf.jpg',
		recipeName: 'Chicken Biryani',
		recipeDescription:
			'Chicken Biryani is a bold and flavorful Indian dish with crazy tender bites of chicken with bell peppers in a deliciously spiced and fragrant rice.',
		recipeTime: '1h 15min',
		recipeServing: '6 servings',
		ingredientOne: '3lbs of chicken',
		ingredientTwo: 'Brown rice',
		ingredientThree: 'Sliced carrots',
		ingredientFour: 'Rice',
		ingredientFive: 'Spices',
		ingredientSix: 'Cheese',
		ingredientSeven: 'Basil',
		ingredientEight: 'Seasoning',
		instructionOne: 'Cook and season chicken',
		instructionTwo: 'Cook rice',
		instructionThree: 'Mix it in a bowl',
		instructionFour: 'Add toppings',
		instructionFive: 'Enjoy!',
	},
	{
		recipeImage: 'recipe-chowmein.jpg',
		recipeName: 'Ch. Chow Mein',
		recipeDescription:
			'A great Chow Mein comes down to the sauce - it takes more than just soy sauce and sugar! Jam packed with a surprising amount of hidden vegetables, customize this Chicken Chow Mein recipe using your protein of choice!',
		recipeTime: '20 min',
		recipeServing: '4 servings',
		ingredientOne: '3lbs of chicken',
		ingredientTwo: 'Noodles',
		ingredientThree: 'Green beans',
		ingredientFour: 'Carrots',
		ingredientFive: 'Bell peppers',
		ingredientSix: 'Green onion',
		ingredientSeven: 'Basil',
		ingredientEight: 'Powedered cheese',
		instructionOne: 'Cook and season chicken',
		instructionTwo: 'Cook noodles',
		instructionThree: 'Mix it in a bowl',
		instructionFour: 'Add toppings',
		instructionFive: 'Enjoy!',
	},
];

function closeWindow() {
	console.log('Window Closed');
	$('#app').html(`
  <div class="browse">
  <div id="recipe-header">Recipes: Try some today!</div>
    <div class="browse-content">
    </div>
  </div>`);
	defaultRecipes();
}

function defaultRecipes() {
	$.each(RECIPES, function (index, recipe) {
		$('.browse-content').append(`<div id="${index}"class="browse-wrapper">
    <div class="recipe-wrapper">
      <div class="recipe-card">
        <img src="../images/${recipe.recipeImage}" alt="" />
        <div class="description">
          <h4>${recipe.recipeName}</h4>
          <p>
            ${recipe.recipeDescription}
          </p>
          <div class="details">
            <div class="time">
              <img src="../images/time.svg" alt="" />
              <p>${recipe.recipeTime}</p>
            </div>
            <div class="serving">
              <img src="../images/servings.svg" alt="" />
              <p>${recipe.recipeServing}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`);
		defaultRecipeDetails();
	});
}

function defaultRecipeDetails() {
	$('.browse-wrapper').click(function (e) {
		let recipeList = e.currentTarget.id;
		console.log('clicked ' + recipeList);
		$('#app').html(`<div class="details-page">  <div class="details-top">
    <div class="details-img">
      <h3 class="title">${RECIPES[recipeList].recipeName}</h3>
      <img src="../images/${RECIPES[recipeList].recipeImage}" alt="" />
    </div>
    <div class="top-text">
      <h2>Description:</h2>
      <p>
        ${RECIPES[recipeList].recipeDescription}
      </p>
      <h3>Total Time:</h3>
      <p>${RECIPES[recipeList].recipeTime}</p>
      <h3>Servings:</h3>
      <p>${RECIPES[recipeList].recipeServing}</p>
    </div>
  </div>
  <div class="details-mid">
    <h2>Ingredients:</h2>
    <p>${RECIPES[recipeList].ingredientOne}</p>
    <p>${RECIPES[recipeList].ingredientTwo}</p>
    <p>${RECIPES[recipeList].ingredientThree}</p>
    <p>${RECIPES[recipeList].ingredientFour}</p>
    <p>${RECIPES[recipeList].ingredientFive}</p>
    <p>${RECIPES[recipeList].ingredientSix}</p>
    <p>${RECIPES[recipeList].ingredientSeven}</p>
    <p>${RECIPES[recipeList].ingredientEight}</p>
  </div>
  <div class="details-bottom">
    <h2>Instructions:</h2>
    <ol>
      <li>${RECIPES[recipeList].instructionOne}</li>
      <li>${RECIPES[recipeList].instructionTwo}</li>
      <li>${RECIPES[recipeList].instructionThree}</li>
      <li>${RECIPES[recipeList].instructionFour}</li>
      <li>${RECIPES[recipeList].instructionFive}</li>
    </ol>
    <div class="btns-wrapper">
      <div class="backBtn" onclick="closeWindow()">Go Back</div>
      <div class="editBtn">Edit Recipe</div>
    </div>
   </div>
  </div>`);
	});
}
// !JSON ARRAY (BROWSE PAGE) //////////////////////////////
//
//
//
// !USER RECIPES //////////////////////////////////////////
// function createUserRecipe() {
// 	let userImg = $('#attach').val();
// 	let userRecipeName = $('#create-recipe-name').val();
// 	let userDesc = $('#create-recipe-desc').val();
// 	let userTime = $('#create-recipe-time').val();
// 	let userServing = $('#create-recipe-serving').val();
// 	let userIngredientOne = $('#userIngredient1').val();
// 	let userIngredientTwo = $('#userIngredient2').val();
// 	let userIngredientThree = $('#userIngredient3').val();
// 	// let userIngredientFour = $("#userIngredient4").val();
// 	// let userIngredientFive = $("#userIngredient5").val();
// 	// let userIngredientSix = $("#userIngredient6").val();
// 	// let userIngredientSeven = $("#userIngredient7").val();
// 	// let userIngredientEight = $("#userIngredient8").val();
// 	let userInstructionOne = $('#userInstruction1').val();
// 	let userInstructionTwo = $('#userInstruction2').val();
// 	let userInstructionThree = $('#userInstruction3').val();
// 	// let userInstructionFour = $("#userInstruction4").val();
// 	// let userInstructionFive = $("#userInstruction5").val();

// 	let userRecipeObj = {
// 		recipeImage: userImg,
// 		recipeName: userRecipeName,
// 		recipeDescription: userDesc,
// 		recipeTime: userTime,
// 		recipeServing: userServing,
// 		ingredientOne: userIngredientOne,
// 		ingredientTwo: userIngredientTwo,
// 		ingredientThree: userIngredientThree,
// 		// ingredientFour: "",
// 		// ingredientFive: "",
// 		// ingredientSix: "",
// 		// ingredientSeven: "",
// 		// ingredientEight: "",
// 		instructionOne: userInstructionOne,
// 		instructionTwo: userInstructionTwo,
// 		instructionThree: userInstructionThree,
// 		// instructionFour: "",
// 		// instructionFive: "",
// 	};

// 	console.log(userRecipeObj);
// 	_userProfileInfo.recipes.push(userRecipeObj);
// 	updateUser(_userProfileInfo);
// 	userRecipes();

// 	$('#create-recipe-img').val('');
// 	$('#create-recipe-name').val('');
// 	$('#create-recipe-desc').val('');
// 	$('#create-recipe-time').val('');
// 	$('#create-recipe-serving').val('');
// 	$('#userIngredient1').val('');
// 	$('#userIngredient2').val('');
// 	$('#userIngredient3').val('');
// 	$('#userInstruction1').val('');
// 	$('#userInstruction2').val('');
// 	$('#userInstruction3').val('');
// }

// function closeUserWindow() {}

// function getUserRecipes() {
// 	// * get recipes from firebase then loop through that info and put it back on the page
// }

// function getUserRecipeDetails() {}

// function deleteUserRecipes() {}
// !USER RECIPES //////////////////////////////////////////
//
//
//
// !ADDING INGREDIENTS/INSTRUCTIONS
let ingredientIndex = 3;
let instructionIndex = 3;

function addIngredient() {
	$('.form-two').append(
		`<input class="userIngredient$(ingredientIndex)" placeholder="Ingredient # ${
			ingredientIndex + 1
		}" type="text">`
	);

	ingredientIndex++;
}

function addInstruction() {
	$('.form-three').append(
		`<input class="userInstruction$(instructionIndex)" placeholder="Instruction # ${
			instructionIndex + 1
		}" type="text">`
	);

	instructionIndex++;
}
// !ADDING INGREDIENTS/INSTRUCTIONS
//
//
//
// !MOBILE NAV ////////////////////////////////////////////
function initListeners() {
	$('.mobile-nav').click(function (e) {
		// console.log("Clicked");
		$('.mobile-nav').toggleClass('active');
		$('.links').toggleClass('active');
		$('#app').toggleClass('hidden');
		$('footer').toggleClass('hidden');
		$('.links a').toggleClass('.current');
	});
	$('.links a').click(function (e) {
		// console.log("Clicked");
		$('.mobile-nav').removeClass('active');
		$('.links').removeClass('active');
		$('#app').removeClass('hidden');
		$('footer').removeClass('hidden');
	});
}
// !MOBILE NAV ////////////////////////////////////////////
//
//
//
// !CHANGING PAGES ////////////////////////////////////////
function changePage() {
	let hash = window.location.hash;
	let hashID = hash.replace('#', '');
	if (hashID != '') {
		$.get(`pages/${hashID}.html`, function (data) {
			$('#app').html(data);

			if (hashID == 'browse') {
				defaultRecipes();
			}

			if (hashID == 'recipes') {
				getUserRecipes();
			}

			// defaultRecipeDetails();
		});
	} else {
		$.get(`pages/home.html`, function (data) {
			$('#app').html(data);
		});
	}
}

function initHashListener() {
	$(window).on('hashchange', changePage);
	changePage();
}
// !CHANGING PAGES ////////////////////////////////////////
//
//
//
// !MISC ///////////////////////////////////////////////////
function updateUser(userObj) {
	let id = firebase.auth().currentUser.uid;
	_db
		.collection('Users')
		.doc(id)
		.update(userObj)
		.then(() => {
			console.log('Updated Doc');
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log('update doc error ' + errorMessage);
		});
}
// !MISC ///////////////////////////////////////////////////
//
//
//
$(document).ready(function () {
	initHashListener();
	initListeners();
	initFirebase();
});
