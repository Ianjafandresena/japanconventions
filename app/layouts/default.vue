<template>
  <div class="layout">
    <TheHeader />
    <main class="page-content">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  padding-top: 80px; // Offset for fixed header
}
</style>
