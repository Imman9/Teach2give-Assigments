function merge<T, U>(obj1: T, obj2: U) {
  return { ...obj1, ...obj2 };
}
const mergedobj = merge({ name: "green" }, { age: 34 });
console.log(mergedobj);

//arrays
const fruits: Array<string> = ["apple", "banana"];
const marks: number[] = [2, 3, 4, 5];

//promises
type User = {
  uid: string;
  name: string;
  isAdmin: boolean;
};
const data: User = {
  uid: "fghjkl",
  name: "nama",
  isAdmin: true,
};
const fetchData = async (id: string): Promise<User> => {
  const user_data = await data;
  return user_data;
};

//sets-collection of unique values

const mySet: Set<number> = new Set([1, 2, 3, 4, 6]);
mySet.add(6);

//empty-set

const emptySet = new Set<string>();
emptySet.add("hello");

//type Assertins and casting
//use as syntax
//use angle Bracket syntax

//as syntax
const jsonString = '{"name":"Alice", "Age":"30"}';
const parseData = JSON.parse(jsonString) as { name: string; age: number };

//generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
const person = { name: "jane", age: 30 };
const name1 = getProperty(person, "name");
console.log(name1);

//default types for generics
function createPair<T = string, U = number>(value1: T, value2: U): (T | U)[] {
  return [value1, value2];
}
