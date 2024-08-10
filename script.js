// Elements
const mortgageTextInputs = document.querySelectorAll(
  "input:not([type='radio'])"
);
const radioButtonInputs = document.querySelectorAll("input[type='radio']");
const radioContainers = document.querySelectorAll(
  ".input-group .radio-container"
);
const inputSuffixElements = document.querySelectorAll(
  ".input-wrapper .input-suffix"
);
const calcForm = document.querySelector("form");
const clearFormButton = document.querySelector(".clear-button");
const monthlyRepayments = document.querySelector(".monthly-repayments");
const totalRepayments = document.querySelector(".total-repayments");
const calculationResultsHiddenContainer =
  document.querySelector(".results-hidden");
const calculationResultsDisplayedContainer =
  document.querySelector(".results-displayed");
// Error elements
const allErrorElements = document.querySelectorAll(".error");
const radioGroupErrorElement = allErrorElements[allErrorElements.length - 1];
// Regular Expression for numeric validation
const mortgageRegEx = /^\d*\.?\d*$/;
/* separate CSS object for styling user input error feedback */
const inputErrorStyles = {
  background: "var(--color-red)",
  color: "var(--color-white",
};
// Currency formatter - format calculation results
const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// show and hide error element styles
const toggleErrorElementStyles = (
  errorElement,
  errorElementText,
  displayErrorElement
) => {
  if (displayErrorElement) {
    errorElement.classList.add("show-error");
    errorElement.textContent = errorElementText;
  } else {
    errorElement.classList.remove("show-error");
    errorElement.textContent = "";
  }
};
const toggleInputErrorBorder = (suffixElement, displayInputError) => {
  Object.keys(inputErrorStyles).forEach((key) => {
    suffixElement.style[key] = displayInputError ? inputErrorStyles[key] : "";
  });
};
const toggleInputErrorStyles = (input, suffix, addError) => {
  if (addError) {
    input.classList.add("input-error-border");
    if (suffix) {
      toggleInputErrorBorder(suffix, true);
    }
  } else {
    input.classList.remove("input-error-border");
    if (suffix) {
      toggleInputErrorBorder(suffix, false);
    }
  }
};

// function to validate user input in real time
const validateInput = (input, index) => {
  const inputValue = input.value.trim();
  const errorElement = allErrorElements[index];
  const suffix = inputSuffixElements[index];

  if (inputValue === "") {
    // Show "This field is required" error message if the input is empty
    toggleErrorElementStyles(errorElement, "This field is required", true);
    toggleInputErrorStyles(input, suffix, true);
  } else if (!mortgageRegEx.test(inputValue)) {
    // Show "Only numeric value allowed" error message if the input does not match the regex
    toggleErrorElementStyles(errorElement, "Only numeric values allowed", true);
    toggleInputErrorStyles(input, suffix, true);
  } else {
    // Clear the error message if the input matches the regex
    toggleErrorElementStyles(errorElement, "", false);
    toggleInputErrorStyles(input, suffix, false);
  }
};

const animateResults = () => {
  const resultsDisplayed = document.querySelector(".results-displayed");
  const header = resultsDisplayed.querySelector("h2");
  const description = resultsDisplayed.querySelector("p");
  const calcResults = resultsDisplayed.querySelector(".calc-results");
  const resultItems = Array.from(calcResults.children);

  // Fade in the results-displayed container
  gsap.fromTo(resultsDisplayed, { opacity: 0 }, { opacity: 1, duration: 0.5 });

  // Animate header
  gsap.fromTo(
    header,
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.5 }
  );

  // Animate description paragraph
  gsap.fromTo(
    description,
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 1 }
  );

  // Animate result items (sliding in)
  gsap.fromTo(
    resultItems,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 0.5, stagger: 0.3, delay: 1.5 }
  );

  // Animate numbers sliding into place with a smooth transition
  resultItems.forEach((item, index) => {
    const number = item.querySelector("p");
    if (number) {
      gsap.fromTo(
        number,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay: 2 + index * 0.1,
          ease: "power2.out",
        }
      );
    }
  });
};

const toggleRadioStyles = (containerElement, checked) => {
  // remove class by default
  containerElement.classList.remove("selected");

  if (checked) {
    containerElement.classList.add("selected");
    radioGroupErrorElement.classList.remove("show-radio-error");
  } else {
    radioGroupErrorElement.classList.add("show-radio-error");
  }
};

const selectRadioContainer = () => {
  let isRadioChecked = false;

  radioContainers.forEach((container, index) => {
    const radio = radioButtonInputs[index];
    const checked = radio.checked;

    toggleRadioStyles(container, checked);
    if (checked) {
      isRadioChecked = true;
    }
  });

  if (!isRadioChecked) {
    toggleErrorElementStyles(
      radioGroupErrorElement,
      "This field is required",
      true
    );
  } else {
    toggleErrorElementStyles(radioGroupErrorElement, "", false);
  }

  return isRadioChecked;
};

const updateRepaymentResults = (
  monthlyRepayment,
  monthlyInterest,
  totalInterest,
  termValue,
  totalRepayment
) => {
  const checkedRadio = Array.from(radioButtonInputs).find(
    (radio) => radio.checked
  );

  if (checkedRadio) {
    const checkedLabel = document.querySelector(
      `label[for='${checkedRadio.id}']`
    );

    if (checkedLabel.textContent === "Repayment") {
      // Total repayments for "Repayment" option
      const totalRepaymentAmount = monthlyRepayment * 12 * termValue;
      monthlyRepayments.textContent = `${formatter.format(monthlyRepayment)}`;
      totalRepayments.textContent = `${formatter.format(totalRepayment)}`;
    } else if (checkedLabel.textContent === "Interest Only") {
      // Monthly interest and total interest for "Interest Only" option
      monthlyRepayments.textContent = `${formatter.format(monthlyInterest)}`;
      totalRepayments.textContent = `${formatter.format(totalInterest)}`;
    }
  }
};

// calculate repayments
const calculateMortgage = () => {
  // Convert string input values to numbers
  const amountValue = parseFloat(document.getElementById("amount").value);
  const termValue = parseFloat(document.getElementById("term").value); // years
  const interestRateValue = parseFloat(
    document.getElementById("interest-rate").value
  ); // %

  if (isNaN(amountValue) || isNaN(termValue) || isNaN(interestRateValue)) {
    return;
  }

  // Convert annual interest rate to monthly and percentage to decimal
  const monthlyInterestRate = interestRateValue / 100 / 12;
  const numberOfPayments = termValue * 12;

  // Calculate monthly repayment (principal + interest)
  const monthlyRepayment =
    (amountValue * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

  // Calculate total repayment (principal + interest)
  const totalRepayment = monthlyRepayment * numberOfPayments;

  // Calculate 'interest only' option values
  const totalMonthlyInterestOnly = amountValue * monthlyInterestRate;
  const totalInterestOnly = totalMonthlyInterestOnly * numberOfPayments;

  // Update results based on selected option
  updateRepaymentResults(
    monthlyRepayment,
    totalMonthlyInterestOnly,
    totalInterestOnly,
    termValue,
    totalRepayment
  );
};

// separate function to display proper container - results section
const updateContainerStyles = (toggle) => {
  if (toggle === "show") {
    calculationResultsHiddenContainer.classList.add("hide");
    calculationResultsDisplayedContainer.classList.add("show");
  } else if (toggle === "hide") {
    calculationResultsHiddenContainer.classList.remove("hide");
    calculationResultsDisplayedContainer.classList.remove("show");

    // Resetting inline styles to ensure elements are hidden
    calculationResultsHiddenContainer.style.opacity = "";
    calculationResultsDisplayedContainer.style.opacity = "";
  }
};

const validateForm = () => {
  let isValid = true;
  // default styles for result containers
  // also, it reverts to default on invalid form submission
  updateContainerStyles("hide");

  mortgageTextInputs.forEach((input, index) => {
    validateInput(input, index);
    if (allErrorElements[index].classList.contains("show-error")) {
      isValid = false;
    }
  });

  if (!selectRadioContainer()) {
    isValid = false;
  }

  if (isValid) {
    // calculate mortgage
    calculateMortgage();
    // display container that contains results
    updateContainerStyles("show");
    // animate results after successful form submission/calculation
    animateResults();
  }

  return isValid;
};

// main container animation function
const animateMainContainer = () => {
  const container = document.querySelector(".container");

  gsap.fromTo(
    container,
    { y: -window.innerHeight, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "bounce.out",
    }
  );
};

const clearErrorStyles = (element) => {
  // remove error text
  element.classList.remove("show-error");
};

const clearInputBorder = (input, suffix) => {
  // remove input border error indicator
  input.classList.remove("input-error-border");
  if (suffix) {
    // remove input suffix element error background
    toggleInputErrorBorder(suffix, false);
  }
};

const resetCalcForm = () => {
  // Reset the form fields to their default values
  calcForm.reset();

  // Clear all error messages
  allErrorElements.forEach((errorElement) => {
    errorElement.classList.remove("show-error");
    errorElement.textContent = "";
  });
  // Clear radio buttons container error message
  radioGroupErrorElement.classList.remove("show-radio-error");
  // Reset input borders and suffix styles
  mortgageTextInputs.forEach((input, index) => {
    const suffix = inputSuffixElements[index];
    input.classList.remove("input-error-border");
    if (suffix) {
      toggleInputErrorBorder(suffix, false);
    }
  });
  // Remove the 'selected' class from all radio containers
  radioContainers.forEach((container) => {
    container.classList.remove("selected");
  });
};

// Event listeners
// animate container after all resources have loaded
window.addEventListener("load", animateMainContainer);
// real time user input validation
mortgageTextInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    validateInput(input, index);
  });
});
// radio buttons
radioButtonInputs.forEach((radio) => {
  radio.addEventListener("change", () => selectRadioContainer());
});
// form submission event listener
calcForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }
  setTimeout(() => {
    resetCalcForm();
  }, 200);
});
// reset form and error styles - 'Clear All' button
clearFormButton.addEventListener("click", resetCalcForm);
