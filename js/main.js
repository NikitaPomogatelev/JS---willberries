document.addEventListener('DOMContentLoaded', () => {
	
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
        cart.renderCart();
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
	const createCard = ({
		id,
		name,
		description,
		label,
		img,
		price
	}) => {
		const card = document.createElement('div');
		card.className = `col-lg-3 col-sm-6`;
		// console.log(objCard);
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
			.then((data) => data.filter(good => good[field] === value))
			.then(renderCards);
	};

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
			if (field) {
				filterCards(field, value);
			} else {
				getGoods('db/db.json').then(renderCards);
			}

		})
	});

	// Cart
	const cartTableGoods = document.querySelector('.cart-table__goods');
	const cardTableTotal = document.querySelector('.card-table__total');
	const modalClear = document.querySelector('.modal-clear');
	const cartCount = document.querySelector('.cart-count');

	const cart = {
		cartGoods: [
			// {
			// 	id: '099',
			// 	name: 'Часы Dior',
			// 	price: 666,
			// 	count: 2,
			// },
			// {
			// 	id: '090',
			// 	name: 'Диски для машины',
			// 	price: 600,
			// 	count: 3,
			// },
		],
		countQuantity() {
			
			cartCount.textContent = this.cartGoods.reduce((acc, item) => {
				return acc + item.count;
			}, 0);
		},
		renderCart() {
			cartTableGoods.textContent = '';
			
			this.cartGoods.forEach(({
				id,
				name,
				price,
				count
			}) => {
				const trGood = document.createElement('tr');
				trGood.className = `cart-item`;
				trGood.dataset.id = id;

				trGood.innerHTML = `
					<td>${name}</td>
					<td>${price}</td>
					<td><button class="cart-btn-minus">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus">+</button></td>
					<td>${price * count}$</td>
					<td><button class="cart-btn-delete">x</button></td>
				`;
				
				cartTableGoods.append(trGood);
				
			});

			const totalPrice = this.cartGoods.reduce((acc, item) => acc + (item.price * item.count), 0);

			cardTableTotal.textContent = `${totalPrice}$`;
		},

		deleteCart(id) {
			this.cartGoods = this.cartGoods.filter(item => id !== item.id)
			this.renderCart();
			this.countQuantity();
		},

		minusGood(id) {
			for (const item of this.cartGoods) {
				if (item.id === id) {
					if (item.count <= 0) {
						// this.deleteCart(id);
						item.count == 0;
					} else {
						item.count--;
					}
					break;
				}
			}
			this.renderCart();
			this.countQuantity();
		},

		plusGood(id) {
			for (const item of this.cartGoods) {
				if (item.id === id) {
					item.count++;
					break;
				}
			}
			this.renderCart();
			this.countQuantity();
		},

		addCartGoods(id) {
			// 
			const goodItem = this.cartGoods.find(item => item.id === id);
			if (goodItem) {
				this.plusGood(id);
			} else {
				getGoods('db/db.json')
					.then((data) => data.find(item => item.id === id))
					.then(({id, name, price}) => {
						
						this.cartGoods.push({
							id,
							name,
							price,
							count: 1
						});
						this.countQuantity();
					})
			}
			
		},

		clearCart() {
			this.cartGoods.length = 0;
			this.countQuantity();
			this.renderCart();
		}
	}

	// Клик по кнопкам на добавление в корзину
	document.body.addEventListener('click', e => {
		let target = e.target;
		const addToCart = target.closest('.add-to-cart')
		// console.log(addToCart);
		if (addToCart) {
			cart.addCartGoods(addToCart.dataset.id);
			cart.renderCart()
			
		}
	});

	cartTableGoods.addEventListener('click', (e) => {
		let target = e.target;
		if (target.tagName === 'BUTTON') {
			const id = target.closest('.cart-item').dataset.id;

			if (target.classList.contains('cart-btn-delete')) {
				cart.deleteCart(id);
			}
			if (target.classList.contains('cart-btn-minus')) {
				cart.minusGood(id);
			}
			if (target.classList.contains('cart-btn-plus')) {
				cart.plusGood(id);
			}
		}

	});

	modalClear.addEventListener('click', () => {
		cart.clearCart.bind(cart)();
	});

	// Cчётчик для корзины
	
	// const printQuantity = () => {
	// 	let lengthItems = cartTableGoods.children.length;
	// 	cartCount.textContent = lengthItems;
	// }

	// cart.addCartGoods('001');
	// cart.addCartGoods('016');


});