import { ref } from 'vue';

const scrollProgress = ref(0);

export function useScrollState() {
  const setScrollProgress = (progress: number) => {
    scrollProgress.value = progress;
  };

  return {
    scrollProgress,
    setScrollProgress
  };
}
