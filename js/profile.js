document.addEventListener('DOMContentLoaded', function () {
    // Проверяем Firebase Auth
    auth.onAuthStateChanged(user => {
        if (!user) {
            alert('⛔ Вы должны войти, чтобы просмотреть профиль.');
            window.location.href = 'login.html';
            return;
        }

        // Получаем данные пользователя из базы
        const userRef = db.ref('users/' + user.uid);
        userRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const currentUser = { uid: user.uid, ...userData };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loadUserProfile(user.uid);
                loadUserAds(user.uid);
            } else {
                // Пользователь есть в Auth, но нет в базе — создаём
                const newUser = {
                    uid: user.uid,
                    email: user.email,
                    username: user.displayName || 'Пользователь',
                    createdAt: Date.now()
                };
                db.ref('users/' + user.uid).set(newUser);
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                loadUserProfile(user.uid);
                loadUserAds(user.uid);
            }
        });

        // Инициализируем интерфейс
        initUI(user);
    });
});

function initUI(currentUser) {
    const editBtn = document.getElementById('editBtn');
    const editForm = document.getElementById('editForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordForm = document.getElementById('passwordForm');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const userAvatar = document.getElementById('userAvatar');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!editBtn || !editForm || !cancelBtn || !changePasswordBtn || !passwordForm || !cancelPasswordBtn || !uploadAvatarBtn || !avatarInput || !userAvatar || !logoutBtn) {
        console.error('Один или несколько элементов не найдены');
        return;
    }

    editBtn.addEventListener('click', () => {
        editForm.style.display = 'block';
        document.getElementById('userInfo')?.style.display = 'none';
        editBtn.style.display = 'none';
        changePasswordBtn.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        editForm.style.display = 'none';
        document.getElementById('userInfo')?.style.display = 'block';
        editBtn.style.display = 'inline-block';
        changePasswordBtn.style.display = 'inline-block';
    });

    changePasswordBtn.addEventListener('click', () => {
        passwordForm.style.display = 'block';
        document.getElementById('userInfo')?.style.display = 'none';
        editBtn.style.display = 'none';
        changePasswordBtn.style.display = 'none';
    });

    cancelPasswordBtn.addEventListener('click', () => {
        passwordForm.style.display = 'none';
        document.getElementById('userInfo')?.style.display = 'block';
        editBtn.style.display = 'inline-block';
        changePasswordBtn.style.display = 'inline-block';
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('editUsername')?.value.trim();
        const phone = document.getElementById('editPhone')?.value.trim();

        if (!username) {
            alert('Имя пользователя обязательно.');
            return;
        }

        try {
            const userRef = db.ref('users/' + currentUser.uid);
            await userRef.update({
                username: username,
                phone: phone
            });

            const updatedUser = { ...currentUser, username, phone };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            alert('✅ Профиль обновлён!');
            loadUserProfile(currentUser.uid);
            editForm.style.display = 'none';
            document.getElementById('userInfo')?.style.display = 'block';
            editBtn.style.display = 'inline-block';
        } catch (error) {
            alert('❌ Ошибка: ' + error.message);
        }
    });

    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            alert('Новый пароль и подтверждение не совпадают.');
            return;
        }

        if (newPassword.length < 6) {
            alert('Пароль должен быть не менее 6 символов.');
            return;
        }

        try {
            const credential = auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
            await auth.currentUser.reauthenticateWithCredential(credential);
            await auth.currentUser.updatePassword(newPassword);

            alert('✅ Пароль успешно изменён!');
            passwordForm.style.display = 'none';
            document.getElementById('userInfo')?.style.display = 'block';
            editBtn.style.display = 'inline-block';
            changePasswordBtn.style.display = 'inline-block';
            passwordForm.reset();
        } catch (error) {
            alert('❌ Ошибка: ' + error.message);
        }
    });

    uploadAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер 2MB.');
            return;
        }

        try {
            const storageRef = storage.ref();
            const avatarRef = storageRef.child('avatars/' + currentUser.uid + '.jpg');
            await avatarRef.put(file);
            const downloadURL = await avatarRef.getDownloadURL();

            const userRef = db.ref('users/' + currentUser.uid);
            await userRef.update({ avatar: downloadURL });

            const updatedUser = { ...currentUser, avatar: downloadURL };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            userAvatar.src = downloadURL;
            userAvatar.style.display = 'block';

            alert('✅ Аватар загружен!');
        } catch (error) {
            alert('❌ Ошибка загрузки: ' + error.message);
        }
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            localStorage.removeItem('currentUser');
            alert('Вы вышли из аккаунта.');
            window.location.href = 'index.html';
        }).catch(error => {
            alert('Ошибка выхода: ' + error.message);
        });
    });
}

function loadUserProfile(uid) {
    const userRef = db.ref('users/' + uid);
    userRef.once('value', snapshot => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            document.getElementById('username')?.textContent = userData.username || 'Не указано';
            document.getElementById('email')?.textContent = userData.email || 'Не указано';
            document.getElementById('phone')?.textContent = userData.phone || 'Не указан';
            document.getElementById('createdAt')?.textContent = new Date(userData.createdAt).toLocaleDateString('ru-RU');

            if (userData.avatar) {
                const avatarImg = document.getElementById('userAvatar');
                if (avatarImg) {
                    avatarImg.src = userData.avatar;
                    avatarImg.style.display = 'block';
                }
            }

            const editUsername = document.getElementById('editUsername');
            const editPhone = document.getElementById('editPhone');
            if (editUsername) editUsername.value = userData.username || '';
            if (editPhone) editPhone.value = userData.phone || '';
        }
    });
}

function loadUserAds(uid) {
    const adsRef = db.ref('ads');
    adsRef.orderByChild('authorId').equalTo(uid).on('value', snapshot => {
        const userAds = document.getElementById('userAds');
        if (!userAds) return;

        userAds.innerHTML = '';

        if (!snapshot.exists()) {
            userAds.innerHTML = '<p>У вас нет объявлений.</p>';
            return;
        }

        const ads = snapshot.val();
        for (let key in ads) {
            const ad = ads[key];
            const adCard = document.createElement('div');
            adCard.className = 'ad-card';
            adCard.innerHTML = `
                <h4>${ad.title || 'Без названия'}</h4>
                <p><strong>Год:</strong> ${ad.year || '—'} | <strong>Пробег:</strong> ${ad.mileage?.toLocaleString() || '—'} км</p>
                <p class="price">💰 ¥ ${ad.price?.toLocaleString() || '—'}</p>
                <p><small>Создано: ${new Date(ad.createdAt).toLocaleDateString('ru-RU')}</small></p>
            `;
            userAds.appendChild(adCard);
        }
    });
}