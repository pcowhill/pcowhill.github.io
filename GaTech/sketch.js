const prev = document.querySelector('button.prev');
const next = document.querySelector('button.next');
const carousel = document.querySelector('div.carousel')
const wrap = document.querySelector('div.img-wrap');
const imgs = document.querySelectorAll('div.img-wrap img');

let idx = 0;
let isCarouselHovered = false;

function showImg() {
  if (idx >= imgs.length) idx = 0;
  if (idx < 0) idx = imgs.length - 1;
  wrap.style.transform = `translateX(-${idx * 100}%)`;
}

next.addEventListener('click', () => {
  idx++;
  showImg();
});

prev.addEventListener('click', () => {
  idx--;
  showImg();
});

carousel.addEventListener('mouseenter', () => {
  isCarouselHovered = true;
});

carousel.addEventListener('mouseleave', () => {
  isCarouselHovered = false;
});

let transition = () => {
  if (!(isCarouselHovered)) {
    idx++;
    showImg();
  }
}

setInterval(() => {
  transition();
}, 5000); // Time in milliseconds


showImg();