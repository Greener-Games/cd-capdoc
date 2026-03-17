import { Directive } from 'vue';

const revealDirective: Directive = {
  mounted(el) {
    // We don't force a base class anymore, 
    // the user provides their own initial state classes (e.g. opacity-0 translate-y-10)
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal');
          // Once revealed, we stop observing
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(el);
  }
};

export default revealDirective;
