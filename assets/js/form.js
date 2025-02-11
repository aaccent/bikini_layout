document.addEventListener('DOMContentLoaded', () => {

    const phoneInputs = document.querySelectorAll('input[name="phone"]')
    const forms = document.querySelectorAll('form');

    // forms.forEach(form => {
    //     form.addEventListener('submit', (e) => {
    //         e.preventDefault();

    //         form.classList.add('loading');

    //         setTimeout(() => {
    //             form.classList.remove('loading');

    //              if (form.getAttribute('data-cb-modal')) {
    //                 Fancybox.show([{ src: `#${form.getAttribute('data-cb-modal')}`, type: "clone" }]);
    //             } else {
    //                 Fancybox.show([{ src: "#thx", type: "clone" }]);
    //             }

    //         }, 2000);
           
            
    //     });
    // });

    if (phoneInputs) {
        phoneInputs.forEach(phoneInput => {
            IMask(phoneInput, {
                mask: '+{7}(000)000-00-00'
            });
        })
    }


    const formFileBtns = document.querySelectorAll('form .file');

    formFileBtns.forEach(fileBtn => {
        const input = fileBtn.querySelector('input[type="file"]');
        const deleteBtn = fileBtn.querySelector('.btn-delete');
        const fileEmptyEl = fileBtn.querySelector('.file-empty');

        if (input) {
            input.addEventListener('change', (e) => {
                e.preventDefault();

                const fileNameEl = fileBtn.querySelector('.file-name');

                if (deleteBtn) {
                    if (e.target.value == "") {
                        deleteBtn.classList.add('d-none');
                        fileEmptyEl.classList.remove('d-none');
                    } else {
                        deleteBtn.classList.remove('d-none');
                        fileEmptyEl.classList.add('d-none');
                    }
                }

                if(fileNameEl && e.target.files.length) {
                    fileNameEl.textContent = e.target.files[0].name;
                }
            });
        }

        if (deleteBtn) {
            const btn = deleteBtn.querySelector('.delete-file')
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                input.value = "";
                input.dispatchEvent(new Event('change'));
            });
        }
    });


    const filter = document.querySelector('#filter');
    if (filter) {
        const resetFilterBtn = filter.querySelector('#reset-filter');
        resetFilterBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const checkboxes = filter.querySelectorAll('input[type="checkbox"]')
            checkboxes.forEach(chck => {
                chck.checked = false;
            })
        });
    }
});