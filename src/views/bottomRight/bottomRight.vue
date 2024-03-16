<script setup></script>

<template>
  <div class="w-full h-full p-2">
    <!-- 二级路由出口 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.5s;
}
/* 
问题： 路由切换跳转到一个页面然后会发现这个页面的布局会先向下闪一下，然后向上闪一下停住。
      虽然不影响使用，但是看着非常膈应。
原因： 其实就是因为路由跳转时有过度效果导致的在跳转的时候上一个路由还占着位置，所以把你布局顶下去了，
      然后页面跳转完了之后他占位消失，你的布局恢复原状。但是这样虽然只有一秒不到的时间，也造成了布局上下闪了一次，
      看着就很难受。所以我们想的办法也很简单，就是让他上一个路由消失的时候别占着位置顶我下一个路由的布局不就好了。
      .fade-leave-active { display: none; }
*/
.fade-leave-active {
  display: none;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
