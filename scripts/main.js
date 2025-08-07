document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    //  BAGIAN 1: SUMBER DATA UNTUK SEMUA GALERI
    // ===================================================================

    const landscapeImages = [
        'assets/image/atas-depan.png',
        'assets/image/circle.png',
        'assets/image/depan.jpg',
        'assets/image/depan.png',
        'assets/image/GB2.png',
        'assets/image/GBUB.png',
        'assets/image/newstore.jpg',
        'assets/image/Panggung.jpg', 
        'assets/image/senamair.jpg',
        'assets/image/UB&Merapi.jpg',
        'assets/image/UB3.png'
    ];

    const portraitImages = [
        'assets/image/potr1.png',
        'assets/image/potr2.png',
        'assets/image/potr3.jpg',
        'assets/image/potr4.jpg',
        'assets/image/potr5.png',
        'assets/image/potr6.jpg',
        'assets/image/potr7.jpg',
        'assets/image/potr8.png'
    ];


    // ===================================================================
    //  BAGIAN 2: MENGISI GALERI SISI (HANYA BERJALAN DI TAMPILAN PC)
    // ===================================================================

    function populateSideGalleries() {
        const leftGallery = document.querySelector('#side-gallery-left .scroll-content');
        const rightGallery = document.querySelector('#side-gallery-right .scroll-content');
        
        if (!leftGallery || !rightGallery) return;

        leftGallery.innerHTML = '';
        rightGallery.innerHTML = '';

        const half = Math.ceil(portraitImages.length / 2);
        const leftImages = portraitImages.slice(0, half);
        const rightImages = portraitImages.slice(half);

        function fillSide(galleryElement, imageArray) {
            [...imageArray, ...imageArray].forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = "Foto galeri sisi";
                galleryElement.appendChild(img);
            });
        }

        fillSide(leftGallery, leftImages);
        fillSide(rightGallery, rightImages);
    }


    // ===================================================================
    //  BAGIAN 3: LOGIKA SLIDER UTAMA & PENGGABUNGAN GALERI
    // ===================================================================

    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let totalSlides = 0;
    let autoSlideInterval;
    
    function buildMainSlider(images) {
        if (!sliderWrapper) return;
        sliderWrapper.innerHTML = '';
        images.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            const img = document.createElement('img');
            img.src = src;
            img.alt = "Foto galeri utama";
            slide.appendChild(img);
            sliderWrapper.appendChild(slide);
        });
        
        totalSlides = images.length;
        currentIndex = 0;
        goToSlide(0);
        startAutoSlide(5000); // Mulai auto-slide setiap kali galeri dibangun ulang
    }

    function goToSlide(index) {
        if (sliderWrapper) {
           sliderWrapper.style.transform = 'translateX(' + (-index * 100) + '%)';
        }
    }

    function initSlider() {
        if (!prevBtn || !nextBtn || !sliderWrapper) return;

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            goToSlide(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(currentIndex);
        });
        
        const mainSlider = sliderWrapper.closest('.main-slider');
        if (mainSlider) {
            mainSlider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            mainSlider.addEventListener('mouseleave', () => {
                 startAutoSlide(5000);
            });
        }
    }
    
    function startAutoSlide(interval) {
        clearInterval(autoSlideInterval);
        if (totalSlides > 1) {
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                goToSlide(currentIndex);
            }, interval);
        }
    }


    // ===================================================================
    //  BAGIAN 4: LOGIKA RESPONSIVE (YANG MENGATUR SEMUANYA)
    //  ##### PERUBAHAN UTAMA ADA DI SINI #####
    // ===================================================================

    const mediaQuery = window.matchMedia('(max-width: 992px)');

    function handleScreenChange(e) {
        // Jika layar cocok dengan media query (lebar <= 992px, alias TAMPILAN HP)
        if (e.matches) {
            // HANYA memuat gambar potret ke slider utama
            buildMainSlider(portraitImages); 
        } else {
            // Jika tidak (TAMPILAN DESKTOP), muat gambar lanskap ke slider utama
            buildMainSlider(landscapeImages);
        }
    }

    // Panggil fungsi-fungsi inisialisasi
    populateSideGalleries(); // Tetap panggil ini untuk mengisi galeri sisi (hanya terlihat di desktop)
    initSlider();
    handleScreenChange(mediaQuery); // Panggil sekali saat load untuk menentukan state awal

    // Tambahkan listener untuk mendeteksi perubahan ukuran layar secara real-time
    mediaQuery.addEventListener('change', handleScreenChange);


    // ===================================================================
    //  BAGIAN 5: LOGIKA DROPDOWN BAHASA
    // ===================================================================
    const dropdown = document.querySelector('.language-dropdown');
    
    if (dropdown) {
        const currentBtn = dropdown.querySelector('.lang-current');
        const options = dropdown.querySelector('.lang-options');
        const allLangContent = document.querySelectorAll('.lang-content');

        function switchLanguage(targetLang) {
            allLangContent.forEach(content => {
                if (content.parentElement.classList.contains('lang-current') || !content.closest('.lang-options')) {
                    content.style.display = (content.getAttribute('lang') === targetLang) ? 'inline' : 'none';
                }
            });
            // Update teks pada tombol utama
             const currentSpans = currentBtn.querySelectorAll('.lang-content');
             currentSpans.forEach(span => {
                span.style.display = (span.getAttribute('lang') === targetLang) ? 'inline' : 'none';
             });
        }

        currentBtn.addEventListener('click', function() {
            dropdown.classList.toggle('show');
        });

        options.addEventListener('click', function(e) {
            e.preventDefault();
            const link = e.target.closest('a');
            if (link && link.dataset.lang) {
                const selectedLang = link.dataset.lang;
                switchLanguage(selectedLang);
                dropdown.classList.remove('show');
            }
        });

        window.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // ===================================================================
    //  BAGIAN 6: LOGIKA VIDEO SLIDER
    // ===================================================================
    const videoPlayer = document.getElementById('local-video-player');
    const videoSource = document.getElementById('local-video-source');
    const prevVideoBtn = document.getElementById('prev-video-btn');
    const nextVideoBtn = document.getElementById('next-video-btn');

    const videoPlaylist = [
        { src: 'assets/videos/video1.mp4', poster: 'assets/images/poster1.jpg' },
        { src: 'assets/videos/video2.mp4', poster: 'assets/images/poster2.jpg' }
    ];
    let currentVideoIndex = 0;

    function loadVideo(index) {
        if (!videoPlayer || !videoSource) return;
        const videoData = videoPlaylist[index];
        videoSource.setAttribute('src', videoData.src);
        if(videoData.poster) {
            videoPlayer.setAttribute('poster', videoData.poster);
        }
        videoPlayer.load();
    }
    
    if (videoPlaylist.length > 0 && videoPlayer) {
        loadVideo(currentVideoIndex);

        if(nextVideoBtn) {
            nextVideoBtn.addEventListener('click', () => {
                currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
                loadVideo(currentVideoIndex);
            });
        }

        if(prevVideoBtn) {
            prevVideoBtn.addEventListener('click', () => {
                currentVideoIndex = (currentVideoIndex - 1 + videoPlaylist.length) % videoPlaylist.length;
                loadVideo(currentVideoIndex);
            });
        }
    }
});