document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('adsContainer');
    if (!container) return;

    if (!window.db) {
        console.error('Firebase не инициализирован!');
        container.innerHTML = '<p class="no-ads">❌ Ошибка: Firebase не загружен</p>';
        return;
    }

    const adsRef = window.db.ref('ads');

    adsRef.on('value', (snapshot) => {
        container.innerHTML = '';

        if (!snapshot.exists()) {
            container.innerHTML = '<p class="no-ads">📭 Нет объявлений. Будьте первым, кто подаст объявление!</p>';
            return;
        }

        const ads = snapshot.val();
        for (let key in ads) {
            const ad = ads[key];

            const cardLink = document.createElement('a');
            cardLink.href = '#';
            cardLink.className = 'card-link';
            cardLink.onclick = (e) => {
                e.preventDefault();
                alert(`ID: ${key}\n\n${ad.description || 'Описание отсутствует'}`);
            };

            const card = document.createElement('div');
            card.className = 'card';

            let imgSrc = 'https://via.placeholder.com/200x150?text=Авто';
            if (ad.photos && ad.photos.length > 0) {
                imgSrc = ad.photos[0];
            }

            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';

            cardContent.innerHTML = `
                <h3>${ad.brand} ${ad.model}</h3>
                <p><strong>Год:</strong> ${ad.year} | <strong>Пробег:</strong> ${ad.mileage?.toLocaleString() || '—'} км</p>
                <p class="price">💰 ¥ ${ad.price?.toLocaleString() || '—'}</p>
                <p class="author">Автор: ${ad.authorName || 'Аноним'}</p>
            `;

            card.appendChild(cardContent);
            cardLink.appendChild(card);
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `${ad.brand} ${ad.model}`;
            img.onerror = () => {
                img.src = 'https://via.placeholder.com/200x150?text=Ошибка+загрузки';
            };
            card.insertBefore(img, card.firstChild);

            container.appendChild(cardLink);
        }
    });
});