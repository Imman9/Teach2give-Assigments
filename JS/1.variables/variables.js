//1. declaring variables

//.1,Declare a variable age using let and assign it the value 25.
let age = 25;
// 2. Declare a variable schoolName using const and assign it "Greenwood High".
const schoolName = "Greenwood High";
// 3. Declare an empty array called studentsList.
const studentslist = [];
// 4. What is the difference between let, const, and var when declaring variables?
let answer = {
  let: "used when reassignment is needed",
  var: "accessible within the function where it is declared",
  const: "prevents reassignment",
};

// 2.naming conventions
//5.Which of the following variable names is invalid?
let answ = `let 1stPlace = "John";`;
//6. Why is the following variable name incorrect?
let ans = `const #taxRate = 0.16;(variable names cannot be started with a #)`;
//7.Rewrite this variable name to follow best practices:
let answe = `let MyvariableNAME = "JavaScript"; = let myVariableName = "JavaScript";`;

let myVariableName = "JavaScript";

//3. Identifying Data Types
//8.What will be the output of the following?
console.log(typeof "Hello"); // string
console.log(typeof 99); // number
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined

//9.Identify the data types in this array:
let data = ["Kenya", 34, false, { country: "USA" }, null];
let a = `"kenya"-string
34-number
false-boolean
 { country: "USA" }-object
 null-null`;
//10.How do you define a BigInt in JavaScript? Provide an example.
let Bigint =
  "It is a special numeric type used to represent integers larger than the Number type's maximum limit (2^53 - 1).";
//exampple
let bigNumber = BigInt(9007199254740991);
console.log(bigNumber);

//4. Objects & Arrays;
//11. Create an object person with properties name, age, and city.
const person = {
  name: "Drey",
  age: 20,
  city: "Nairobi",
};
//12. Add a new property email to the person object.
person.email = "emmanuelkipkoech742@gmail.com";
console.log(person);
//13. Declare an array fruits with three fruit names.
const fruits = ["apple", "banana", "watermellon"];
//14. Access the second item in the fruits array
console.log(fruits[1]);
//5. Type Coercion
//15. What will be the output of the following?
console.log("5" + 2); // 53
console.log("5" - 2); // 3
//16. Convert the string "100" into a number.
let string = "100";
let numb = Number("100");
console.log(typeof numb);
//17. Convert the number 50 into a string.
let num = 50;
let str = num.toString();
console.log(typeof str);
//18. What will be the result of this operation?
console.log(5 + true); //6
