<template>
    <!-- Conteneur principal avec fond (à remplacer par ton image ou dégradé) -->
    <div
      class="min-h-screen flex flex-col bg-cover bg-center"
      style="background-image: url('/images/fond-landing.jpg')"
    >
  
      <!-- Section Hero centrée -->
      <main class="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 class="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
          Bienvenue sur MonSite
        </h1>
        <p class="text-xl sm:text-2xl text-white drop-shadow-lg mb-8">
          Une description accrocheuse pour présenter votre service ou produit.
        </p>
        <NuxtLink
          to="/action"
          class="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
          Découvrir
        </NuxtLink>
      </main>
  
    </div>
  </template>