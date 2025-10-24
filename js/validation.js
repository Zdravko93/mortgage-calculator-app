import { toggleErrorElementStyles, toggleInputErrorStyles } from "./helpers.js";

const numericRegex = /^\d+(\.\d+)?$/; // numeric regex

// Validate individual text inputs
export const validateInput = (input, suffix, errorEl) => {
  const value = input.value.trim();

  if (!value) {
    toggleErrorElementStyles(errorEl, "This field is required", true);
    toggleInputErrorStyles(input, suffix, true);
    return false;
  }

  if (!numericRegex.test(value)) {
    toggleErrorElementStyles(errorEl, "Only numeric values allowed", true);
    toggleInputErrorStyles(input, suffix, true);
    return false;
  }

  toggleErrorElementStyles(errorEl, "", false);
  toggleInputErrorStyles(input, suffix, false);
  return true;
};

// Validate radio button group
export const validateRadioGroup = (radioButtons, radioContainers, errorEl) => {
  let isChecked = false;

  radioContainers.forEach((container, index) => {
    const radio = radioButtons[index];
    const checked = radio.checked;

    container.classList.toggle("selected", checked);
    if (checked) isChecked = true;
  });

  toggleErrorElementStyles(errorEl, "This field is required", !isChecked);
  return isChecked;
};
