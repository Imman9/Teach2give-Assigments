//JavaScript String Practice Questions
// 1. Check String InputWrite a JavaScript function to check whether a string is blank or not.
//○ Write a JavaScript function to check whether an 'input' is a string or not.
function isString(input) {
  return typeof input === "string";
}
console.log(isString("w3resource")); // true
console.log(isString([1, 2, 4, 0])); // false

// 2. Check Blank String
// ○
function is_Blank(input) {
  return typeof input === "string" && input.trim().length === 0;
}
console.log(is_Blank(" ")); //true
console.log(is_Blank("abc")); //false
//3. String to Array of Words
//○ Write a JavaScript function to split a string and convert it into an array of words.
function string_to_array(input) {
  return input.split(" ");
}
console.log(string_to_array("Robin Singh")); // ["Robin", "Singh"]

//.4 Extract Characters
//○ Write a JavaScript function to extract a specified number of characters from a
//string
function truncate_string(input) {
  return input.substring(0, 4);
}
console.log(truncate_string("Robin Singh", 4)); // "Robi"

//5. Abbreviate Name
//○ Write a JavaScript function to convert a string into abbreviated form.
function abbrev_name(input) {
  let abbrev = input.trim().split(" ");
  if (abbrev.length < 2) return input;
  return `${abbrev[0]} ${abbrev[1][0].toUpperCase()}.`;
}

console.log(abbrev_name("Robin Singh")); // "Robin S."

//6. Hide Email Address
// ○ Write a JavaScript function that hides email addresses to prevent unauthorized
// access.
function protect_email(email) {
  return email.replace(
    /^([a-zA-Z0-9]+)(.*?)(@.*)$/,
    (_, firstPart, rest, domain) => {
      return `(${firstPart}***${domain})`;
    }
  );
}

console.log(protect_email("robin_singh@example.com")); //
("robin...@example.com");

//7. Parameterize String
//○ Write a JavaScript function to parameterize a string.
function string_parameterize(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
console.log(string_parameterize("Robin Singh from USA.")); //"robin-singh-from-usa"

//8. Capitalize First Letter
//○ Write a JavaScript function to capitalize the first letter of a string.
function capitalize(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

console.log(capitalize("js string exercises")); // "Js string exercises"

//9. Capitalize Each Word
//○ Write a JavaScript function to capitalize the first letter of each word in a string.
function capitalize_Words(input) {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
console.log(capitalize_Words("js string exercises")); // "Js String Exercises"

// 10. Swap Case
// ○ Write a JavaScript function that converts uppercase letters to lowercase and vice
// versa.
function swapcase(input) {
  return input
    .split("")
    .map((char) => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    })
    .join("");
}
console.log(swapcase("AaBbc")); // "aAbBC"

// 11. Camelize String
// ○ Write a JavaScript function to convert a string into camel case.

function camelize(input) {
  return input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join("");
}

console.log(camelize("Java Script Exercises")); // "JavaScriptExercises"

// 12. Uncamelize String
// ○ Write a JavaScript function to uncamelize a string.
function uncamelize(input) {
  return input.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
}

console.log(uncamelize("helloWorld")); // "hello world"

// 13. Repeat String
// ○ Write a JavaScript function to concatenate a given string n times.
function repeat(input, n) {
  return input.repeat(n);
}

console.log(repeat("Ha!", 3)); // "Ha!Ha!Ha!"

// 14. Insert in String
// ○ Write a JavaScript function to insert a string within another string at a given
// position.

function insert(input, insertstr, position) {
  return input.slice(0, position) + insertstr + input.slice(position);
}

console.log(insert("We are doing some exercises.", "JavaScript ", 18));
// "We are doing some JavaScript exercises."

// 15. Humanize Format
// ○ Write a JavaScript function that formats a number with the correct suffix (1st,
// 2nd, etc.).
function humanize_format(num) {
  if (num % 100 >= 11 && num % 100 <= 13) {
    return num + "th";
  }
  switch (num % 10) {
    case 1:
      return num + "st";
    case 2:
      return num + "nd";
    case 3:
      return num + "rd";
    default:
      return num + "th";
  }
}
console.log(humanize_format(301)); // "301st"

// 16. Truncate String with Ellipsis
// ○ Write a JavaScript function to truncate a string and append "...".
function text_truncate(input, index, appendingText) {
  return input.slice(0, index) + " " + appendingText;
}

console.log(text_truncate("We are doing JS string exercises.", 15, "!!")); // "We are doing !!"

// 17. Chop String into Chunks
// ○ Write a JavaScript function to chop a string into chunks.
function string_chop(input, size) {
  if (size <= 0) {
    return [];
  }
  let result = [];
  for (let i = 0; i < input.length; i += size) {
    result.push(input.substring(i, i + size));
  }
  return result;
}
console.log(string_chop("w3resource", 3)); // ["w3r", "eso", "urc", "e"]

// 18. Count Substring Occurrences
// ○ Write a JavaScript function to count occurrences of a substring in a string.

function count(string, subString) {
  if (!subString) return 0;
  return string.split(subString).length - 1;
}

console.log(count("the quick brown fox jumps over the lazy dog", "the")); //2

// 19. Reverse Binary Representation
// ○ Write a JavaScript function that reverses the binary representation of a number
// and returns its decimal form.
function reverse_binary(num) {
  let binaryStr = num.toString(2);
  let reversedBinary = binaryStr.split("").reverse().join("");
  return parseInt(reversedBinary, 2);
}

console.log(reverse_binary(100)); // 19

// 20. Pad String to Length
// ○ Write a JavaScript function to pad a string to a specified length.
function formatted_string(template, value, position) {
  let padChar = template[0];
  let length = template.length;

  let strValue = value.toString();

  if (position === "l") {
    return strValue.padStart(length, padChar);
  } else if (position === "r") {
    return strValue.padEnd(length, padChar);
  }

  return strValue;
}
console.log(formatted_string("0000", 123, "l")); // "0123"
