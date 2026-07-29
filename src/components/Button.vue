<script setup lang="ts">
interface Props {
    type?: "button" | "submit" | "reset"
    isDisabled?: boolean
}

const props = defineProps<Props>()

</script>

<template>
    <button :type="type" :disabled="isDisabled" class="px-4 py-2 rounded-full font-semibold cursor-pointer">
        <slot/>
    </button>
</template>