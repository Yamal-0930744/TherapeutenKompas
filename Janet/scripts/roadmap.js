document.addEventListener('DOMContentLoaded', () => {
  const roadmapSection = document.getElementById('roadmap');
  const steps = Array.from(roadmapSection.querySelectorAll('.step'));
  const options = { root: null, threshold: 0.3 };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Activeer stappen één voor één
        steps.forEach((step, i) => {
          setTimeout(() => {
            step.classList.add('active');
          }, i * 500);
        });
        obs.disconnect();
      }
    });
  }, options);

  observer.observe(roadmapSection);
});
