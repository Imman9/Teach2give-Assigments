const processCart = (cart) => {
    // Do something with the cart in here
};
processCart({
    userId: "user123",
    items: ["item1", "item2", "item3"],
});
const processRecipe = (recipe) => {
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
export const setRange = (range) => {
    const x = range[0];
    const y = range[1];
    return { x, y };
};
// Exercise 4: Optional Members of Tuples
const goToLocation = (coordinates) => {
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    const elevation = coordinates[2];
};
const userMap = new Map();
userMap.set(1, { name: "Max", age: 30 });
userMap.set(2, { name: "Manuel", age: 31 });
// @ts-expect-error
userMap.set("3", { name: "Anna", age: 29 });
// @ts-expect-error
userMap.set(3, "123");
//Exercise 2: JSON.parse() Can't Receive Type Arguments
const parsedData = JSON.parse('{"name": "Alice", "age": 30}');
// type test =typeof parsedData
//     {
//       name: string;
//       age: number;
//     }
//   ;
// Typing Functions
// Exercise 1: Optional Function Parameters
const concatName = (first, last) => {
    if (!last) {
        return first;
    }
    return `${first} ${last}`;
};
const result = concatName("John", "Doe");
const result2 = concatName("John");
//Exercise 2: Default Function Parameters
const concatName1 = (first, last) => {
    if (!last)
        return first;
    return `${first} ${last}`;
};
// Exercise 3: Rest Parameters
function concatenate(...strings) {
    return strings.join("");
}
const modifyUser = (user, id, makeChange) => {
    return user.map((u) => {
        if (u.id === id) {
            return makeChange(u);
        }
        return u;
    });
};
//Exercise  5: Functions Returning void
const addClickEventListener = (listener) => {
    document.addEventListener("click", listener);
};
addClickEventListener(() => {
    console.log("Clicked!");
});
//# sourceMappingURL=index.js.map