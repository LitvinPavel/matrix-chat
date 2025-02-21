<script setup async lang="ts">
import FormField from "@/components/FormField.vue";
import { useAuth } from "@/composables";

const { formRef, onSubmit } = useAuth();
</script>

<template>
  <div class="max-w-md w-full px-4 py-4">
    <form class="space-y-5" @submit.prevent="onSubmit">
      <h3 class="text-gray-300 text-3xl font-extrabold mb-5">Вход</h3>

      <FormField
        v-model="formRef.baseUrl"
        name="baseUrl"
        type="text"
        placeholder="например, https://matrix.org"
        label="Домашний сервер"
        isRequired
      />

      <FormField
        v-model="formRef.login"
        name="login"
        type="text"
        placeholder="Введите логин"
        label="Логин"
        isRequired
      />

      <FormField
        v-model="formRef.password"
        name="password"
        type="password"
        placeholder="Введите пароль"
        label="Пароль"
        isRequired
      />

      <div class="mt-12">
        <button
          type="submit"
          class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Войти
        </button>
      </div>
    </form>
  </div>
</template>
