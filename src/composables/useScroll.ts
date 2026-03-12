import { ref } from 'vue';

const scrollProgress = ref(0);

export function useScroll() {
  const setScrollProgress = (progress: number) => {
    scrollProgress.value = progress;
  };

  /**
   * Handles scroll events. Supports:
   * 1. Standard DOM Events (e.target.scrollHeight, etc)
   * 2. Custom scroll payloads with a 'progress' property
   */
  const handleScroll = (e: any) => {
    // 1. Check if it's a custom payload with progress (from components like DragScroll)
    if (e && typeof e === 'object' && 'progress' in e) {
      setScrollProgress(e.progress);
      return;
    }

    // 2. Fallback to standard DOM event handling
    const target = e?.target as HTMLElement;
    if (!target) return;

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
