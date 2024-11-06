const mortgageAmount = document.getElementById('mortgageAmount');
const mortgageAmountError = document.getElementById('mortgageAmountError');
const mortgageTerm = document.getElementById('mortgageTerm');
const mortgageTermError = document.getElementById('mortgageTermError');
const interestRate = document.getElementById('interestRate');
const interestRateError = document.getElementById('interestRateError');
const mortgageTypeRadios = document.getElementsByName('mortgageType');
const mortgageTypeError = document.getElementById('mortgageTypeError');
const calculate = document.getElementById('calculate');
const resultRepayments = document.getElementById('resultRepayments');
const resultTotalPaid = document.getElementById('resultTotalPaid');
const emptyResult = document.getElementById('emptyResult');
const completedResult = document.getElementById('completedResult');
const resetEverthing = document.getElementById('resetEverthing');

calculate.addEventListener('click', () => {
    const mortgage_amount = mortgageAmountValue();
    const mortgage_term = mortgageTermValue();
    const interest_rate = interestRateValue();
    const mortgage_type_radios = mortgageTypeRadiosValue();
    const result = calculateMortgage(mortgage_amount, mortgage_term, interest_rate, mortgage_type_radios);
    showResult(result);
});

resetEverthing.addEventListener('click', () => {
    emptyResult.style.display = 'flex';
    completedResult.style.display = 'none';
})

const mortgageAmountValue = () => {
    const value = mortgageAmount.value.replace(/[^0-9.]/g, '');
    if (value == '' || value === 0) {
        showErrorMessage(mortgageAmountError, 'Please enter the mortgage amount');
        return 0;
    }
    if (isNaN(value)) {
        showErrorMessage(mortgageAmountError, 'Enter a valid value .e.g 145,00');
        return 0;
    }
    hideErrorMessage(mortgageAmountError);
    return value;
}


const mortgageTermValue = () => {
    const value = mortgageTerm.value;
    if (value == '') {
        showErrorMessage(mortgageTermError, 'Please enter the mortgage term');
        return 0;
    }

    if (isNaN(value)) {
        showErrorMessage(mortgageTermError, 'Enter a valid value .e.g 20');
        return 0;
    }
    hideErrorMessage(mortgageTermError);
    return value;
}

const interestRateValue = () => {
    const value = interestRate.value;
    if (value == '') {
        showErrorMessage(interestRateError, 'Please enter the interest rate');
        return 0;
    }

    if (isNaN(value)) {
        showErrorMessage(interestRateError, 'Enter a valid value .e.g 1 to 100%');
        return 0;
    }
    if (value > 100) {
        showErrorMessage(interestRateError, 'Enter a value less than 100');
        return 0;
    }
    if (value < 0) {
        showErrorMessage(interestRateError, 'Enter a value greater than 0');
        return 0;
    }
    hideErrorMessage(interestRateError);
    return value;
}


const mortgageTypeRadiosValue = () => {
    let selectedValue;
    for (const radio of mortgageTypeRadios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }
    if (!selectedValue) {
        showErrorMessage(mortgageTypeError, 'Please select either Repayment or Interest Only');
        return '';
    }
    hideErrorMessage(mortgageTypeError);
    return selectedValue;
}


function showErrorMessage(errorElement, errorMessage) {
    errorElement.style.visibility = 'visible';
    errorElement.textContent = errorMessage;
    errorElement.classList.remove('warrnings');
    void errorElement.offsetWidth;
    errorElement.classList.add('warrnings');
}

function hideErrorMessage(errorElement) {
    errorElement.style.visibility = 'hidden';

}

function showResult(result) {
    console.log("result: " + result);
    if (!result) {
        console.error('⛔ something went wrong while calculating martgage');
        return;
    }

    resultRepayments.textContent = `£${result.monthlyPayment}`;
    resultTotalPaid.textContent = `£${result.totalPaid}`;
    emptyResult.style.display = 'none';
    completedResult.style.display = 'flex';
}


const calculateMortgage = (P, years, annualIntrestRate, type) => {
    // check first if mortagage and years and interest rates are not returing 0
    if (P === 0 || years === 0 || annualIntrestRate === 0) {
        return;
    }
    // convert annual intrest rate int to monthly intrest rate
    const r = annualIntrestRate / 100 / 12;

    // total monthly payments
    const n = years * 12;

    // my monthly repayments
    let M;

    // calculate monthly repayment  : when user chose martgage type Repayment
    if (type === 'repayment') {
        M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (type === 'interestOnly') {
        M = P * r;
    }

    // calculate total payments during user is paying 
    // total you 'll repay over the term (years)
    const totalPaid = M * n;

    return {
        monthlyPayment: M.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
        totalPaid: totalPaid.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
    };

}

function formatNumber(input) {

    const cursorPosition = input.selectionStart;

    // clean text input 
    const value = input.value.replace(/,/g, '');


    if (value === "" || value === ".00" || isNaN(value)) {
        input.value = "";
        return;
    }

    // check the input value is just a number
    if (/[^0-9.]/.test(value)) {
        // revert the value as it was
        input.value = value.replace(/[^0-9.]/g, '');
        return;
    }

    // format number using locale string function
    const formattedValue = parseFloat(value).toLocaleString(undefined);

    // set the formatted value in input field
    input.value = formattedValue;

    input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
}

fieldSelect();

function fieldSelect() {
    const fields = document.querySelectorAll('.fields');
    fields.forEach((field, index) => {
        field.addEventListener('keydown', (event) => {
            const key = event.key;
            if (key === 'Enter') {
                if (index > 2) {
                    fields[index].click();
                }
            }
            if (key === 'ArrowDown' || key === 'Enter' || key === 'ArrowRight') {
                event.preventDefault();
                if (index < fields.length - 1) {
                    fields[index + 1].focus();
                }
            }

            if (key === 'ArrowUp' || key === 'ArrowLeft') {
                event.preventDefault();
                if (index > 0) {
                    fields[index - 1].focus();
                }
            }
        })
    });
}