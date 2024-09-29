<script setup></script>

<template>
  <section class="flex h-screen w-screen select-none items-center p-16 dark:bg-black">
    <div class="container mx-auto my-8 flex flex-col items-center justify-center px-5">
      <div class="max-w-md text-center">
        <h2 class="mb-8 text-9xl font-extrabold dark:text-white"><span class="sr-only">Error</span>404</h2>
        <p class="text-2xl font-semibold md:text-3xl dark:text-white">Sorry, we couldn't find this page.</p>
        <p class="my-6"></p>
        <router-link
          to="/"
          class="rounded bg-violet-500 px-8 py-3 font-semibold shadow-lg shadow-violet-500/50 transition-all active:scale-90 dark:text-white">
          Back to homepage
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
