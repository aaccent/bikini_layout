document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	const addToCartPopup = document.querySelector(".add-product-popup__wrap")

	const addClickEvent = (selector, cb) => {
		body.addEventListener("click", (e) => {

			if (e.target.matches(selector)) {
				console.log(selector);
				cb(e);
			}

		})
	}

	//

	var $d4 = $("#js-range-slider");
	if ($d4) {
		$d4.ionRangeSlider();
		$d4.on("change", function () {
			var $inp = $(this);
			var v = $inp.prop("value");     // input value in format FROM;TO
			var from = new Intl.NumberFormat("ru-RU").format($inp.data("from"));   // input data-from attribute
			var to = new Intl.NumberFormat("ru-RU").format($inp.data("to"));
			$d4.parent().find(".js-range-slider__info .from span").text(from);
			$d4.parent().find(".js-range-slider__info .to span").text(to);    // all values
		});
	}

	document.querySelectorAll(".gift-price__list-item").forEach(item => {
		/** Отмена вызова попапа при нажатии на номинал*/
		item.removeAttribute('data-fancybox')
		item.removeAttribute('data-src')

		item.addEventListener("click", (e) => {
			const currentActive = document.querySelector(".gift-price__list-item.active")
			if(currentActive) currentActive.classList.remove('active')
			e.target.classList.add('active')

			const value = e.target.getAttribute("data-value");

			if (value && value !== "") {
				document.querySelectorAll("#certificate").forEach(c => {
					c.querySelectorAll('input[name="CERTIFICATE"]').forEach(input => {
						if (input.value === value) {
							input.checked = true;
						}
					})
				});
			}
		});
	});


	

	if (addToCartPopup) {
		const timeouts = [];

		const clearTimeouts = () => {
			timeouts.forEach(tm => {
				clearTimeout(tm)
			})
		}

		const addToCartProperties = {
			productName: "",
			productPrice: "",
			productImg: ""
		};

		document.querySelectorAll(".cart").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				addToCartProperties.productName = e.target.getAttribute("data-title");
				addToCartProperties.productPrice = e.target.getAttribute("data-price");
				addToCartProperties.productImg = e.target.getAttribute("data-img");
				document.querySelectorAll("#item-properties input").forEach(input => {
					input.checked = false;
				});
			});
		});

		document.querySelectorAll(".add-to-cart").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				clearTimeouts();

				const productName = e.target.getAttribute("data-title");
				const productPrice = e.target.getAttribute("data-price");
				const productImg = e.target.getAttribute("data-img");

				if (productName && productName.length) {
					addToCartPopup.querySelector('.product-name').textContent = productName;
				} else if (addToCartProperties.productName) {
					addToCartPopup.querySelector('.product-name').textContent = addToCartProperties.productName;
				}

				if (productPrice && productPrice.length) {
					addToCartPopup.querySelector('.product-price').textContent = productPrice;
				} else if (addToCartProperties.productPrice) {
					addToCartPopup.querySelector('.product-price').textContent = addToCartProperties.productPrice;
				}

				if (productImg && productImg.length) {
					addToCartPopup.querySelector('img').src = productImg;
				} else if (addToCartProperties.productImg) {
					addToCartPopup.querySelector('img').src = addToCartProperties.productImg;
				}

				addToCartPopup.classList.add("active");

				timeouts.push(setTimeout(() => {
					addToCartPopup.classList.remove("active");
				}, 5000))
				Fancybox.close();
			});
		});

		// [".add-to-cart"].forEach(selector => {
		// 	addClickEvent(selector, (e) => {
		// 		clearTimeouts();

		// 		const productName = e.target.getAttribute("data-title");
		// 		const productPrice = e.target.getAttribute("data-price");
		// 		const productImg = e.target.getAttribute("data-img");

		// 		if (productName && productName.length) {
		// 			addToCartPopup.querySelector('.product-name').textContent = productName;
		// 		} else if (addToCartProperties.productName) {
		// 			addToCartPopup.querySelector('.product-name').textContent = addToCartProperties.productName;
		// 		}

		// 		if (productPrice && productPrice.length) {
		// 			addToCartPopup.querySelector('.product-price').textContent = productPrice;
		// 		} else if (addToCartProperties.productPrice) {
		// 			addToCartPopup.querySelector('.product-price').textContent = addToCartProperties.productPrice;
		// 		}

		// 		if (productImg && productImg.length) {
		// 			addToCartPopup.querySelector('img').src = productImg;
		// 		} else if (addToCartProperties.productImg) {
		// 			addToCartPopup.querySelector('img').src = addToCartProperties.productImg;
		// 		}

		// 		addToCartPopup.classList.add("active");

		// 		timeouts.push(setTimeout(() => {
		// 			addToCartPopup.classList.remove("active");
		// 		}, 5000))
		// 	});
		// });


	}

	const productListItems = document.querySelectorAll('.product-list__item');



	/**
	 * @param {MouseEvent} event
	 * @param {HTMLElement} card
	 * @param { -1 | 1 } direction положительное число переключает на следующую картинку, отрицательное и ноль на предыдущую
	 * */
	function switchImageInProductCard(event, card, direction) {
		event.preventDefault()

		let activeImg = card.querySelector('.img-list__item.active')

		if (!activeImg) {
			const firstImg = card.querySelector('.img-list__item')
			if (!firstImg) {
				return console.info('Карточка не имеет картинок `.img-list__item`. Карточка:', card)
			}

			firstImg.classList.add('active')
			activeImg = firstImg
		}

		/** @type HTMLElement */
		let imgForSwitch = direction
			? activeImg.nextElementSibling
			: activeImg.previousElementSibling

		// Если нет соседнего элемента или он не картинка
		if (!imgForSwitch || !imgForSwitch.classList.contains('img-list__item')) {
			imgForSwitch = direction
				? card.querySelector('.img-list__item:first-of-type')
				: card.querySelector('.img-list__item:last-of-type')
		}

		if (!imgForSwitch) return

		imgForSwitch.classList.add('active')
		activeImg.classList.remove('active')
	}

	if (productListItems.length) {
		const createSvgBtn = (svgHtml, className = "") => {
			const b = document.createElement("div");
			b.classList.add("catalog-item-arrow");
			b.classList.add(className);
			b.innerHTML = svgHtml;
			return b;
		}

		productListItems.forEach(productItem => {
			const productItemLike = productItem.querySelector('.like');
			const productItemImg = productItem.querySelector('.img-list');

			if (productItemLike) {
				productItemLike.addEventListener('click', () => {
					productItemLike.classList.toggle('liked')
				});
			}

			if (productItemImg) {
				const productItemImgListItems = productItemImg.querySelectorAll('.img-list__item');

				if (productItemImgListItems.length) {
					productItemImgListItems[0].classList.add('active');
				}

				const leftBtn = createSvgBtn(`
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6.42642 11.9949C10.2843 12.3807 18 10.7218 18 1M6.42642 12.0453C10.2843 11.6595 18 13.3184 18 23.0402" stroke="#624C49"/>
					</svg>
				`, "left");
				const rightBtn = createSvgBtn(`
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17.5736 11.9949C13.7157 12.3807 6 10.7218 6 1M17.5736 12.0453C13.7157 11.6595 6 13.3184 6 23.0402" stroke="#624C49"/>
					</svg>
				`, "right");

				leftBtn.addEventListener("click", (e) => switchImageInProductCard(e,productItem, -1));
				rightBtn.addEventListener("click", (e) => switchImageInProductCard(e,productItem, 1));

				productItemImg.append(leftBtn);
				productItemImg.append(rightBtn);

				// productItemImgListItems.forEach(img => {
				// 	img.addEventListener('mouseover', (e) => {
						// const imgSrc = img.getAttribute('data-img');
						// productItemImg.style.backgroundImage = `url('${imgSrc}')`;
				// 	});
				// });
			}
		});
	}

	const catalogDetailItem = document.querySelector(".catalog-item__main");

	if (catalogDetailItem) {
		const likeBtn = catalogDetailItem.querySelector(".like-btn");

		if (likeBtn) {
			likeBtn.addEventListener('click', () => {
				likeBtn.classList.toggle('liked')
			});
		}
	}

	const changeViewBtns = document.querySelectorAll(".change-view__item");
	const catalogLists = document.querySelectorAll(".catalog-list");

	if (changeViewBtns) {
		changeViewBtns.forEach(cvBtn => {
			cvBtn.addEventListener("click", () => {
				const viewName = cvBtn.getAttribute("data-view");

				changeViewBtns.forEach(b => {
					b.classList.remove('active');
				});

				cvBtn.classList.add('active');
				changeView(viewName);
			})
		})
	}

	const changeView = (viewName) => {
		catalogLists.forEach(list => {
			list.classList.add("hidden");
			if (list.classList.contains(viewName)) {
				list.classList.remove("hidden");
			}
		})
	}


	// const catalogFilter = document.querySelector("#filter form");
	//
	// if(catalogFilter) {
	// 	const labels = catalogFilter.querySelectorAll('label');
	//
	// 	if (labels.length) {
	// 		labels.forEach(label => {
	// 			label.addEventListener("click", (e) => {
	// 				e.preventDefault();
	// 				const input = label.querySelector('input[type="checkbox"]')
	// 				if (input && !input.disabled) {
	// 					input.checked = !input.checked;
	// 				}
	//
	// 			});
	// 		});
	// 	}
	// }

});

