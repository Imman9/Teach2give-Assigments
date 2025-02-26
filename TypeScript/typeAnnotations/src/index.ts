import { Equal, Expect } from "@type-challenges/utils";
// Array
// Exercise 1 : Arrya Type
type ShoppingCart = {
  userId: string;
  items: Array<string>;
};

const processCart = (cart: ShoppingCart) => {
  // Do something with the cart in here
};

processCart({
  userId: "user123",
  items: ["item1", "item2", "item3"],
});

//Exercise 2 : Array of objects

type Ingredients = {
  name: string;
  quantity: string;
};

type Recipe = {
  title: string;
  instructions: string;
  ingredients: Ingredients[];
};

const processRecipe = (recipe: Recipe) => {
  // Do something with the recipe in here
};

processRecipe({
  title: "Chocolate Chip Cookies",
  ingredients: [
    { name: "Flour", quantity: "2 cups" },
    { name: "Sugar", quantity: "1 cup" },
  ],
  instructions: "...",
});

// Exercise 3 Tuples
export const setRange = (range: [x: number, y: number]) => {
  const x = range[0];
  const y = range[1];

  // Do something with x and y in here
  // x and y should both be numbers!

  type tests = [
    Expect<Equal<typeof x, number>>,
    Expect<Equal<typeof y, number>>
  ];

  return { x, y };
};

// Exercise 4: Optional Members of Tuples
const goToLocation = (coordinates: [number, number, number | undefined]) => {
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  const elevation = coordinates[2];

  // Do something with latitude, longitude, and elevation in here

  type tests = [
    Expect<Equal<typeof latitude, number>>,
    Expect<Equal<typeof longitude, number>>,
    Expect<Equal<typeof elevation, number | undefined>>
  ];
};

//Passing Types To Functions
// Passing Types To Set
type User = {
  name: string;
  age: number;
};
const userMap = new Map<number, User>();

userMap.set(1, { name: "Max", age: 30 });

userMap.set(2, { name: "Manuel", age: 31 });

// @ts-expect-error

userMap.set("3", { name: "Anna", age: 29 });

// @ts-expect-error

userMap.set(3, "123");

//Exercise 2: JSON.parse() Can't Receive Type Arguments
const parsedData: {
  name: string;
  age: number;
} = JSON.parse('{"name": "Alice", "age": 30}');

// type test =typeof parsedData
//     {
//       name: string;
//       age: number;
//     }
//   ;

// Typing Functions
// Exercise 1: Optional Function Parameters

const concatName = (first: string, last?: string) => {
  if (!last) {
    return first;
  }

  return `${first} ${last}`;
};

const result = concatName("John", "Doe");
const result2 = concatName("John");

//Exercise 2: Default Function Parameters
const concatName1 = (first: string, last?: string) => {
  if (!last) return first;

  return `${first} ${last}`;
};

// Exercise 3: Rest Parameters
function concatenate(...strings: string[]) {
  return strings.join("");
}

//Exercise 4: Function types
type User2 = {
  id: string;
  name: string;
};
const modifyUser = (
  user: User2[],
  id: string,
  makeChange: (user: User2) => any
) => {
  return user.map((u) => {
    if (u.id === id) {
      return makeChange(u);
    }

    return u;
  });
};

//Exercise  5: Functions Returning void
const addClickEventListener = (listener: () => void) => {
  document.addEventListener("click", listener);
};

addClickEventListener(() => {
  console.log("Clicked!");
});
