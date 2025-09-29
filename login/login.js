document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Получаем данные пользователя из базы
            const userRef = db.ref('users/' + user.uid);
            const snapshot = await userRef.once('value');
            if (snapshot.exists()) {
                const userData = snapshot.val();
                localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid, ...userData }));
            } else {
                localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid, email: user.email }));
            }

            alert(`Добро пожаловать, ${user.email}!`);
            window.location.href = 'index.html';

        } catch (error) {
            alert('Ошибка входа: ' + error.message);
        }
    });

    // Забыли пароль?
    const forgotLink = document.querySelector('.forgot');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('Введите ваш email:');
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        alert('Инструкции отправлены на ваш email.');
                    })
                    .catch((error) => {
                        alert('Ошибка: ' + error.message);
                    });
            }
        });
    }
});