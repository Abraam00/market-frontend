const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

const addButton = document.getElementById("insertButton");
const payButton = document.getElementById("payButton");

const createInputSet = () => {
	const container = document.getElementById("inputsContainer");

	const wrapper = document.createElement("div");
	wrapper.classList.add("input-wrapper");

	const customerNumberInput = document.createElement("input");
	customerNumberInput.type = "text";
	customerNumberInput.placeholder = "Customer Number";
	wrapper.appendChild(customerNumberInput);

	const amountPaidInput = document.createElement("input");
	amountPaidInput.type = "text";
	amountPaidInput.placeholder = "Amount Paid";
	wrapper.appendChild(amountPaidInput);

	// Add event listener for 'tab' key to create a new set
	amountPaidInput.addEventListener("keydown", (event) => {
		if (event.key === "Tab") {
			event.preventDefault();
			createInputSet();
			setTimeout(
				() => wrapper.nextSibling.querySelector("input[type='text']").focus(),
				0
			);
		}
	});

	container.appendChild(wrapper);
};

addButton.addEventListener("click", () => {
	createInputSet();
});

payButton.addEventListener("click", () => {
	const wrappers = document.querySelectorAll(".input-wrapper");
	const promises = [];

	wrappers.forEach((wrapper) => {
		const customerId = wrapper.querySelector("input:nth-child(1)").value;
		const amountPaid = wrapper.querySelector("input:nth-child(2)").value;

		const promise = axios.put(
			`https://marketbackend.azurewebsites.net/api/Customer/UpdateMoneyRemaining/${parseInt(
				customerId
			)}/${parseInt(amountPaid)}`
		);

		promises.push(promise);
	});

	Promise.all(promises)
		.then((responses) => {
			responses.forEach((response) => {
				console.log(response.data);
			});

			// Clear all input values on successful payment
			wrappers.forEach((wrapper) => {
				wrapper.querySelector("input:nth-child(1)").value = "";
				wrapper.querySelector("input:nth-child(2)").value = "";
			});
		})
		.catch((error) => {
			console.error("Error:", error);
		});
});

// Create the initial input set on page load
createInputSet();
