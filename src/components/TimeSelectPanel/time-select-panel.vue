<template>
  <div class="vc-time-select-panel">
    <div class="vc-time-up vc-arrow" role="button" @click="up">
      <svg class="vc-svg-icon" width="26px" height="26px" viewBox="-3 1 16 34">
        <path
          d="M10.625 17.429c0 0.143-0.071 0.304-0.179 0.411l-8.321 8.321c-0.107 0.107-0.268 0.179-0.411 0.179s-0.304-0.071-0.411-0.179l-0.893-0.893c-0.107-0.107-0.179-0.25-0.179-0.411 0-0.143 0.071-0.304 0.179-0.411l7.018-7.018-7.018-7.018c-0.107-0.107-0.179-0.268-0.179-0.411s0.071-0.304 0.179-0.411l0.893-0.893c0.107-0.107 0.268-0.179 0.411-0.179s0.304 0.071 0.411 0.179l8.321 8.321c0.107 0.107 0.179 0.268 0.179 0.411z"
        ></path>
      </svg>
    </div>
    <div class="vc-time-current">
      {{ options[current].label }}
    </div>
    <div class="vc-time-down vc-arrow" role="button" @click="down">
      <svg class="vc-svg-icon" width="26px" height="26px" viewBox="-3 0 16 34">
        <path
          d="M10.625 17.429c0 0.143-0.071 0.304-0.179 0.411l-8.321 8.321c-0.107 0.107-0.268 0.179-0.411 0.179s-0.304-0.071-0.411-0.179l-0.893-0.893c-0.107-0.107-0.179-0.25-0.179-0.411 0-0.143 0.071-0.304 0.179-0.411l7.018-7.018-7.018-7.018c-0.107-0.107-0.179-0.268-0.179-0.411s0.071-0.304 0.179-0.411l0.893-0.893c0.107-0.107 0.268-0.179 0.411-0.179s0.304 0.071 0.411 0.179l8.321 8.321c0.107 0.107 0.179 0.268 0.179 0.411z"
        ></path>
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TimeSelectPanel',
  emits: ['update:modelValue'],
  props: {
    options: Array,
    modelValue: null,
  },
  data() {
    return {
      current: this.modelValue ?? this.options[0].value,
    };
  },
  methods: {
    up() {
      const size = this.options.length;
      this.current = this.current === 0 ? size - 1 : this.current - 1;
    },
    down() {
      const size = this.options.length;
      this.current = this.current === size - 1 ? 0 : this.current + 1;
    },
  },
};
</script>

<style lang="css">
@import './time-select-panel.css';
</style>
