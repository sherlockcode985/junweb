document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll('.counter');
  const aboutUsSection = document.querySelector('.about-us');

  // 执行递增动画的函数
  const startCounting = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;

    // 根据目标值大小动态调整动画持续时间，确保所有数字动画时长相近
    // 基础动画时长设为2000ms，根据目标值调整步长
    const duration = 2000; // 基础动画时长（毫秒）
    const framesPerSecond = 60; // 假设60fps
    const totalFrames = duration / (1000 / framesPerSecond);
    const inc = target / totalFrames;

    if (count < target) {
      // 向上取整并更新DOM，然后使用 requestAnimationFrame 保持高帧率流畅度
      counter.innerText = Math.ceil(count + inc);
      requestAnimationFrame(() => startCounting(counter));
    } else {
      // 确保最终数字精准无误
      counter.innerText = target;
    }
  };

  // 监听器配置：当元素出现在视口中达到 20% 时触发
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  // 为数字计数器创建观察器
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // 如果元素进入了视口
      if (entry.isIntersecting) {
        const counter = entry.target;
        startCounting(counter);
        // 触发后取消监听，防止重复播放
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  // 为关于我们 section 创建观察器
  const aboutUsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutUsSection.classList.add('fade-in');
        // 触发后取消监听，防止重复播放
        aboutUsObserver.unobserve(aboutUsSection);
      }
    });
  }, observerOptions);

  // 挂载监听器到所有含有 .counter 类的元素上
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // 挂载监听器到关于我们 section
  if (aboutUsSection) {
    aboutUsObserver.observe(aboutUsSection);
  }

  // 页面加载时检查关于我们 section 是否在视口中
  // 如果在视口中，直接添加淡入效果
  const checkAboutUsInViewport = () => {
    const rect = aboutUsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth
    );

    if (isInViewport) {
      aboutUsSection.classList.add('fade-in');
      if (aboutUsObserver) {
        aboutUsObserver.unobserve(aboutUsSection);
      }
    }
  };

  // 初始检查
  checkAboutUsInViewport();
});