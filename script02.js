// JavaScript
//contents
const items = document.querySelectorAll('.img-item');
console.log(items);

console.log(items.length);

// for文
for(let i = 0; i < items.length; i++){

    const keyframes = {
      opacity: [0, 1],
      translate: ['0 50px', 0],
      filter: ['blur(10px)', 'blur(0)'],
    };
    
    const options = {
      duration: 800,
      fill: 'forwards',
      delay: (i+2) * 250,
    };
  
    items[i].animate(keyframes, options);
}