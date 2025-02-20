<script setup lang="ts">
import BaseLoader from "@/components/BaseLoader.vue";
import { useRoomList } from "@/composables";
import { onMounted } from "vue";

const { roomList, loading, createMatrixClient } = useRoomList();

onMounted(() => {
  const accessToken = localStorage.getItem("matrix_access_token"),
    baseUrl = localStorage.getItem("matrix_base_url"),
    userId = localStorage.getItem("matrix_user");
  createMatrixClient(baseUrl, userId, accessToken);
});
</script>

<template>
  <BaseLoader v-if="loading" class="my-10" />
  <ul v-else class="my-10 w-[380px]">
    <li
      v-for="(room, index) in roomList"
      :key="index"
      class="px-5 py-[15px] border-b border-zinc-700 last:border-0"
    >
      <div class="relative flex">
        <div class="relative self-center ltr:mr-3 rtl:ml-3">
          <img
            v-if="room.avatarUrl"
            :src="room.avatarUrl"
            class="rounded-full w-9 h-9"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <div
            v-else
            class="flex items-center justify-center rounded-full w-9 h-9 bg-violet-500/20"
          >
            <span class="text-violet-500">
              {{ room.name.charAt(0).toUpperCase() }}
            </span>
          </div>
        </div>
        <div class="flex-grow overflow-hidden space-y-1">
          <h5 class="text-base truncate text-gray-50">{{ room.name }}</h5>
          <p v-if="room.lastMessage?.text" class="truncate text-gray-300">
            {{ room.lastMessage.text }}
          </p>
        </div>
        <div v-if="room.lastMessage?.date" class="text-[0.6rem] text-gray-300">
          {{ room.lastMessage.date.toLocaleString() }}
        </div>
        <div
          v-if="room.unreadNotificationCount > 0"
          class="absolute bottom-0 ltr:right-0 rtl:left-0"
        >
          <span class="px-2 text-red-500 rounded-full bg-red-500/20 text-[0.6rem]">
            {{ room.unreadNotificationCount }}
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>
