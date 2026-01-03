document.addEventListener('DOMContentLoaded', () => {
  // Navigation Toggle for Mobile
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');
  const body = document.body;

  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburgerMenu.classList.toggle('active');
      body.classList.toggle('no-scroll');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        body.classList.remove('no-scroll');
      });
    });
  }

  // Hero content visibility (Intersection Observer for sections)
  const sections = document.querySelectorAll('.full-section');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const fadeElements = entry.target.querySelectorAll('.hero-content, .fade-down, .fade-up');
      fadeElements.forEach(el => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      });
    });
  }, {
    threshold: 0.5
  });

  sections.forEach(section => sectionObserver.observe(section));

  // About section fade-in (separate observer for about section specifically)
  // 'fade-down' and 'fade-up' are already handled by the '.full-section' observer.

  const aboutLeft = document.querySelector('.about-left');
  const aboutRight = document.querySelector('.about-right');
  const aboutSection = document.getElementById('about');

  const aboutObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const aboutObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (aboutLeft) aboutLeft.classList.add('visible');
        if (aboutRight) aboutRight.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  if (aboutSection) {
    const observer = new IntersectionObserver(aboutObserverCallback, aboutObserverOptions);
    observer.observe(aboutSection);
  }

  // About Tabs
  function showTab(tabId, clickedButton) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    clickedButton.classList.add('active');
  }

  window.showTab = showTab;

  // Initialize the first tab as active
  const firstTabBtn = document.querySelector('.tab-btn');
  if (firstTabBtn) {
    firstTabBtn.click();
  }

  // Skills Slider
  const skillSlides = document.querySelectorAll('.skill-slide');
  const dots = document.querySelectorAll('.dot');
  const lottie = document.getElementById('skillsLottie');
  let currentSlide = 0;
  let autoSlideInterval = 7;

  function nextSlide() {
    const totalSlides = skillSlides.length;
    currentSlide = (currentSlide + 1) % totalSlides;
    setSlide(currentSlide);
  }

  function setSlide(index, isManual = false) {
    currentSlide = index;

    if (isManual) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 6000);
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    skillSlides.forEach((slide, i) => {
      if (isMobile) {
        if (i === index) {
          slide.classList.add('active-slide-mobile');
          slide.style.position = 'static';
          slide.style.opacity = '1';
          slide.style.pointerEvents = 'auto';
          slide.style.transform = 'none';
        } else {
          slide.classList.remove('active-slide-mobile');
          slide.style.position = 'absolute';
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
          slide.style.transform = 'translateX(-50%)';
        }
      } else {
        // Desktop vertical slider behavior
        slide.style.transform = `translateY(${(i - index) * 100}%)`;
        slide.style.position = 'absolute';
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'auto';
      }
    });

    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');

    const files = [
      'Media/Programming.json',
      'Media/graphicDesigning.json',
      'Media/videography.json',
      'Media/teamwork.json'
      
    ];
    if (lottie) {
      lottie.load(files[index]);
    }
  }

  // Re-initialize auto-slide
  autoSlideInterval = setInterval(nextSlide, 6000);

  // Initial display for skills slider
  if (skillSlides.length > 0) {
    setSlide(0);
  }

  // Pause auto-slide on hover
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    skillsSection.addEventListener('mouseleave', () => {
      autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % skillSlides.length;
        setSlide(currentSlide);
      }, 6000);
    });
  }

  // Attach setSlide to window for onclick in HTML
  window.setSlide = setSlide;


  // Project Slider
  const projectScrollWrapper = document.querySelector('.project-scroll-wrapper');
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');

  let isDown = false;
  let startX;
  let scrollLeft;

  if (projectScrollWrapper) {
    projectScrollWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - projectScrollWrapper.offsetLeft;
      scrollLeft = projectScrollWrapper.scrollLeft;
    });

    projectScrollWrapper.addEventListener('mouseleave', () => isDown = false);
    projectScrollWrapper.addEventListener('mouseup', () => isDown = false);

    projectScrollWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - projectScrollWrapper.offsetLeft;
      const walk = (x - startX) * 2;
      projectScrollWrapper.scrollLeft = scrollLeft - walk;
    });
  }


  if (scrollLeftBtn) {
    scrollLeftBtn.addEventListener('click', () => {
      projectScrollWrapper.scrollBy({
        left: -355,
        behavior: 'smooth'
      });
    });
  }

  if (scrollRightBtn) {
    scrollRightBtn.addEventListener('click', () => {
      projectScrollWrapper.scrollBy({
        left: 355,
        behavior: 'smooth'
      });
    });
  }

  const scriptURL = 'https://script.google.com/macros/s/AKfycbwWkMOk0b9R7WgHcEwU6oUDcs3GaRzZrc3WhnUSKliV2hEoPRQxwgARnLqJKHasjX4llg/exec'; // <--- IMPORTANT: Replace with your actual Google Sheet Web App URL
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');
  if (form && msg) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Display a "Sending..." message while the form is submitting
      msg.textContent = 'Sending...';
      msg.style.color = '#ff004f';
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
          if (response.ok) {
            msg.textContent = 'Message sent successfully!'; // Success message
            msg.style.color = '#28a745'; // Green color for success
            form.reset(); // Clear the form fields after successful submission
          } else {
            // Handle HTTP errors
            console.error('Submission failed with status:', response.status, response.statusText);
            msg.textContent = 'Failed to send message. Please try again later.'; // Error message
            msg.style.color = '#dc3545'; // Red color for error
          }
          setTimeout(() => {
            msg.textContent = ''; // Clear the message after a few seconds
          }, 5000); // Message disappears after 5 seconds
        })
        .catch(error => {
          console.error('Error!', error.message);
          msg.textContent = 'An error occurred. Please check your network and try again.'; // Generic error
          msg.style.color = '#dc3545'; // Red color for error
          setTimeout(() => {
            msg.textContent = ''; // Clear the message after a few seconds
          }, 5000);
        });
    });
  }

});