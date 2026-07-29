<script setup lang="ts">
interface Props {
    type?: string
    name: string
    title: string
}

const props = defineProps<Props>()
const model = defineModel()

</script>

<template>
<div class="flex flex-col gap-1">
    <label :for="name">{{ title }}</label>
    <input :type="type ? type : `text`" required :name="name" v-model="model" autocomplete="off" class="w-130 h-10 px-3 py-1 border-2 rounded-md">
</div>
</template>