import { clearErrorsAndStyles } from "./helpers.js";
import { validateInput, validateRadioGroup } from "./validation.js";
import { calculateMortgage, updateResults } from "./calculator.js";
import { animateMainContainer, animateResults } from "./animations.js";

// DOM ELEMENTS
const form = document.querySelector("form");
const clearBtn = document.querySelector(".clear-button");
const textInputs = document.querySelectorAll("input:not([type='radio'])");
const suffixes = document.querySelectorAll(".input-suffix");
const errors = document.querySelectorAll(".error");
const radioButtons = document.querySelectorAll("input[type='radio']");
const radioContainers = document.querySelectorAll(".radio-container");
const radioError = errors[errors.length - 1];
const hiddenContainer = document.querySelector(".results-hidden");
const displayedContainer = document.querySelector(".results-displayed");

// Toggle result containers visibility
const toggleResultContainers = (show) => {
  hiddenContainer.classList.toggle("hide", show);
  displayedContainer.classList.toggle("show", show);
};

// VALIDATION HANDLER
const validateForm = () => {
  let valid = true;
  toggleResultContainers(false); // Hide results

  textInputs.forEach((input, i) => {
    const ok = validateInput(input, suffixes[i], errors[i]);
    if (!ok) valid = false;
  });

  const radioValid = validateRadioGroup(
    radioButtons,
    radioContainers,
    radioError
  );
  if (!radioValid) valid = false;

  return valid;
};

// EVENT HANDLERS
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const amount = parseFloat(document.getElementById("amount").value);
  const term = parseFloat(document.getElementById("term").value);
  const rate = parseFloat(document.getElementById("interest-rate").value);

  const results = calculateMortgage(amount, term, rate);

  updateResults(
    radioButtons,
    results.monthlyRepayment,
    results.totalRepayment,
    results.monthlyInterestOnly,
    results.totalInterestOnly
  );

  toggleResultContainers(true);
  animateResults();
});

clearBtn.addEventListener("click", () => {
  form.reset();
  clearErrorsAndStyles(textInputs, suffixes, errors, radioContainers);
  toggleResultContainers(false);
});

window.addEventListener("load", animateMainContainer);

// Real-time validation
textInputs.forEach((input, i) => {
  input.addEventListener("input", () =>
    validateInput(input, suffixes[i], errors[i])
  );
});

radioButtons.forEach(() => {
  document.addEventListener("change", () =>
    validateRadioGroup(radioButtons, radioContainers, radioError)
  );
});
