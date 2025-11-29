document.addEventListener('DOMContentLoaded', function() {
    console.log('Добро пожаловать на главную страницу Авто-Восток!');

    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                alert(`Вы ищете: "${query}". Перенаправляем на страницу объявлений...`);
                window.location.href = `ads.html?search=${encodeURIComponent(query)}`;
            } else {
                alert('Введите запрос для поиска.');
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 400 + index * 150);
    });
});

function searchAds() {
    const query = document.getElementById('searchInput')?.value.trim();
    if (query) {
        window.location.href = `ads.html?search=${encodeURIComponent(query)}`;
    } else {
        alert('Введите запрос для поиска.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log('Current user:', currentUser); // Debug log

    if (currentUser) {
        // Refresh currentUser from DB to get latest avatar
        const userRef = db.ref('users/' + currentUser.uid);
        userRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                currentUser = { uid: currentUser.uid, ...userData };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                if (nav) {
                    const loginLink = nav.querySelector('#loginLink');
                    const registerLink = nav.querySelector('#registerLink');
                    const userAvatarNav = nav.querySelector('#userAvatarNav');
                    const navAvatarImg = nav.querySelector('#navAvatarImg');

                    if (loginLink) loginLink.style.display = 'none';
                    if (registerLink) registerLink.style.display = 'none';

                    if (currentUser.avatar && userAvatarNav && navAvatarImg) {
                        navAvatarImg.src = currentUser.avatar;
                        userAvatarNav.style.display = 'block';
                        userAvatarNav.addEventListener('click', () => {
                            window.location.href = 'profile.html';
                        });
                    } else {
                        // No avatar, show profile link
                        const profileLink = document.createElement('a');
                        profileLink.href = 'profile.html';
                        profileLink.textContent = '👤 Профиль';
                        nav.appendChild(profileLink);
                    }
                }
            }
        });
    } else {
        // User is not logged in, keep original nav and redirect links
        if (nav) {
            const links = nav.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href !== 'login.html' && href !== 'register.html' && href !== '#') {
                    link.addEventListener('click', e => {
                        e.preventDefault();
                        window.location.href = 'login.html';
                    });
                }
            });
        }
        // Redirect search button
        const searchButton = document.querySelector('.search-bar button');
        if (searchButton) {
            searchButton.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        }
        // Redirect card links
        const cardLinks = document.querySelectorAll('.card-link');
        cardLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        });
    }
});
