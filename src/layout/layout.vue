<script setup>
import Top from "@/views/top/top.vue";
import bottomLeft from "@/views/bottomLeft/bottomLeft.vue";
import bottomRight from "@/views/bottomRight/bottomRight.vue";
</script>

<template>
  <div>
    <el-row>
      <el-col :span="24">
        <Top></Top>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="bottomLeft" :span="12" :xs="0">
        <bottomLeft></bottomLeft>
      </el-col>
      <el-col :span="12" :xs="24">
        <bottomRight></bottomRight>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
