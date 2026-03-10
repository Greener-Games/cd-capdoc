import { ref } from 'vue';

const scrollProgress = ref(0);

export function useScroll() {
  const setScrollProgress = (progress: number) => {
    scrollProgress.value = progress;
  };

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    const maxScroll = target.scrollHeight - target.clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress(target.scrollTop / maxScroll);
    }
  };

  return {
    scrollProgress,
    setScrollProgress,
    handleScroll
  };
}
