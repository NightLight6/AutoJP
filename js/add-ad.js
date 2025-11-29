document.addEventListener('DOMContentLoaded', function () {
    const adForm = document.getElementById('adForm');

    if (!adForm) return;

    // Проверка инициализации Firebase
    if (!window.db || !window.storage) {
        console.error('Firebase не инициализирован!');
        alert('Ошибка: Firebase не загружен. Обновите страницу.');
        return;
    }

    adForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Собираем данные формы
        const brand = document.getElementById('brand').value.trim();
        const model = document.getElementById('model').value.trim();
        const year = parseInt(document.getElementById('year').value);
        const mileage = parseInt(document.getElementById('mileage').value);
        const engine = document.getElementById('engine').value;
        const transmission = document.getElementById('transmission').value;
        const drive = document.getElementById('drive').value;
        const color = document.getElementById('color').value.trim();
        const price = parseInt(document.getElementById('price').value);
        const description = document.getElementById('description').value.trim();

        // Валидация
        if (!brand || !model || !year || !mileage || !engine || !transmission || !drive || !color || !price) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.uid) {
                alert('⛔ Вы должны войти, чтобы подать объявление.');
                window.location.href = 'login.html';
                return;
            }

            const newAdRef = window.db.ref('ads').push();
            // Загружаем фото
            const photosInput = document.getElementById('photos');
            const photosFiles = photosInput ? photosInput.files : [];

            const photoUrls = [];
            for (let i = 0; i < photosFiles.length; i++) {
                const file = photosFiles[i];
                if (!file.type.startsWith('image/')) continue;

                try {
                    const storageRef = window.storage.ref();
                    const photoRef = storageRef.child(`ads/${newAdRef.key}/${file.name}`);
                    await photoRef.put(file);
                    const downloadURL = await photoRef.getDownloadURL();
                    photoUrls.push(downloadURL);
                } catch (photoError) {
                    console.warn('Ошибка загрузки фото:', photoError);
                }
            }

            // Сохраняем объявление
            await newAdRef.set({
                authorId: currentUser.uid,
                brand,
                model,
                year,
                mileage,
                engine,
                transmission,
                drive,
                color,
                price,
                description,
                photos: photoUrls,
                createdAt: Date.now()
            });

            alert('✅ Объявление успешно опубликовано!');
            adForm.reset();
            window.location.href = 'abs.html';

        } catch (error) {
            console.error('Ошибка:', error);
            alert('❌ Ошибка: ' + error.message);
        }
    });
});