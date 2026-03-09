import { ref } from 'vue';

const hasFooterAnimated = ref(false);

export function useFooterState() {
  const setHasFooterAnimated = (value: boolean) => {
    hasFooterAnimated.value = value;
  };

  return {
    hasFooterAnimated,
    setHasFooterAnimated
  };
}
