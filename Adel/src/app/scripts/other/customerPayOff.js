const axios = require("axios");

document.getElementById("backButton").addEventListener("click", () => {
	window.history.back();
});

const addButton = document.getElementById("insertButton");
const payButton = document.getElementById("payButton");

addButton.addEventListener("click", () => {
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

	container.appendChild(wrapper);
});

payButton.addEventListener("click", () => {
	const wrappers = document.querySelectorAll(".input-wrapper");
	wrappers.forEach((wrapper) => {
		const customerId = wrapper.querySelector("input:nth-child(1)").value;
		const amountPaid = wrapper.querySelector("input:nth-child(2)").value;

		axios
			.put(
				`https://marketbackend.azurewebsites.net/api/Customer/UpdateMoneyRemaining/${parseInt(
					customerId
				)}/${parseInt(amountPaid)}`
			)
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
});
