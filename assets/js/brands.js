document.addEventListener('DOMContentLoaded', () => {
	const brandsListFormInput = document.querySelector('.brands .tabs-content input[name="SEARCH"]');
	const brandsListNotFound = document.querySelector(".brands .tabs-content .not-found");
	const brandsListWrapList = document.querySelectorAll(".brands-list__wrap");
	const brandsListLinks = document.querySelectorAll(".brands-list a");
	const likedItemsElement = document.querySelector(".liked-items .count");

	if (brandsListFormInput) {
		brandsListFormInput.addEventListener("input", (e) => {
			const inputValue = e.target.value.trim().toLowerCase();

			searchBrandByCB((brand) => {
				return brand.textContent.trim().toLowerCase().includes(inputValue)
			})
		});
	}

	const searchBrandByCB = (cb) => {
		let brandsListWrapListCount = brandsListWrapList.length;

		if (!brandsListWrapListCount) {
			return;
		}
		brandsListWrapList.forEach((brandListWrap, i) => {
			const brandsListLinks = brandListWrap.querySelectorAll("li a");
			const brandsListInputs = brandListWrap.querySelectorAll("label span");

			const brandsList = brandsListLinks.length ? brandsListLinks : brandsListInputs;

			let brandsCount = brandsList.length;

			if (!brandsCount) {
				return;
			}

			brandsList.forEach(brand => {
				if (!cb(brand)) {
					brandsCount--;
					brand.style.display = "none";
				} else {
					brand.style.display = "block";
				}
			});

			if (brandsCount === 0) {
				brandsListWrapListCount--;
				brandsListWrapList[i].style.display = "none";
			} else {
				brandsListWrapList[i].style.display = "block";
			}
		});

		if (brandsListWrapListCount === 0) {
			brandsListNotFound.style.display = "block";
		} else {
			brandsListNotFound.style.display = "none";
		}
	}

	const countLikes = () => {
		let counter = 0;
		if (brandsListLinks.length) {
			brandsListLinks.forEach(brand => {
				if (brand.classList.contains("liked")) {
					counter++
				}
			})
		}

		if (likedItemsElement) {
			likedItemsElement.textContent = counter;

			if (counter === 0) {
				likedItemsElement.style.display = "none";
			} else {
				likedItemsElement.style.display = "inline-flex";
			}
		}

		return counter;
	}

	countLikes();

	//some element selector and a click event...plain js works here too
	$(".brands-list a").click(function(e) {
		//returns an object {before: true/false, after: true/false}
		if (psuedoClick(this).before) {
			e.preventDefault();

			e.target.classList.toggle("liked");

			countLikes();
		}
	});

	function psuedoClick(parentElem) {
		var parentLeft = parseInt(parentElem.getBoundingClientRect().left, 10),
			parentTop = parseInt(parentElem.getBoundingClientRect().top, 10);

		var before = window.getComputedStyle(parentElem, ':before');

		var beforeStart = parentLeft + (parseInt(before.getPropertyValue("left"), 10)),
			beforeEnd = beforeStart + parseInt(before.width, 10);

		var beforeYStart = parentTop + (parseInt(before.getPropertyValue("top"), 10)),
			beforeYEnd = beforeYStart + parseInt(before.height, 10);

		var after = window.getComputedStyle(parentElem, ':after');

		var afterStart = parentLeft + (parseInt(after.getPropertyValue("left"), 10)),
			afterEnd = afterStart + parseInt(after.width, 10);

		var afterYStart = parentTop + (parseInt(after.getPropertyValue("top"), 10)),
			afterYEnd = afterYStart + parseInt(after.height, 10);

		var mouseX = event.clientX,
			mouseY = event.clientY;

		const beforeClicked = (mouseX >= beforeStart && mouseX <= beforeEnd && mouseY >= beforeYStart && mouseY <= beforeYEnd);
		const afterClicked = (mouseX >= afterStart && mouseX <= afterEnd && mouseY >= afterYStart && mouseY <= afterYEnd);

		return {
			"before" : beforeClicked,
			"after"  : afterClicked
		};

	}
});