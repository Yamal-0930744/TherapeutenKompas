document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.info-section');
  const obsOptions = { root: null, threshold: 0.2 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, obsOptions);

  sections.forEach(sec => observer.observe(sec));
});
