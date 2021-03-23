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
	if(e.code === 'Escape') {
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
	})
}

});






