document.addEventListener('DOMContentLoaded', () => {

    // console.log(Fancybox);
    Fancybox.bind("[data-fancybox]", {
        autoFocus: false,
        trapFocus: false,
        placeFocusBack: false,
        dragToClose: false,
        on: {
            done: (fancybox, slide) => {
                if (fancybox.isCurrentSlide(slide) && slide.contentEl.id === "filter") {
                    fancybox.dragToClose = false;
                }
            },
        },
    });
    // $('[data-fancybox]').fancybox({
    //     autoFocus: false
    // });
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn')
    const bodyEl = document.querySelector('body');
    const headerMobileMenu = document.querySelector('.header-mobile-menu');
    const header = document.querySelector('header');
    const cookieEl = document.querySelector('.cookie');

    const mainCarousel = $('.main-carousel');

    if (mainCarousel) {
        const mainCarouselMiniature = document.querySelectorAll('.main-carousel__nav-mini-img');
        const prevBtn = document.querySelector('.main-carousel__nav-btns .prev');
        const nextBtn = document.querySelector('.main-carousel__nav-btns .next');
        const autoplayTimeout = 6000;

        mainCarousel.owlCarousel({
            loop: false,
            margin: 0,
            items: 1,
            dots: false,
            autoplay: true,
            slideTransition: 'ease-in-out',
            autoplayTimeout: autoplayTimeout,
            nav: false,
            onInitialized: function (e) {
                const itemsCount = e.item.count;
                const itemsCountEl = document.querySelector('.main-carousel__nav-pagination .total');

                if (mainCarouselMiniature && e.item.count) {
                    mainCarouselMiniature.forEach((mini, k) => {
                        mini.style.zIndex = e.item.count - k;
                    });
                }

                itemsCountEl.textContent = itemsCount;
            },
            onChanged: function (e) {
                const itemActiveIndex = e.item.index;
                const itemsActiveEl = document.querySelector('.main-carousel__nav-pagination .current');
                const activeIndex = Number(itemActiveIndex) + 1;
                const itemsCount = Number(e.item.count);
                itemsActiveEl.textContent = activeIndex;

                if (mainCarouselMiniature && e.item.index >= 0) {

                    mainCarouselMiniature.forEach((mini, k) => {
                        if (e.item.index === k) {
                            mini.classList.add('active');
                            mini.style.zIndex = 9;

                            const svg = mini.querySelector('.main-carousel__nav-mini-img svg');
                            if(window.matchMedia('(min-width: 1921px)').matches) {
                                svg.style.width = '115px'
                                svg.style.height = '115px'
                            }

                            const paths = mini.querySelector('.main-carousel__nav-mini-img svg path');
                            anime({
                                targets: paths,
                                duration: autoplayTimeout,
                                delay: 0,
                                easing: 'linear',
                                strokeDashoffset: [anime.setDashoffset, 0]
                            });
                        } else {
                            mini.classList.remove('active');
                            mini.style.zIndex = itemsCount - k;
                        }
                    });
                }

                if (activeIndex && activeIndex === 1) {
                    prevBtn.classList.add('inactive');
                } else if (activeIndex && itemsCount && activeIndex === itemsCount) {
                    nextBtn.classList.add('inactive');
                } else {
                    prevBtn.classList.remove('inactive');
                    nextBtn.classList.remove('inactive');
                }
            },
        })

        $('.main-carousel__nav-btns .next').click(function () {
            mainCarousel.trigger('next.owl.carousel');
        })
        $('.main-carousel__nav-btns .prev').click(function () {
            mainCarousel.trigger('prev.owl.carousel');
        })
    }

    

    let isMenuActive = false;
    const isHeaderTransparent = header.classList.contains('transparent');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();

            isMenuActive = !isMenuActive

            if (isMenuActive) {
                bodyEl.classList.add('fixed')
                mobileMenuBtn.classList.add('active')
                headerMobileMenu.classList.add('active');
                header.classList.add('fixed', 'opened');
                if (isHeaderTransparent) {
                    header.classList.remove('transparent');
                }
            } else {
                bodyEl.classList.remove('fixed')
                mobileMenuBtn.classList.remove('active')
                headerMobileMenu.classList.remove('active');
                header.classList.remove('fixed', 'opened');
                if (isHeaderTransparent) {
                    header.classList.add('transparent');
                }
            }
        });
    }

    $('a[href^="#"].btn').bind("click", function (e) {
        if (isMenuActive) {
            $('#mobile-menu-btn').click();
        }
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top - 100
        }, 1000);
        e.preventDefault();
    });

    const cityModal = document.querySelector('.modal.city');
    const chooseCityPopup = document.querySelector('.choose-city-popup');

    if (chooseCityPopup) {
        const btns = chooseCityPopup.querySelectorAll('.btn');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                chooseCityPopup.classList.add('d-none');
            });
        });
    }
    if (cityModal) {
        const cityInput = cityModal.querySelector('input');
        const cityList = cityModal.querySelectorAll('.city-list li');
        const emptyText = cityModal.querySelector('.empty');
        const checkCity = cityModal.querySelector('.check-city');
        const cityListTitle = cityModal.querySelector('.city-list .title');
        let cityListTitleDefault = '';

        if (cityListTitle) {
            cityListTitleDefault = cityListTitle.textContent; 
        }

        cityList.forEach(city => {
            city.addEventListener('click', (e) => {
                e.preventDefault();

                chooseCityPopup.classList.add('d-none');
                Fancybox.close();
            });
        });

        let numberOfFound = 0;
        cityInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === "") {
                checkCity.classList.remove('d-none');
                cityListTitle.textContent = cityListTitleDefault;
            } else {
                checkCity.classList.add('d-none'); 
                cityListTitle.textContent = cityListTitle.getAttribute('data-search');
            }
            numberOfFound = 0;
            cityList.forEach(city => {
                if (city.textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
                    numberOfFound++;
                    city.classList.remove('d-none');
                } else {
                    city.classList.add('d-none');
                }
            });
            if (numberOfFound === 0) {
                emptyText.classList.remove('d-none')
            } else {
                emptyText.classList.add('d-none')
            }
        });
    }


    if(cookieEl) {
        if (!localStorage.getItem("cookie")) {
            setTimeout(() => {
                cookieEl.classList.remove('d-none');
            }, 1000);
        }

        const cookieCloseBtn = cookieEl.querySelector('.btn');
        cookieCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();

            localStorage.setItem("cookie", "ok");
            cookieEl.classList.add('d-none');
        });
    }

    const faqItems = document.querySelectorAll('.faq .item');

    faqItems.forEach(fitem => {
        const title = fitem.querySelector(".title");
        if (!title) {
            return;
        }
        title.addEventListener('click', (e) => {
            e.preventDefault();

            fitem.classList.toggle('active');
        });
    })

    const seoTexts = document.querySelectorAll('.seo-text');

    seoTexts.forEach(seotext => {
        const btn = seotext.querySelector('.toggle-seo');

        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (seotext.classList.contains('active')) {
                btn.querySelector('span').textContent = "Читать полностью";
                seotext.classList.remove('active');
            } else {
                btn.querySelector('span').textContent = "Скрыть";
                seotext.classList.add('active');
            }
            
        });
    });

    $('.product-list__carousel').each(function() {
        $(this).owlCarousel({
            loop: false,
            margin: 24,
            autoWidth: false,
            nav: true,
            autoplay: false,
            navText: [
                `<div class="nav-btn prev">
                <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45 11.9948H0.589758C4.53733 12.3896 12.4325 10.6921 12.4325 0.744202M0.589758 12.0463C4.53733 11.6516 12.4325 13.349 12.4325 23.2969" stroke="#624C49" stroke-width="1.02326"/>
                </svg>
            </div>`,
                `<div class="nav-btn next">
                <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 11.9944H44.5997C40.6353 12.3909 32.7064 10.6862 32.7064 0.695862M44.5997 12.0462C40.6353 11.6498 32.7064 13.3545 32.7064 23.3448" stroke="#624C49" stroke-width="1.02762"/>
                </svg>
            </div>`
            ],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                900: {
                    items: 3
                },
                1921: {
                    items: 4
                }
            }
        });
    });

    $('.sale-list__carousel').each(function () {
        $(this).owlCarousel({
            loop: false,
            margin: 24,
            autoWidth: false,
            nav: true,
            autoplay: false,
            navText: [
                `<div class="nav-btn prev">
                <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45 11.9948H0.589758C4.53733 12.3896 12.4325 10.6921 12.4325 0.744202M0.589758 12.0463C4.53733 11.6516 12.4325 13.349 12.4325 23.2969" stroke="#624C49" stroke-width="1.02326"/>
                </svg>
            </div>`,
                `<div class="nav-btn next">
                <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 11.9944H44.5997C40.6353 12.3909 32.7064 10.6862 32.7064 0.695862M44.5997 12.0462C40.6353 11.6498 32.7064 13.3545 32.7064 23.3448" stroke="#624C49" stroke-width="1.02762"/>
                </svg>
            </div>`
            ],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 2
                }
            }
        });
    });

    $('.selector-carousel').each(function () {
        $(this).owlCarousel({
            loop: false,
            margin: 14,
            autoWidth: false,
            dots: false,
            nav: true,
            autoplay: false,
            navText: [
                `<div class="nav-btn prev">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="1">
                            <path d="M6.42642 11.9949C10.2843 12.3807 18 10.7218 18 1M6.42642 12.0453C10.2843 11.6595 18 13.3184 18 23.0402" stroke="#624C49"/>
                        </g>
                    </svg>
                </div>`,
                `<div class="nav-btn next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5736 11.9949C13.7157 12.3807 6 10.7218 6 1M17.5736 12.0453C13.7157 11.6595 6 13.3184 6 23.0402" stroke="#624C49"/>
                    </svg>
                </div>`
            ],
            responsive: {
                0: {
                    items: 1
                },
                400: {
                    items: 3
                },
                500: {
                    items: 4
                },
                650: {
                    items: 5
                },
                900: {
                    items: 5
                },
                1000: {
                    items: 3
                },
                1200: {
                    items: 4
                },
                1300: {
                    items: 5,
                    margin: 7
                },
                1400: {
                    items: 5,
                    margin: 14
                }
            }
        });
    })

    $('.shops-slider').each(function () {
        $(this).owlCarousel({
            loop: false,
            items: 1,
            margin: 14,
            autoWidth: false,
            dots: false,
            nav: true,
            autoplay: false,
            animateOut: 'fadeOut',
            navText: [
                `<div class="nav-btn prev">
                    <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M45 11.9944H0.400327C4.36474 12.3908 12.2936 10.6861 12.2936 0.695801M0.400327 12.0461C4.36474 11.6497 12.2936 13.3544 12.2936 23.3447" stroke="white" stroke-width="1.02762"/>
                    </svg>
                </div>`,
                `<div class="nav-btn next">
                    <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 11.9944H44.5997C40.6353 12.3908 32.7064 10.6861 32.7064 0.695801M44.5997 12.0461C40.6353 11.6497 32.7064 13.3544 32.7064 23.3447" stroke="white" stroke-width="1.02762"/>
                    </svg>
                </div>`
            ],
        });
    })

    $('.blog-detail__text-slider').each(function () {
        $(this).owlCarousel({
            loop: true,
            items: 1,
            autoWidth: false,
            dots: false,
            nav: true,
            autoplay: false,
            navText: [
                `<div class="nav-btn prev">
                    <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M45 11.9944H0.400327C4.36474 12.3908 12.2936 10.6861 12.2936 0.695801M0.400327 12.0461C4.36474 11.6497 12.2936 13.3544 12.2936 23.3447" stroke="white" stroke-width="1.02762"/>
                    </svg>
                </div>`,
                `<div class="nav-btn next">
                    <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 11.9944H44.5997C40.6353 12.3908 32.7064 10.6861 32.7064 0.695801M44.5997 12.0461C40.6353 11.6497 32.7064 13.3544 32.7064 23.3447" stroke="white" stroke-width="1.02762"/>
                    </svg>
                </div>`
            ],
        });
    })

    const textWrap = document.querySelector('.text-wrap');
    const rightMenu = document.querySelector('.right-menu.titles');

    if (textWrap && rightMenu) {
        const titles = textWrap.querySelectorAll('h2');

        titles.forEach((title, i) => {
            title.id = `section-${i}`;

            const listItem = document.createElement('li');
            const listItemLink = document.createElement('a');
            listItemLink.textContent = title.textContent;
            listItemLink.href = `#section-${i}`;
            listItem.append(listItemLink);

            const listItemLinkWrap = rightMenu.querySelector('ul');

            if (listItemLinkWrap) {
                listItemLinkWrap.append(listItem);
            }
        });
    }

    const textTitles = $(".dynamic-titles h1, .dynamic-titles h2, .dynamic-titles h3");
    const nav = $(".blog-detail .left-menu");

    textTitles.each(function (e, val) {
        textTitles[e].id = 'title_'+e;
        nav.find("ul").append(`<li><a href="#title_${e}">${val.textContent}</a></li>`);
    });

    $(window).on("scroll", () => {
        const position = $(this).scrollTop();

        textTitles.each(function () {
            const top = $(this).offset().top - 200;
            const bottom = top + $(this).outerHeight();

            if (position >= top && position <= bottom) {
                nav.find("a").removeClass("active");

                const aEl = nav.find('a[href="#' + $(this).attr('id') + '"]');
                aEl.addClass("active");
            }
        });
    });

    nav.find("a").on("click", function () {
        const id = $(this).attr("href");

        $("html, body").animate({
            scrollTop: $(id).offset().top - 150
        }, 1000);

        return false;
    });

    const customSelector = document.querySelectorAll(".custom-selector");

    if (customSelector.length) {
        customSelector.forEach(selector => {
            const selectedItemEl = selector.querySelector(".selected-item");
            const inputs = selector.querySelectorAll('input[type="radio"]');

            if (inputs.length) {
                inputs.forEach(i => {
                    i.addEventListener("change", (e) => {
                        selectedItemEl.setAttribute("data-value", e.target.value);
                        selectedItemEl.textContent = i.nextElementSibling.textContent;
                    });
                })
            }

        });
    }
});