"use strict";
const getRectangleArea = (rectangle) => {
    return rectangle.width * rectangle.height;
};
const getRectanglePerimeter = (rectangle) => {
    return 2 * (rectangle.width + rectangle.height);
};
const rectangle = {
    width: 10,
    height: 15,
};
console.log(getRectangleArea(rectangle));
console.log(getRectanglePerimeter(rectangle));
