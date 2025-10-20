document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        navMenu.setAttribute('aria-expanded', 'false');

        menuToggle.addEventListener('click', function () {
            const isExpanded = navMenu.getAttribute('aria-expanded') === 'true';
            navMenu.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            menuToggle.textContent = isExpanded ? '☰' : '✕';
        });

        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navMenu.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    }

    const images = document.querySelectorAll('img:not([loading])');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.classList.remove('lazy');
                    }
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            if (img.dataset.src) {
                img.classList.add('lazy');
                imageObserver.observe(img);
            }
        });
    } else {
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('touchstart', function () {
            this.style.opacity = '0.8';
        });
        el.addEventListener('touchend', function () {
            this.style.opacity = '1';
        });
    });

    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);
    } else {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
});