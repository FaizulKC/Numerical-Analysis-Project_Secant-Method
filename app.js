document
  .getElementById("secantForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    const funcInput = document.getElementById("function").value;
    const func = new Function("x", `return ${parseExpression(funcInput)}`);
    let x0 = parseFloat(document.getElementById("x0").value);
    let x1 = parseFloat(document.getElementById("x1").value);
    const precision = parseInt(document.getElementById("decPoint").value);
    const tolerance = 0.0001;
    // const tolerance = parseFloat(document.getElementById("tolerance").value);
    const maxIterations = 1000;
    let iteration = 0;
    let error;

    // Clear previous results
    document.getElementById("result").innerText = "";
    const tableBody = document
      .getElementById("resultsTable")
      .querySelector("tbody");
    tableBody.innerHTML = "";

    do {
      const f_x0 = func(x0);
      const f_x1 = func(x1);
      const x2 = x1 - f_x1 * ((x1 - x0) / (f_x1 - f_x0));
      const f_x2 = func(x2);
      error = Math.abs(x2 - x1);

      // Update table with the current iteration
      const row = tableBody.insertRow();
      row.insertCell(0).innerText = `x${iteration + 1}`;
      row.insertCell(1).innerText = x0.toFixed(precision);
      row.insertCell(2).innerText = x1.toFixed(precision);
      row.insertCell(3).innerText = x2.toFixed(precision);
      row.insertCell(4).innerText = f_x2.toFixed(precision);
      row.insertCell(5).innerText = error.toFixed(precision);
      console.log(`f(x) = ${f_x2}`);
      // Update values for next iteration
      x0 = x1;
      x1 = x2;
      iteration++;

      if (iteration > maxIterations) {
        document.getElementById(
          "result"
        ).innerText = `Failed to converge after ${maxIterations} iterations.`;
        return;
      }
    } while (error > tolerance);

    const result = x1.toFixed(precision);
    document.getElementById(
      "result"
    ).innerText = `Root: ${result} after ${iteration} iterations.`;
  });

// Helper function to parse the input expression
function parseExpression(expression) {
  return expression
    .replace(/(\d)([a-zA-Z])/g, "$1*$2") // Add * between a number and a variable
    .replace(/\^/g, "**") // Replace ^ with **
    .replace(/exp\(([^)]+)\)/g, "Math.exp($1)") // Replace exp(x) with Math.exp(x)
    .replace(/log\(([^)]+)\)/g, "Math.log($1)") // Replace log(x) with Math.log(x)
    .replace(/ln\(([^)]+)\)/g, "Math.log($1)") // Replace ln(x) with Math.log(x)
    .replace(/sin\(([^)]+)\)/g, "Math.sin($1)") // Replace sin(x) with Math.sin(x)
    .replace(/cos\(([^)]+)\)/g, "Math.cos($1)") // Replace cos(x) with Math.cos(x)
    .replace(/tan\(([^)]+)\)/g, "Math.tan($1)"); // Replace tan(x) with Math.tan(x)
}
