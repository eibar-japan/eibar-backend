//This file is for studying java script

//Declare a variable
var myFirstName = "Toby";
var myLastName = "Manley";
//Quotes inside a string
var myStr = "This string contains \"double quotes\"."

//Concatonation 
var myStr = "This is the start." + " This is the end.";

//Conactonation with "+=" concatonate a string over multiple lines
var myStr = "This string is dangling";
myStr += " to the line below.";

//Add a variable in to a string 
var nuterString = myStr + " on the end of a fishing line!";

//find length of a string using .length
var lengthOfMyString = myStr.legth;

//find character indexing of a string using [] notation.
// programming indexing begins from 0, not 1, so first character of a string is 0 character
var firstPlaceIndex = myStr[0];

// the characters in a string literal cannot be changed

//find character indexing of the Nth to last character using - i.e. [myStr.length - 3]

//arrays are used to assign multiple value to one variable with []
var myArray = ["Assign", "multiple", 7, "variables"];

//nest one array within another array as follows
var myArray = [["Bill", 23], ["Bob", 29]];

//Access arrays with indexing
var yourArray = myArray[0]

//Using multiple arrays
var multipleArrays [
    [[0, 1, 2], 2, 17],
    [3, 4, 5]
];

//Modify Arrays using push
multipleArrays.push([18]);

//remove values from end of array with pop()
multipleArrays.pop() //this will automaticaly remove "17" from the first vlaue of multipleArrays which would be 17

//Use Functions
function functionName () {//when function is called all text between curly braces is called
    console.log ("Hello World");
}

functionName();

//Passing value to functions with Arguments
//Parameters are variables that act as placeholders for the values that are to be input to a function when it is called
//The actual values that are input (or "passed") into a function when it is called are known as arguments
function functionWithNumbers(param1, param2) {
    console.log(param1 + param2);
} 
functionWithNumbers(1, 2);

//We can pass values into a function with arguments. You can use a return statement to send a value back out of a function.

// In computer science a Queue is a list of actions which will be performed in sequential order.
//The below function takes the
function nextInLine(arr, item) {
    // Only change code below this line
    arr.push(item);
    var removed = arr.shift();
    return removed;
    // Only change code above this line
    
  
  }
  
  // Setup
  var testArr = [1,2,3,4,5];
  
  // Display code
  console.log("Before: " + JSON.stringify(testArr));
  console.log(nextInLine(testArr, 6));
  console.log("After: " + JSON.stringify(testArr));

  //Boolean data types
  //Booleans may only be one of two values, true or false

  //If statements are used to make decisions in code. The kyeword if tells javascrip to execute code in curly braces under certain conditions defined in parenthesis 
  function trueOrFalse (wasThatTrue) {
      if (wasThatTrue) {
          return "Yes, that was true";
      }
      return "No, that was not true";
    }
    wasThatTrue(true);
    wasThatTrue(false);

    //There are many comparison operators in java script, they all return Boolean values, True or False.
    // Most basic operatior is equality operator ==, this retruns two values and returns true if they're equal and false if they're not

    function equality (val) {
        if (val == 17) {
            return "Equal";
        }
        return "Not equal";
    }
    equality (17);

//Other operators === (perfect equality)
// > greater than (Vlaue on left is greater than right)
// >= greater than or equal to

    //Another operator is the inequality operator !=, this returns true if two values are unequal and false if the two values are equal.

    //logical and operator enables you to compare multiple sets of values with &&
    function logicalAnd (val) {
        if (val <= 20 && val >=10) {
            return "True;"
        }
        return "False";
    }
    logicalAnd (15);
    
  // two pipes "||" returns true if either operant is true

  // Use an "else" statement to manage a logical flow if the value is flase

  function logicalFlow (val) {
      if (val > 5) {
          return "Bigger than 5"
      } else {
          return "5 or less"
      }
  }
  logicalFlow (4);

  //You can chain together else if statements
  function logicalFlow (val) {
      if (val > 10) {
          return "Bigger than 10"
      } else if (val < 5) {
          return "Less than 5"
      } else {
          return "Between 5 and 10"
      }     
  }
  logicalFlow (6);

  //So you can chain complex logical statements together with if/ else, but if/else statements execute
  //in order so be careful when executing them that th order of the statements in logiclly sound

  //Golf Game
  var names = ["Hole-in-one!", "Eagle", "Birdie", "Par", "Bogey", "Double Bogey", "Go Home!"];
function golfScore(par, strokes) {
  // Only change code below this line
if (strokes == 1) {
  return "Hole-in-one!";
} else if (strokes <= par - 2) {
  return "Eagle";
} else if (strokes == par - 1) {
  return "Birdie";
} else if (strokes == par) {
  return "Par";
} else if (strokes == par + 1) {
  return "Bogey";
} else if (strokes == par + 2) {
  return "Double Bogey";
} else  {
  return "Go Home!"; 
  return "Change Me";
}
  // Only change code above this line
}

golfScore(5, 4);

//Switch statements are used for code to execute based on several options
function caseInSwitch(val) {
    var answer = "";
    // Only change code below this line
  switch(val) {
    case 1:
      return"alpha";
      break;
    case 2:
      return"beta";
      break;
    case 3:
      return"gamma";
      break;
    case 4:
      return"delta";
      break; 
    }
  
  
    // Only change code above this line
    return answer;
  }
  
  caseInSwitch(1);

  //Switch statements need a "deafult" value in case where input does not match any of the cases
  function switchOfStuff(val) {
    var answer = "";
    // Only change code below this line
  switch (val) {
    case "a":
     return "apple";
     break;
    case "b":
     return "bird";
     break;
    case "c":
     return "cat";
     break;
    default:
     return "stuff";
     break; 
  }
  
  
    // Only change code above this line
    return answer;
  }
  
  switchOfStuff(1);

//Switch statements can evaluate down to the same return using ranges of cases.
  function sequentialSizes(val) {
    var answer = "";
    // Only change code below this line
  switch (val) {
    case 1:
    case 2:
    case 3:
     return "Low";
     break;
    case 4:
    case 5:
    case 6:
     return "Mid";
     break;
    case 7:
    case 8:
    case 9:
     return "High";
     break;
  }
  // Only change code above this line
    return answer;
  }
  
  sequentialSizes(1);

  //Switch statements are easier to write that "if else" statements
  function chainToSwitch(val) {
    var answer = "";
    // Only change code below this line
  switch (val) {
    case "bob":
     return "Marley";
     break;
    case 42:
     return "The Answer";
     break;
    case 1:
     return "There is no #1";
     break;
    case 99:
     return "Missed me by this much!";
     break;
    case 7:
     return "Ate Nine";
     break;
  }
  
    // Only change code above this line
    return answer;
  }
  
  chainToSwitch(7);

  //return compairson operators instead of suing "if else" statements

  //Blackjack card counting program
  var count = 0;

function cc(card) {
  // Only change code below this line
switch (card) {
  case 2:
  case 3:
  case 4:
  case 5:
  case 6:
   count ++;
   break;
  case 10:
  case "J":
  case "Q":
  case "K":
  case "A":
   count --;
   break;
}
var holdbet ="Hold"
if (count > 0) {
    holdbet = "Bet";
}
return count + " " + holdbet;
}
  // Only change code above this line


cc(2); cc(3); cc(7); cc('K'); cc('A');

//You can build objects using JS. Objects are similar to arrays, but instead of using indexes to access and modify their data
//you us access data in objects through properties

var myDog = {
    "name": "Rover",
    "legs": 4,
    "tails": 1,
    "Friends": ["Sticks", "Walks"]
};

//you can cess object data using .notation or brakcet notation[]

var nameValue = myDog.name;
var legsValue = myDog.legs;

// Accessing Object Properties with Variables
// Setup
var testObj = {
    12: "Namath",
    16: "Montana",
    19: "Unitas"
  };
  
  // Only change code below this line
  
  var playerNumber = 16;       // Change this line
  var player = testObj[playerNumber];   // Change this line

  //Update a property in an object using variables
  myDog.name = "Land Rover";

  //Add properties to an object in the same way you change
  myDog["Bark"] = "Woof!";

  //Dlete a property from an object using delte
  delete myDog.Bark;

  //Don't understand this
  // Setup
function phoneticLookup(val) {
    var result = "";
  
    // Only change code below this line
    var lookup = {
      "alpha":"Adams",
      "bravo":"Boston",
      "charlie":"Chicago",
      "delta":"Denver",
      "echo":"Easy",
      "foxtrot":"Frank"
    };
    result = lookup[val];
    // Only change code above this line
    return result;
  }
  
  phoneticLookup("charlie");

  //you can test if objects have certain properties using the hasOwnProperty(Prop name) method
  function checkObj(obj, checkProp) {
    // Only change code below this line
    if (obj.hasOwnProperty(checkProp)) {
      return obj[checkProp];
    } else {
      return "Not Found";
    }
    // Only change code above this line
  }

  function updateRecords(records, id, prop, value) {
    if (prop !== 'tracks' && value !== "") { //"!==" is a strict inequality operator, it checks if 2 values are not equal
      records[id][prop] = value; //prop is an input into the function
    } else if (prop === "tracks" && records[id].hasOwnProperty("tracks") === false) { //"===" strict equality oeprator checks if 2 values are perfectly equal, returning a boolean
      records[id][prop] = [value];
    } else if (prop === "tracks" && value !== "") {//&& operator is the LOGICAL and operator that is true only if both operands are true
      records[id][prop].push(value);
    } else if (value === "") {
      delete records[id][prop];
    }
// Refactor
// deletion case
if (value === "") {
  delete records[id][prop];
} else {
  // update cases. tracks has special treatment since it's an array.
  if (prop === "tracks") {
    if (records[id].hasOwnProperty("tracks") === false) {
      records[id][prop] = [value];
    } else {
      // TODO: add check that the value of "tracks" is actually an array before pushing.
      records[id][prop].push(value);
    }
  } else {
    records[id][prop] = value;
  }
}


  // Iterate with JavaScript while loops
// Setup
const myArray = [];
let x = 5;

while (x >= 0) {
  myArray.push(x);
  x--;
}
// Only change code below this line

// for loops
//for (let X = value; condition i.e. value < 6; final operation i.e. x++) {
  myArray.push(x); //some action based on the end of each loop cycle
}

//decrement through for loop
// you can decrement through for loops by changing the initializing opertaion, conditional opertaion and finlaizing operation.
const myArray = [];

for (let x = 9; x >= 0; x -=2) {
  myArray.push (x);
}

//Add the values of an array using a forloop
// Setup
const myArr = [2, 3, 4, 5, 6];

let total = 0;

for (let x = 0; x < myArr.length; x++) {
      total += myArr[x];// Why does JavaScript know to add the elements of myArray in sequence, what makes JS move through the array?
}
// Only change code below this line

//nesting for loops
function multiplyAll(arr) {
  let product = 1;
  // Only change code below this line
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      product = product * arr[i][j];
    }
  }
  // Only change code above this line
  return product;
}

multiplyAll([[1, 2], [3, 4], [5, 6, 7]]);

//Replace loops using Recursion
function sum(arr, n) {
  // Only change code below this line
  if (n <= 0) {
    return 0;
  } else {
    return sum(arr, n - 1) + arr[n - 1];
  }
  // Only change code above this line
}