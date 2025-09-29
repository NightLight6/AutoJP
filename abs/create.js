document.addEventListener('DOMContentLoaded', function() {
    const adForm = document.getElementById('adForm');

    adForm.addEventListener('submit', async function(e) {
        e.preventDefault();

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
        const photosInput = document.getElementById('photos');
        const photosFiles = photosInput.files;

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

            const newAdRef = db.ref('ads').push();

            // Upload photos to Firebase Storage and get URLs
            const photoUrls = [];
            for (let i = 0; i < photosFiles.length; i++) {
                const file = photosFiles[i];
                const storageRef = storage.ref();
                const photoRef = storageRef.child(`ads/${newAdRef.key}/${file.name}`);
                await photoRef.put(file);
                const downloadURL = await photoRef.getDownloadURL();
                photoUrls.push(downloadURL);
            }

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
            window.location.href = 'ads.html';
        } catch (error) {
            alert('❌ Ошибка: ' + error.message);
        }
    });
});
