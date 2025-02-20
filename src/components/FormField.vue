<script setup lang="ts">
import { useModel } from "vue";

export interface Props {
  modelValue: string;
  type: string;
  name: string;
  placeholder: string;
  label: string;
  isRequired: boolean;
}

export type Emits = {
  (e: "update:modelValue", value: string): void;
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: ''
});

const valueModel = useModel(props, "modelValue");
</script>

<template>
  <div>
    <label class="text-gray-300 text-xs block mb-2">{{ label }}</label>
    <div class="relative flex items-center">
      <input
        v-model="valueModel"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="isRequired"
        class="w-full text-gray-300 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
      />
    </div>
  </div>
</template>

<style scoped></style>
