document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value.trim();

        if (!username || !email || !password) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        try {
            // Создаем пользователя в Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Сохраняем данные в Realtime Database
            const userData = {
                username: username,
                email: email,
                phone: phone || '',
                createdAt: new Date().toISOString()
            };

            const usersRef = db.ref('users/' + user.uid);
            await usersRef.set(userData);

            // Сохраняем UID в localStorage
            localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid, ...userData }));

            alert(`✅ Пользователь ${username} успешно зарегистрирован!`);
            window.location.href = 'index.html';

        } catch (error) {
            alert('❌ Ошибка: ' + error.message);
        }
    });
});