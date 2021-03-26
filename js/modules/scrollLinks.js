const scrollLinks = () => {
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
}

export default scrollLinks;
