<template>
  <div
    class="bg-cover bg-center h-screen"
    style="background-image: url('/background.gif')"
  >
    <div
      class="flex-grow h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <h1
        class="text-5xl sm:text-6xl font-extrabold text-font drop-shadow-secondary mb-4 z-10"
      >
        Bienvenue sur mon Portfolio
      </h1>
      <h2 class="text-xl sm:text-2xl font-extrabold text-font drop-shadow-secondary mb-4 z-10">
        Romain Giraud - Développeur Game & Web
      </h2>
      <NuxtLink
        to="/action"
        class="px-8 py-4 bg-primary-500 text-secondary-500 hover:text-font font-semibold rounded-full shadow-lg hover:bg-secondary-500 transition duration-300"
      >
        Découvrir
      </NuxtLink>
    </div>
  </div>
</template>
