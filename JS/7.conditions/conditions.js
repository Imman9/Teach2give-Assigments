// let marks = 0;
// let grade = "";

// function myGrade(mark) {
//   if (mark > 89) {
//     grade = "A";
//   } else if (mark > 70) {
//     grade = "B";
//   } else if (mark > 60) {
//     grade = "B";
//   } else if (mark > 50) {
//     grade = "B";
//   } else {
//     grade = "D";
//   }
//   return grade;
// }
// console.log(`Your grade is : ${myGrade(78)}`);

//ES6 syntax
const myGrade1 = (mark) => {
  return mark < 40
    ? "E"
    : mark >= 40
    ? "D"
    : mark >= 50
    ? "C"
    : mark >= 60
    ? "B"
    : mark >= 70 && mark <= 100
    ? "A"
    : "Invalid mark";
};
console.log(myGrade1(200));
