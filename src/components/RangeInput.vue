<script setup>
/**
 * 父组件传递的 数据
 * value 默认值
 */
defineProps({
  value: {
    type: Number,
    require: true,
  },
  min: {
    type: Number,
    require: true,
  },
  max: {
    type: Number,
    require: true,
  },
  step: {
    type: Number,
    require: true,
  },
  onChange: {
    type: Function,
    require: true,
  },
})
</script>

<template>
  <div class="input-range">
    {{ value }}
    <input
      type="range"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @input="onChange"
    />
  </div>
</template>

<style scoped>
.input-range {
  --RangeContent-bgc: rgb(18, 131, 84);
  --RangeContent-w: 25px;
  --RangeContent-h: 10px;
  width: 180px;
  border: 1px solid #dedede;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  max-width: 40%;
  transition: all 1s;
}
.input-range:active {
  border: 1px solid var(--range-border-color);
}

input[type='range'] {
  max-width: calc(100% - 34px);
  appearance: none;
  background-color: var(--base-bgc);
  color: #303030;
  transition: all 0.3s;
}
input[type='range']:hover {
  cursor: pointer;
  transform: scale(1.1);
}

input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: var(--RangeContent-w);
  height: var(--RangeContent-h);
  background: var(--RangeContent-bgc);
  border-radius: 5px;
}

input[type='range']::-moz-range-thumb {
  width: var(--RangeContent-w);
  height: var(--RangeContent-h);
  background: var(--RangeContent-bgc);
  border-radius: 5px;
}
</style>
