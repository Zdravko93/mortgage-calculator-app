import { formatter } from "./helpers.js";

// Calculate both repayment and interest-only mortgage results
export const calculateMortgage = (amount, termYears, annualRate) => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  // Repayment mortgage (principal + interest)
  const monthlyRepayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));

  const totalRepayment = monthlyRepayment * numPayments;

  // Interest-only mortgage
  const monthlyInterestOnly = amount * monthlyRate;
  const totalInterestOnly = monthlyInterestOnly * numPayments;

  return {
    monthlyRepayment,
    totalRepayment,
    monthlyInterestOnly,
    totalInterestOnly,
  };
};

// Update displayed results based on mortgage type
export const updateResults = (
  radioButtons,
  monthlyRepayment,
  totalRepayment,
  monthlyInterest,
  totalInterest
) => {
  const checkedRadio = Array.from(radioButtons).find((r) => r.checked);
  if (!checkedRadio) return;

  const label = document.querySelector(`label[for="${checkedRadio.id}"]`);
  const isRepayment = label.textContent.trim() === "Repayment";

  const monthlyEl = document.querySelector(".monthly-repayments");
  const totalEl = document.querySelector(".total-repayments");

  monthlyEl.textContent = formatter.format(
    isRepayment ? monthlyRepayment : monthlyInterest
  );
  totalEl.textContent = formatter.format(
    isRepayment ? totalRepayment : totalInterest
  );
};
