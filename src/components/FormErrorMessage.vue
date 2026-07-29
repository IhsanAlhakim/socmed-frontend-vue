<script setup lang="ts">
import { CircleX } from '@lucide/vue';

</script>

<template>
    <div
        class="flex gap-2 border-2 px-3 py-2 rounded-md border-red-500 my-2 cursor-pointer">
        <CircleX color="#f56565" />
        <p><slot/></p>
    </div>
</template>