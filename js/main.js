document.addEventListener('DOMContentLoaded', () => {
	/* 
		Slider 
	*/

	const mySwiper = new Swiper('.swiper-container', {
		loop: true,

		// Navigation arrows
		navigation: {
			nextEl: '.slider-button-next',
			prevEl: '.slider-button-prev',
		},
	});

	/* 
		Cart - modal
	*/

	const buttonCart = document.querySelector('.button-cart');
	const modalCart = document.querySelector('#modal-cart');

	const openModal = (e) => {
		modalCart.classList.add('show');

		document.addEventListener('keydown', escapeHandler);
	}
	const closeModal = () => {
		modalCart.classList.remove('show');

		document.removeEventListener('keydown', escapeHandler);
	}

	const escapeHandler = (e) => {
		if (e.code === 'Escape') {
			closeModal();
		}
	}

	buttonCart.addEventListener('click', openModal);

	modalCart.addEventListener('click', (e) => {
		let target = e.target;
		if (target.classList.contains('modal-close') || target == modalCart) {
			closeModal();
		}
	});


	/* 
		scroll smooth
	*/

	{
			const scrollLinks = document.querySelectorAll('a.scroll-link');


			scrollLinks.forEach(link => {
				link.addEventListener('click', (e) => {
					e.preventDefault();
					const id = link.getAttribute('href');
					document.querySelector(id).scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					})
				});
		});
		/* Перебор через for of */
		// for(let scrollLink of scrollLinks) {
		// 	scrollLink.addEventListener('click', (e) => {
		// 		e.preventDefault();
		// 		const id = scrollLink.getAttribute('href');
		// 		document.querySelector(id).scrollIntoView({
		// 			behavior: 'smooth',
		// 			block: 'start'
		// 		})
		// 	});
		// };
		}
		
	

	

	/* 
	goods
*/

	const more = document.querySelector('.more');
	const navigationLink = document.querySelectorAll('.navigation-link');
	const longGoodsList = document.querySelector('.long-goods-list');

	// Получение данных от сервера
	const getGoods = async (url) => {
		const result = await fetch(url);

		if (!result.ok) {
			throw new Error(`Вознbкла ошибка по адресу: ${result.url} Статус ошибки: ${result.status}`);
		}
		return await result.json();
	};


	getGoods('db/db.json').then((data) => {
		// console.log(data);
	});

	// Создание шаблона карточки
	const createCard = (objCard) => {
		const card = document.createElement('div');
		card.className = `col-lg-3 col-sm-6`;
		// console.log(objCard);
		const {
			id,
			name,
			description,
			label,
			img,
			price
		} = objCard;
		card.innerHTML = `
			<div class="goods-card">
				${label ? `<span class="label">${label}</span>` : ''}
				
				<img
					src="db/${img}"
					alt="image: ${name}"
					class="goods-image"
				/>
				<h3 class="goods-title">${name}</h3>
				<p class="goods-description">${description}/Black/Khaki</p>
				<button class="button goods-card-btn add-to-cart" data-id="${id}">
					<span class="button-price">$${price}</span>
				</button>
			</div>
		`;
		return card;
	};

	// Генерация карточек
	const renderCards = (data) => {
		longGoodsList.textContent = '';
		const cards = data.map(createCard);
		longGoodsList.append(...cards);

		document.body.classList.add('show-goods');
	}

	// Рендер карточек при событии клика
	more.addEventListener('click', (e) => {
		e.preventDefault();
		
		getGoods('db/db.json').then(renderCards);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	});

	// 2 вариант для понимания
	// fetch('db/db.json')
	// .then(res => {
	// 	return res.json();
	// })
	// .then(data => {
	// 	console.log(data);
	// })

	// Функция фильтрации элементов
	const filterCards = (field, value) => {
		getGoods('db/db.json')
			.then((data) => {
				const filteredGoods = data.filter((good) => {
					return good[field] === value;
				});
				return filteredGoods;
			})
			.then(renderCards);
	}

	// filterCards('gender', 'Womens')
	
	// Функция деактивации активного класса
	const deactiveLink = () => {
		navigationLink.forEach(link => link.classList.remove('active'));
	};

	// Функция фильтрации элементов при событии
	navigationLink.forEach((link) => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			deactiveLink();

			link.classList.add('active');
			const field = link.dataset.field;
			const value = link.textContent;
			console.log(field, value);
			if(field) {
				filterCards(field, value);
			} else {
				getGoods('db/db.json').then(renderCards);
			}
			
		})
	});

});