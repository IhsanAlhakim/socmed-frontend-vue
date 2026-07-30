<script setup lang="ts">
import { Toaster } from './components/ui/sonner';
import 'vue-sonner/style.css'

</script>

<template>
    <RouterView />
    <Toaster :toast-options="{
        style: {color: '#030712'},
        actionButtonStyle: {background: '#030712'}
    }"/>
</template>


<style scoped></style>
