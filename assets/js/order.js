document.addEventListener('DOMContentLoaded', () => {
	const validatePhone = (phone) => {
		return /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/.test(phone);
	}

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const openOrderBtns = document.querySelectorAll(".open-order-btn");
	const cartOrder = document.querySelector(".cart-order");
	const cartOrderClose = document.querySelector(".cart-order .cart-order__top .close");

	if (openOrderBtns.length && cartOrder) {
		openOrderBtns.forEach(ooBtn => {
			ooBtn.addEventListener("click", (e) => {
				cartOrder.classList.add("active")
				setTimeout(() => {
					document.querySelector("body").classList.add("hide-scrollbar");
					document.querySelector("html").classList.add("with-fancybox");
				}, 1000);
			});
		})

		if (cartOrderClose) {
			cartOrderClose.addEventListener("click", (e) => {
				cartOrder.classList.remove("active")
				document.querySelector("body").classList.remove("hide-scrollbar");
				document.querySelector("html").classList.remove("with-fancybox");
			});
		}
	}


	class Order { d
		constructor() {
			this.steps = {
				user: new Step("#order-user", this.userHandler, this.userValidator),
				delivery: new Step("#order-delivery", this.deliveryHandler, () => false),
				payment: new Step("#order-payment", this.paymentHandler, () => false),
			};

			this.steps.user.linkNextStep(this.steps.delivery);
			this.steps.delivery.linkNextStep(this.steps.payment);

			this.openStep(Object.keys(this.steps)[0])
			// this.steps.user.done()
		}

		openStep(step, closeOthers = false) {
			this.steps[step].open()
		}

		userValidator(parentEl) {
			const inputs = parentEl.querySelectorAll("input[required]");

			if (inputs) {
				let emptyInputs = inputs.length;
				inputs.forEach(input => {
					if (input.value.length > 0) {
						if (input.name === "phone") {
							if (!validatePhone(input.value)) {
								return;
							}
						}

						if (input.name === "email") {
							if (!validateEmail(input.value)) {
								return;
							}
						}

						emptyInputs--
					}
				});

				if (emptyInputs === 0) {
					return true;
				}
			}

			return false;
		}

		userHandler(step) {
			const parentEl = step.element;
			if (!parentEl) {
				return;
			}
			const descriptionCounter = parentEl.querySelector(".description .count");
			const inputs = parentEl.querySelectorAll("input[required]");
			const form = parentEl.querySelector("form");

			if (form) {
				form.addEventListener("submit", (e) => {
					e.preventDefault();

					// console.log('step.validate()', step)
					if (step.validate()) {
						step.done();
					}
				});
			}

			if (inputs) {
				descriptionCounter.textContent = inputs.length;
				inputs.forEach(input => {
					input.addEventListener("input", (e) => {
						let emptyInputs = Number(inputs.length);
						inputs.forEach(inpt => {
							if (inpt.value.length > 0) {
								if (inpt.name === "phone") {
									if (!validatePhone(inpt.value)) {
										return;
									}
								}

								if (inpt.name === "email") {
									if (!validateEmail(inpt.value)) {
										return;
									}
								}

								emptyInputs--
							}
							descriptionCounter.textContent = emptyInputs;
						})
					});
				});
			}
		}

		deliveryHandler(step) {
			const deliveryInputs = document.querySelectorAll('input[name="DELIVERY"]');
			const deliveryResult = document.querySelector("#delivery-result");
			const orderInfoDelivery = document.querySelector("#order-info-delivery");

			if (deliveryInputs.length) {
				deliveryInputs.forEach(deliveryInput => {

					// КУРЬЕРОМ СДЭК
					if(deliveryInput.value === "SDEK-DELIVERY") {
						const sdekDeliveryForm = document.querySelector(".sdek-delivery-form");

						if (sdekDeliveryForm) {
							sdekDeliveryForm.addEventListener("submit", (e) => {
								e.preventDefault();

								const formData = new FormData(e.target);

								document.querySelector(".f-button[data-fancybox-close]").click();
								deliveryInput.checked = true;
								step.done();

								const street = formData.get("street");
								const apartment = formData.get("apartment");
								const entrance = formData.get("entrance");
								const floor = formData.get("floor");

								if (deliveryResult) {
									deliveryResult.querySelector(".title").textContent = "Курьером СДЭК";
									deliveryResult.querySelector(".address").innerHTML = `<br/><br/>Улица: <b>${street}</b><br/><br/> Квартира/офис: <b>${apartment}</b><br/><br/> Подъезд: <b>${entrance}</b><br/><br/> Этаж: <b>${floor}</b>`;
									deliveryResult.querySelector(".success").textContent = "";
									orderInfoDelivery.textContent = "Курьером СДЭК";
									// success
								}
							});
						}
					}

					deliveryInput.addEventListener("change", (e) => {
						e.preventDefault();

						// СДЭК
						if(deliveryInput.value === "SDEK") {
							deliveryInput.checked = true;
							step.done()

							if (deliveryResult) {
								deliveryResult.querySelector(".title").textContent = "СДЭК";
								deliveryResult.querySelector(".address").innerHTML = "пр-кт Металлургов, 56";
								deliveryResult.querySelector(".success").textContent = "Дата доставки — понедельник, 19 июня";
								orderInfoDelivery.textContent = "СДЭК";
								// success
							}
						}

						// САМОВЫВОЗ
						if(deliveryInput.value === "SELF") {
							deliveryInput.checked = true;
							step.done()

							if (deliveryResult) {
								deliveryResult.querySelector(".title").textContent = "самовывоз из магазина";
								deliveryResult.querySelector(".address").innerHTML = "Екатеринбург, пр-кт Маршала Блюхера, д. 21";
								deliveryResult.querySelector(".success").textContent = "Можно забрать сегодня до 22:00";
								orderInfoDelivery.textContent = "Самовывоз";
								// success
							}
						}
					});
				});
			}

		}

		paymentHandler(step) {
			const inputs = document.querySelectorAll('[name="PAYMENT"]');
			const submitBtn = document.querySelectorAll(".submit-btn");

			if (inputs.length && submitBtn.length) {
				submitBtn.forEach(sBtn => {
					const button = sBtn.querySelector(".btn");
					const buttonSpan = sBtn.querySelector(".btn span");
					const submitBtnDefaultText = buttonSpan.textContent;

					inputs.forEach(input => {
						input.addEventListener("change", (e) => {
							sBtn.classList.add("active");

							if (!buttonSpan) {
								return;
							}

							button.removeAttribute("disabled")

							if (e.target.value === "CARD") {
								buttonSpan.textContent = "Оплатить 8600 ₽";
							} else {
								buttonSpan.textContent = submitBtnDefaultText;
							}
						});
					});
				});

			}
		}
	}

	class Step {
		constructor(selector, handler, validator) {
			this.selector = selector;
			this.validator = validator;
			this.nextStep = false;
			this.element = document.querySelector(selector);
			this.complete = false;
			handler(this);
			this.changeStepHandler();

			// TODO: Убрать во время сборки
			// Временно для демонстрационных целей.
			if (this.element) {
				this.element.querySelector('.order-steps__step-top')?.addEventListener('click', () => {
					if (this.element.classList.contains('active')) {
						this.close()
					} else {
						this.open()
					}
				})
			}
		}

		linkNextStep(step) {
			this.nextStep = step;
		}

		changeStepHandler() {
			const linkItem = this.element.querySelectorAll(".links .links-item.change");

			if (linkItem.length) {
				linkItem.forEach(lItem => {
					lItem.addEventListener("click", (e) => {
						e.preventDefault();

						this.undone();
						this.open();
					});
				});
			}
		}

		open() {
			this.element.classList.add("active");
			this.disableChangeBtn();
		}

		close() {
			this.element.classList.remove("active");
			this.activateChangeBtn();
		}

		validate() {
			return this.validator(this.element)
		}

		activateChangeBtn() {
			const linksItems = this.element.querySelectorAll(".links .links-item");

			if (linksItems.length) {
				linksItems.forEach(litem => {
					if (litem.classList.contains("change")) {
						litem.classList.add("active");
					} else {
						litem.classList.remove("active");
					}
				})
			}
		}

		disableChangeBtn() {
			const linksItems = this.element.querySelectorAll(".links .links-item");

			if (linksItems.length) {
				linksItems.forEach(litem => {
					if (litem.classList.contains("change")) {
						litem.classList.remove("active");
					} else {
						litem.classList.add("active");
					}
				})
			}
		}

		done() {
			this.complete = true;
			this.element.classList.add("done");
			this.close();

			if (this.nextStep) {
				this.nextStep.open();
			} else {
				// TODO:
				// - FINISH ORDER
			}
		}

		undone() {
			this.complete = false;
			this.element.classList.remove("done");
		}
	}

	window.order = new Order();
});