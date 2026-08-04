<script setup lang="ts">
interface Props {
    type?: "button" | "submit" | "reset"
    isDisabled?: boolean
}

const emit = defineEmits(['click'])

const props = defineProps<Props>()

</script>

<template>
    <button :type="type" :disabled="isDisabled" @click="emit('click', $event)" class="px-3 py-1 rounded-md font-semibold cursor-pointer">
        <slot/>
    </button>
</template>