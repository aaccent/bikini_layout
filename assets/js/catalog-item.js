document.addEventListener('DOMContentLoaded', () => {
	const tabs = document.querySelectorAll(".tabs");

	if (tabs.length) {
		tabs.forEach(tab => {
			const tabsContentBlock = tab.nextElementSibling;
			const tabsContents = tabsContentBlock.querySelectorAll(".tabs-content .tabs-content__item");

			if (!tabsContents.length) {
				return;
			}

			const tabsBtns = tab.querySelectorAll(".tabs .tabs-item");

			tabsBtns.forEach(tBtn => {
				tBtn.addEventListener("click", (e) => {
					e.preventDefault();

					const tabID = tBtn.getAttribute("data-tab");

					tabsBtns.forEach(tB => tB.classList.remove("active"));

					tBtn.classList.add("active")

					tabsContents.forEach(tContent => {
						if (tContent.getAttribute("data-tab") === tabID) {
							tContent.classList.add("active");
						} else {
							tContent.classList.remove("active");
						}
					});
				});
			});

		});
	}

	const firstImg = document.querySelector(".catalog-item__img .img");
	const adaptive = window.matchMedia('(min-width: 1921px)').matches ? 200 : 150

	if (firstImg) {
		const firstImgCoords = firstImg.getBoundingClientRect();

		const stickyRight = new Sticky('.sticky-right', {
			className: "test",
			marginTop: firstImgCoords.height - adaptive
		});

		const stickyCenter = new Sticky('.sticky-center', {
			className: "test",
			marginTop: firstImgCoords.height - 80 + 150
		});

		stickyRight.run();
		stickyCenter.run();
	}



	const cardImages = $(".catalog-item__img .img");
	const nav = $(".slider-mini");

	$(window).on("scroll", () => {
		const position = $(this).scrollTop();

		cardImages.each(function () {
			const top = $(this).offset().top - 200;
			const bottom = top + $(this).outerHeight();

			if (position >= top && position <= bottom) {
				nav.find(".slider-mini__img").removeClass("active");

				const aEl = nav.find('.slider-mini__img[data-id="' + $(this).attr('id') + '"]');
				aEl.addClass("active");
			}
		});
	});

	nav.find(".prev").on("click", function () {
		const activeImgs = document.querySelectorAll(".slider-mini__img.active");

		if (activeImgs.length) {
			const activeItem = activeImgs[0];
			const prevElement = activeItem.previousElementSibling;

			if (prevElement.classList.contains("slider-mini__img")) {
				// activeItem.classList.remove("active");
				// prevElement.classList.add("active");

				$("html, body").animate({
					scrollTop: $(`#${prevElement.getAttribute("data-id")}`).offset().top - 150
				}, 200);
			}
		}
	});

	nav.find(".next").on("click", function () {
		const activeImgs = document.querySelectorAll(".slider-mini__img.active");

		if (activeImgs.length) {
			const activeItem = activeImgs[0];
			const nextElment = activeItem.nextElementSibling;

			if (nextElment.classList.contains("slider-mini__img")) {
				// activeItem.classList.remove("active");
				// nextElment.classList.add("active");

				$("html, body").animate({
					scrollTop: $(`#${nextElment.getAttribute("data-id")}`).offset().top - 150
				}, 200);
			}
		}
	});

	nav.find(".slider-mini__img").on("click", function () {
		const id = $(this).attr("data-id");

		$("html, body").animate({
			scrollTop: $(`#${id}`).offset().top - 150
		}, 200);

		return false;
	});




	const sizesform = document.querySelector(".filter#size form");

	if (sizesform) {
		sizesform.addEventListener("submit", (e) => {
			e.preventDefault();
		});
		const inputs = sizesform.querySelectorAll('input');
		const submitBtn = sizesform.querySelector('button.add-to-cart');

		submitBtn.addEventListener("click", () =>{
			Fancybox.close()
		});

		if (inputs.length) {
			inputs.forEach(input => {
				input.addEventListener("change", () => {
					if (!submitBtn) {
						return
					}
					submitBtn.removeAttribute("disabled");
				});
			});
		}
	}

	const colorform = document.querySelector(".filter#color form");

	if (colorform) {
		colorform.addEventListener("submit", (e) => {
			e.preventDefault();
		});
		const inputs = colorform.querySelectorAll('input');

		if (inputs.length) {
			inputs.forEach(input => {
				input.addEventListener("change", () => {
					Fancybox.close()
				});
			});
		}
	}
});

