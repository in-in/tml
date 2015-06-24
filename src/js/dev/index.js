var elem = document.querySelector('.slider');
var flkty = new Flickity( elem, {
  wrapAround: true,
  prevNextButtons: true,
  lazyLoad: true,
  arrowShape: { 
  x0: 20,
  x1: 60, y1: 50,
  x2: 62, y2: 50,
  x3: 22
}
});