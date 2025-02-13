// Question 1: How do you create an empty array in JavaScript?
let arr = [];
let arr1 = new Array();

//Question 2: How do you access the first and last elements of an array?
let elem = [1, 2, 3, 4, 5];
console.log(elem[0], elem[elem.length - 1]);

//Question 3: How do you add an element to the end of an array?
let numb = [6, 7, 8, 9];
numb.push(10);
console.log(numb);

//Question 4: How do you remove the last element from an array?
let number = [6, 7, 8, 9, 10];
number.pop();
console.log(number);

//Question 5: How do you loop through an array in JavaScript?
let arr2 = [5, 6, 7, 8, 9];
let total = 0;
for (let i = 0; i < arr2.length; i++) {
  total += arr2[i];
}
console.log(total);
//using forEach() method
let arr3 = [5, 6, 7, 8, 9];
let total1 = 0;
arr3.forEach((num) => (total1 += num));
console.log(total1);

//Question 6: How do you check if an element exists in an array?
let arr4 = [5, "blue", "green", 8];
if (arr4.indexOf(6) === -1) {
  console.log("elem not found");
} else {
  console.log("elem found");
}

// Question 7: How do you remove an element from an array at a specific index?
let arr5 = [5, 6, 7, 8, 9];
let newArr = arr5.splice(1, 3);
console.log(newArr);
console.log(arr5);

//Question 8: How do you concatenate two arrays in JavaScript?
const emman = [23, "kip", "rosa"];
const esir = [21, "kibe", "mary"];

console.log(emman.concat(esir));

// Flatten Array JavaScript Interview Questions With Answers
// In this section of JS interview questions now is time for some of the top flatten array JavaScript
// interview questions. Check JavaScript interview questions on the flattened array below.

// Question 1: Write a function to flatten a nested array in JavaScript.
function flattenArray(arr) {
  return arr.reduce(
    (flat, item) =>
      Array.isArray(item) ? flat.concat(flattenArray(item)) : flat.concat(item),
    []
  );
}
console.log(flattenArray([1, [2, [3, 4], 5], 6]));

//Question 2: What does the reduce() method do in the flattenArray() function above?

// it iterates through each item in arr.at
// it checks if it is an array ,if it is an array , we call flattenArray(item),if it ia an array we add it directly to the result

//Question 3: Can you give an example of a nested array that the flattenArray() function would be able to flatten?
const flatArray1 = [54, [23, [36, 41], 50], 68];

//Question 4: Can you explain how the flat() method can be used to flatten an array in JavaScript?

const flatArray = [54, [23, [36, 41], 50], 68];
console.log(flatArray.flat(Infinity));

//It takes a depth parameter, which specifies how many levels of nested arrays should be flattened. If no depth parameter is provided, defaults to 1

// Question 5: What are some potential issues to watch out for when flattening arrays in JavaScript?
// 1. Performance Issues (Deep Nesting & Large Arrays)
// 2. Loss of Object References
// 3. Mixing Different Data Types
// 4. Handling Undefined or Sparse Arrays

//JavaScript Array Manipulation Interview Questions
// Question 1: What is the difference between .map() and .forEach()?
// Both .map() and .forEach() are used to iterate over arrays in JavaScript, but they have key differences in functionality and return behavior.

// 1. .map() – Returns a New Array - Does not modify the original array.
const numbers = [1, 2, 3, 4];
const squared = numbers.map((num) => num * num);

console.log(squared);
console.log(numbers);

// 2. .forEach() – Executes a Function but Does Not Return Anything - Modifies the original array if needed.
const numbers1 = [1, 2, 3, 4];
numbers.forEach((num, index, arr) => {
  arr[index] = num * num;
});

console.log(numbers);

// Question 2: How do you remove an element from an array in JavaScript?
const fruits = ["apple", "banana", "orange", "mango"];
fruits.splice(2, 1);
console.log(fruits);

//Question 3: What is the difference between .filter() and .find()?
//1. .filter() – Returns an Array of Matches
// Purpose: Used to find all elements that match a given condition.
// Returns: A new array containing all matching elements.
// If no match is found: Returns an empty array ([]).
const numbers3 = [10, 20, 30, 40, 50];

// Get numbers greater than 25
const result = numbers3.filter((num) => num > 25);
console.log(result); // [30, 40, 50]

// 2. .find() – Returns the First Match
// Purpose: Used to find the first element that matches a given condition.
// Returns: The first matching element (not an array).
// If no match is found: Returns undefined.
const numbers4 = [10, 20, 30, 40, 50];

// Find the first number greater than 25
const result1 = numbers4.find((num) => num > 25);

console.log(result1);

//Question 4: How do you sort an array in JavaScript?
const fruits1 = ["banana", "apple", "orange", "mango"];
fruits1.sort();
console.log(fruits1);

//How to get first 3 elements of array in JavaScript?
const array = [10, 20, 30, 40, 50];
const firstThree = array.slice(0, 3);

console.log(firstThree);

//What is Array[-1] in JavaScript?
//Array[-1] does not work like it does in some other languages
