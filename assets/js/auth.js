document.addEventListener('DOMContentLoaded', () => {
	const SMS_CODE_WAIT_SECONDS = 60; // количество секунд после которых можно отправить смс повторно

	const authSteps = document.querySelectorAll(".auth-step");
	const authPhone = document.querySelector(".auth-phone");
	const smsCodeInputs = document.querySelectorAll(".sms-code input");
	const smsCodeCheckForm = document.querySelector("#check-sms-code");
	const smsCodeSendForm = document.querySelector("#send-sms-code");
	const changeStepBtnList = document.querySelectorAll("[data-change-step]");
	const repeatCodeAgain = document.querySelector(".repeat-code .again");
	const repeatCodeWait = document.querySelector(".repeat-code .wait");

	const changeStep = (step) => {
		authSteps.forEach(s => {
			s.classList.remove("active")

			if (Number(s.getAttribute("data-step")) === Number(step)) {
				s.classList.add("active");
			}
		});
	}

	const intervalList = [];
	const runSmsTimer = () => {
		intervalList.forEach((interval) => {
			clearInterval(interval);
		});
		repeatCodeAgain.style.display = "none";
		repeatCodeWait.style.display = "block";

		let timer = SMS_CODE_WAIT_SECONDS;
		repeatCodeWait.querySelector("span").textContent = timer;

		intervalList.push(setInterval(() => {
			timer -= 1;
			repeatCodeWait.querySelector("span").textContent = timer;

			if (timer === 0) {
				repeatCodeWait.style.display = "none";
				repeatCodeAgain.style.display = "block";
			}
		}, 1000));
	}

	const isCorrectCode = () => {
		return false;
	}

	const setFormInactive = () => {
		smsCodeCheckForm.classList.add("inactive");
		smsCodeCheckForm.classList.remove("incorrect");
		smsCodeCheckForm.querySelector("button").setAttribute("disabled", "disabled")
	}

	const setFormActive = () => {
		smsCodeCheckForm.classList.remove("inactive")
		smsCodeCheckForm.querySelector("button").removeAttribute("disabled")
	}

	if (repeatCodeAgain) {
		repeatCodeAgain.addEventListener("click", () => {
			runSmsTimer();
		});
	}

	if (changeStepBtnList.length) {
		changeStepBtnList.forEach(btn => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();

				smsCodeCheckForm.classList.remove("incorrect");
				changeStep(btn.getAttribute("data-change-step"));
				for (let i = 0; i < smsCodeInputs.length; i++) {
					smsCodeInputs[i].value = "";
				}
			})
		})
	}

	if (authSteps.length) {
		authSteps[0].classList.add("active");
	}

	let isActiveForm = true;
	for (let i = 0; i < smsCodeInputs.length; i++) {
		smsCodeInputs[i].addEventListener("input", (e) => {
			if (!e.target.value.match(/[0-9]+/)) {
				e.target.value = '';
			}
			if (e.target.value.length > 1) {
				e.target.value = e.target.value[e.target.value.length-1];
				smsCodeCheckForm.classList.remove("incorrect");
			}
			if (i + 1 < smsCodeInputs.length && e.target.value.trim() !== "") {
				smsCodeInputs[i+1].focus()
			}
			if (e.target.value.trim() === "") {
				setFormInactive();
			}

			let checkIsFormActive = true;
			smsCodeInputs.forEach(input => {
				if(input.value.trim() === "") {
					checkIsFormActive = false;
				}
			})
			if (checkIsFormActive) {
				setFormActive();
			} else {
				setFormInactive();
			}
		});

		if (smsCodeInputs[i].value.trim() === "") {
			isActiveForm = false;
		}
	}

	if (isActiveForm) {
		setFormActive();
	} else {
		setFormInactive();
	}

	if (smsCodeSendForm) {
		smsCodeSendForm.addEventListener("submit", (e) => {
			e.preventDefault();

			authPhone.textContent = e.target.querySelector('input[name="phone"]').value;

			changeStep(2);
			runSmsTimer();
		})
	}

	if (smsCodeCheckForm) {
		smsCodeCheckForm.addEventListener("submit", (e) => {
			e.preventDefault();

			if (!isCorrectCode()) {
				smsCodeCheckForm.classList.add("incorrect")
			}
		})
	}
});