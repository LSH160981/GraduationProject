<script setup>
import { ref } from "vue";
let title = ref("0.5");
let value = ref("0.5");
const onChange = (e) => {
  title.value = e.target.value;
  value.value = e.target.value;
};
</script>

<template>
  <div class="input-range">
    {{ title }}
    <input type="range" :value="value" :min="0" :max="1" :step="0.1" @input="onChange" />
  </div>
</template>

<style scoped>
.input-range {
  --RangeContent-bgc: rgb(18, 131, 84);
  --RangeContent-w: 25px;
  --RangeContent-h: 10px;
  width: 165px;
  border: 1px solid #dedede;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  max-width: 40%;

  input[type="range"] {
    max-width: calc(100% - 34px);
    appearance: none;
    background-color: #fff;
    color: #303030;
    transition: all 0.3s;
  }
  input[type="range"]:hover {
    cursor: pointer;
    transform: scale(1.1);
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: var(--RangeContent-w);
    height: var(--RangeContent-h);
    background: var(--RangeContent-bgc);
    border-radius: 5px;
  }

  input[type="range"]::-moz-range-thumb {
    width: var(--RangeContent-w);
    height: var(--RangeContent-h);
    background: var(--RangeContent-bgc);
    border-radius: 5px;
  }
}
</style>
