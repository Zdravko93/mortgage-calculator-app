import { clearErrorsAndStyles } from "./helpers.js";
import { validateInput, validateRadioGroup } from "./validation.js";
import { calculateMortgage, updateResults } from "./calculator.js";
import { animateMainContainer, animateResults } from "./animations.js";

// DOM ELEMENTS
const form = document.querySelector("form");
const clearBtn = document.querySelector(".clear-button");
const calcButton = document.querySelector(".calc-button");
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
  if (show) {
    hiddenContainer.classList.add("hide");
    displayedContainer.classList.add("show");
    displayedContainer.style.opacity = "1";
    hiddenContainer.style.opacity = "0";
  } else {
    hiddenContainer.classList.remove("hide");
    displayedContainer.classList.remove("show");
    displayedContainer.style.opacity = "0";
    hiddenContainer.style.opacity = "1";
  }
};

// VALIDATION HANDLER
const validateForm = () => {
  let valid = true;

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

  if (!valid) {
    toggleResultContainers(false); // Hide results only if invalid
  }

  return valid;
};

// EVENT HANDLERS
calcButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    calcButton.classList.add("pressed");
  }
});
calcButton.addEventListener("keyup", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    calcButton.classList.remove("pressed");
  }
});

// Keep track of last submitted values
let lastValues = {
  amount: "",
  term: "",
  rate: "",
  radioId: "",
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value.trim();
  const term = document.getElementById("term").value.trim();
  const rate = document.getElementById("interest-rate").value.trim();
  const checkedRadio = Array.from(radioButtons).find((r) => r.checked);
  const radioId = checkedRadio ? checkedRadio.id : "";

  // Check if inputs/radio are unchanged
  const unchanged =
    amount === lastValues.amount &&
    term === lastValues.term &&
    rate === lastValues.rate &&
    radioId === lastValues.radioId;

  if (!validateForm() || unchanged) return;

  lastValues = { amount, term, rate, radioId };

  // button effects
  calcButton.classList.add("calculating");
  await new Promise((res) => setTimeout(res, 100));

  // Perform calculation
  const results = calculateMortgage(
    parseFloat(amount),
    parseFloat(term),
    parseFloat(rate)
  );
  updateResults(
    radioButtons,
    results.monthlyRepayment,
    results.totalRepayment,
    results.monthlyInterestOnly,
    results.totalInterestOnly
  );

  toggleResultContainers(true);
  animateResults();

  setTimeout(() => {
    calcButton.classList.remove("calculating", "pressed");
  }, 200);
});

clearBtn.addEventListener("click", () => {
  form.reset();
  clearErrorsAndStyles(textInputs, suffixes, errors, radioContainers);
  toggleResultContainers(false);

  // reset values to allow the same values to be recalculated after clearing
  lastValues = { amount: "", term: "", rate: "", radioId: "" };
});

window.addEventListener("load", animateMainContainer);

// Real-time validation
textInputs.forEach((input, i) => {
  input.addEventListener("input", () => {
    validateInput(input, suffixes[i], errors[i]);
  });
});

radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    validateRadioGroup(radioButtons, radioContainers, radioError);
  });
});
