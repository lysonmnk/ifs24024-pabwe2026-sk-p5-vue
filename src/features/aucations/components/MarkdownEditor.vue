<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const props = defineProps({ modelValue: { type: String, default: "" }, height: { type: String, default: "260px" } });
const emit = defineEmits(["update:modelValue"]);
const el = ref(null);
let editor;

onMounted(() => {
  editor = new Editor({
    el: el.value,
    height: props.height,
    initialEditType: "markdown",
    previewStyle: "tab",
    initialValue: props.modelValue,
    events: { change: () => emit("update:modelValue", editor.getMarkdown()) },
  });
});
onBeforeUnmount(() => editor?.destroy());
</script>

<template>
  <div ref="el" data-testid="markdown-editor" />
</template>
