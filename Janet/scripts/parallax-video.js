document.addEventListener('scroll', () => {
  const section = document.getElementById('video-section');
  // Hoe verder je scrollt, hoe lager de background‑offset
  const yOffset = window.pageYOffset;
  // pas de factor 0.5 aan voor sneller/langzamer effect
  section.style.backgroundPosition = `center ${-yOffset * 0.5}px`;
});
