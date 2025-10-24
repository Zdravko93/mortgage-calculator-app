// Error style constants
export const inputErrorStyles = {
  background: "var(--color-red)",
  color: "var(--color-white)",
};

// Number formatter for GBP currency
export const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Toggle error message display
export const toggleErrorElementStyles = (
  errorEl,
  message = "",
  show = false
) => {
  if (show) {
    errorEl.classList.add("show-error");
    errorEl.textContent = message;
  } else {
    errorEl.classList.remove("show-error");
    errorEl.textContent = "";
  }
};

// Toggle input + suffix error styles
export const toggleInputErrorStyles = (input, suffix, show = false) => {
  input.classList.toggle("input-error-border", show);

  if (suffix) {
    Object.entries(inputErrorStyles).forEach(([key, value]) => {
      suffix.style[key] = show ? value : "";
    });
  }
};

// Reset all errors and styles
export const clearErrorsAndStyles = (
  inputs,
  suffixes,
  errorEls,
  radioContainers
) => {
  errorEls.forEach((el) => {
    el.classList.remove("show-error");
    el.textContent = "";
  });

  inputs.forEach((input, index) => {
    input.classList.remove("input-error-border");

    if (suffixes[index]) {
      Object.keys(inputErrorStyles).forEach((key) => {
        suffixes[index].style[key] = "";
      });
    }
  });

  radioContainers.forEach((container) =>
    container.classList.remove("selected")
  );
};
