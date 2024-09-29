<script setup></script>

<template>
  <section class="w-screen h-screen flex items-center p-16 select-none dark:bg-black">
    <div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
      <div class="max-w-md text-center">
        <h2 class="mb-8 font-extrabold text-9xl dark:text-white"><span class="sr-only">Error</span>404</h2>
        <p class="text-2xl font-semibold md:text-3xl dark:text-white">Sorry, we couldn't find this page.</p>
        <p class="my-6"></p>
        <router-link
          to="/"
          class="px-8 py-3 font-semibold rounded bg-violet-500 shadow-lg shadow-violet-500/50 dark:text-white transition-all active:scale-90">
          Back to homepage
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
