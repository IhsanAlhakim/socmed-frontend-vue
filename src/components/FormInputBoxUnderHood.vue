<script setup lang="ts">
interface Props {
    title: string
    type: string
    name: string
    modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

function onInputHandler(event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

</script>

<template>
<div class="flex flex-col gap-1">
    <label :for="name">{{ title }}</label>
    <input :type="type" required :name="name" :value="modelValue" @input="onInputHandler"  class="w-130 h-10 px-3 py-1 border-2 rounded-md">
</div>
</template>