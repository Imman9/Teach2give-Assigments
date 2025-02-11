function appendValue(value) {
  let display = document.getElementById("display");
  if (value === "√") {
    display.value = Math.sqrt(parseFloat(display.value));
  } else if (value === "+/-") {
    display.value = -1 * parseFloat(display.value);
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  document.getElementById("display").value = "";
}
function calculateResult() {
  try {
    document.getElementById("display").value = eval(
      document.getElementById("display").value
    );
  } catch (error) {
    document.getElementById("display").value = "Error";
  }
}
