type Rectangle = {
  width: number;
  height: number;
};

const getRectangleArea = (rectangle: Rectangle) => {
  return rectangle.width * rectangle.height;
};

const getRectanglePerimeter = (rectangle: Rectangle) => {
  return 2 * (rectangle.width + rectangle.height);
};
const rectangle = {
  width: 10,
  height: 15,
};

console.log(getRectangleArea(rectangle));
console.log(getRectanglePerimeter(rectangle));
