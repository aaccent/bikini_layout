document.addEventListener('DOMContentLoaded', () => {
    new (class MobileMenu {
        constructor() {
            this.navElements = document.querySelectorAll('.header-mobile-menu__nav nav');
            this.backBtn = document.querySelector('#header-mobile-menu__nav-back-btn');
            this.mainNav = "main";
            this.nav = [];
            
            this.init();
        }

        init() {
            this.navElements.forEach((nav, i) => {
                this.nav.push(nav);
                if (i === 0) {
                    nav.id = this.mainNav;
                    this.setActive(nav.id)
                }
            });

            this.events();
        }

        setActive(id) {
            this.nav.forEach(nav => {
                if (nav.id === id) {
                    nav.classList.add('active');
                } else {
                    nav.classList.remove('active');
                }
            });
            this.setBackBtn(id)
        }

        setBackBtn(id) {
            if (id === this.mainNav) {
                this.backBtn.classList.add('d-none');
                return
            }
            

            this.nav.forEach(nav => {
                const links = nav.querySelectorAll('a[data-nav]')
                links.forEach(link => {
                    if (link.getAttribute('data-nav') === id) {
                        this.backBtn.setAttribute('data-nav', nav.id);
                        this.backBtn.textContent = link.textContent;
                    }
                })
            });


            this.backBtn.classList.remove('d-none');
        }

        events() {
            this.nav.forEach(nav => {
                const links = nav.querySelectorAll('a[data-nav]')
                links.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();

                        const dataNav = link.getAttribute('data-nav');
                        this.setActive(dataNav);
                    });
                })
            });
            this.backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActive(this.backBtn.getAttribute('data-nav'))
            });
        }
    })

    new (class DesktopMenu {
        constructor() {
            this.navBtns = document.querySelectorAll('.services-menu__blocks .left-menu li');
            this.navMenu = document.querySelectorAll('.services-menu__blocks .right-menu .right-menu__item');
            
            this.init();
        }

        init() {
            // this.navBtns.forEach((navBtn, i) => {
            //     if (i === 0) {
            //         navBtn.classList.add('active')
            //     }
            // });
            this.navMenu.forEach((navMenu, i) => {
                if (i === 0) {
                    navMenu.classList.add('active')
                }
            });
            this.events();
        }

        events() {
            this.navBtns.forEach((navBtn, i) => {
                navBtn.addEventListener('mouseover', (e) => {
                    e.preventDefault();

                    const dataId = navBtn.getAttribute('data-id');
                    this.setActive(dataId);
                });
            });
        }

        setActive(id) {
            this.navBtns.forEach((navBtn, i) => {
                if (navBtn.getAttribute('data-id') === id) {
                    navBtn.classList.add('active');
                    navBtn.classList.remove('opacity-5');
                } else {
                    navBtn.classList.remove('active');
                    navBtn.classList.add('opacity-5');
                }
            });
            this.navMenu.forEach((navMenu, i) => {
                if (navMenu.id === id) {
                    navMenu.classList.add('active');
                } else {
                    navMenu.classList.remove('active');
                }
            });
        }
    });

    const headerServicesLink = document.querySelector('.services-link');
    const chooseCityPopup = document.querySelector('.choose-city-popup__wrap');
    const header = document.querySelector('header');
    const headerLinks = document.querySelectorAll('header .header-menu > ul > li, header .header-menu > ul > li, .header-city, .header-wrap > .buttons');
    const isHeaderFixed = () => {
        return header.classList.contains('fixed');
    }

    if (headerServicesLink && header) {
        const isTransparent = header.classList.contains('transparent');

        headerServicesLink.addEventListener('mouseover', (e) => {
            header.classList.add('colored');

            if (chooseCityPopup) {
                chooseCityPopup.classList.add('d-none');
            }

            if (isTransparent) {
                header.classList.remove('transparent');
            }
            
            headerLinks.forEach(hl => {
                if (!hl.classList.contains('services-link')) {
                    hl.classList.add('opacity-5');
                }
            });
        });
        headerServicesLink.addEventListener('mouseout', (e) => {
            header.classList.remove('colored');

            if (chooseCityPopup) {
                chooseCityPopup.classList.remove('d-none');
            }

            if (isTransparent && !isHeaderFixed()) {
                header.classList.add('transparent');
            }

            headerLinks.forEach(hl => {
                hl.classList.remove('opacity-5');
            });
        });

        $(window).on("scroll", () => {
            if ($(this).scrollTop() > 100) {
                header.classList.add('fixed');
                if (isTransparent) {
                    header.classList.remove('transparent');
                }
            } else {
                header.classList.remove('fixed');
                if (isTransparent && !isHeaderFixed()) {
                    header.classList.add('transparent');
                }
            }
        });
    }

    const footerMobileNav = document.querySelector('.footer-mobile-menu');

    if (footerMobileNav) {
        const servicesLinkBtns = footerMobileNav.querySelectorAll('.services-link__btn');

        servicesLinkBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.parentElement.classList.toggle('active');
            });
        });
    }
});