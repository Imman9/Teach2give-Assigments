// Write a function to determine if a given string is a palindrome. A palindrome is a string that reads the same forward and backward (ignoring spaces, punctuation, and case).
function isPalindrom(str) {
  let newStr = str.toLowerCase().replace(/[a-z0-9]/g, "");
  let reversedStr = newStr.split("").reverse().join("");
  return newStr === reversedStr;
}
console.log(isPalindrom("A man, a plan, a canal, Panama")); //true
console.log(isPalindrom("Hello, World")); //false

// 2. Reverse a String
// Write a function to reverse a given string.

function reverseStr(str) {
  return str.split("").reverse().join("");
}
console.log(reverseStr("string"));

//  3. Find the Longest Palindromic Substring
// Write a function to find the longest palindromic substring in a given string.
function longestPalindromicSubstring(str) {
  if (!str || str.length === 0) return "";

  let start = 0,
    maxLength = 0;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < str.length && str[left] === str[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  for (let i = 0; i < str.length; i++) {
    let len1 = expandAroundCenter(i, i); // Odd length palindrome
    let len2 = expandAroundCenter(i, i + 1); // Even length palindrome
    let len = Math.max(len1, len2);

    if (len > maxLength) {
      maxLength = len;
      start = i - Math.floor((len - 1) / 2);
    }
  }

  return str.substring(start, start + maxLength);
}
console.log(longestPalindromicSubstring("babad"));
console.log(longestPalindromicSubstring("cbbd"));

// 4. Check if Two Strings are Anagrams
// Write a function to check if two given strings are anagrams of each other. Two strings are anagrams if they contain the same characters in the same frequency but in different orders.

function areAnagrams(str1, str2) {
  if (str1.length !== str2.length) return false;
  str1 = str1.split("").sort().join("");
  str2 = str2.split("").sort().join("");

  return str1 === str2;
}
console.log(areAnagrams("listen", "silent")); //true
console.log(areAnagrams("hello", "world")); //false

// 5. Remove Duplicates from a String
// Write a function to remove duplicate characters from a string while preserving the order of the first appearance of each character.

function removeDuplicate(str) {
  let result = "";
  for (const char of str) {
    if (!result.includes(char)) {
      result += char;
    }
  }
  return result;
}
console.log(removeDuplicate("programming"));
console.log(removeDuplicate("hello world"));

// 6. Count Palindromes in a String
// Write a function to count how many distinct palindromes are in a given string. A palindrome is considered distinct based on its start and end position in the string.

function countPalindrome(str) {
  let palindromes = new Set();

  function isPalindrome(s) {
    return s === s.split("").reverse().join("");
  }
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      let substr = str.substring(i, j);
      if (isPalindrome(substr)) {
        palindromes.add(substr);
      }
    }
  }
  return palindromes.size;
}
console.log(countPalindrome("ababa"));

// 7. Longest Common Prefix
// Write a function to find the longest common prefix string amongst an array of strings.
//  If there is no common prefix, return an empty string.
function longestCommonPrefix(str) {
  let prefix = str[0];

  for (let i = 1; i < str.length; i++) {
    while (str[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}
console.log(longestCommonPrefix(["flower", "flow", "flight"]));
console.log(longestCommonPrefix(["dog", "racecar", "car"]));

// 8. Case Insensitive Palindrome
// Modify the palindrome function to be case insensitive, meaning it should ignore upper and lower case differences when checking for a palindrome.

function isCaseInsensitivePalindrome(str) {
  str = str.toLowerCase();
  let left = 0,
    right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
}
console.log(isCaseInsensitivePalindrome("Racecar"));
console.log(isCaseInsensitivePalindrome("Hello"));
