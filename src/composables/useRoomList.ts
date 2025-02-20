import { ref } from "vue";
import * as sdk from "matrix-js-sdk";

type Nullable<T> = T | null;

interface IRoomItem {
  name: string;
  unreadNotificationCount: number;
  lastMessage: Nullable<{
    text: string;
    date: Date;
  }>;
  avatarUrl: Nullable<string>;
}

export function useRoomList() {
  const roomList = ref<Nullable<IRoomItem[]>>(null);
  const loading = ref<boolean>(true);

  function createMatrixClient(
    baseUrl: Nullable<string>,
    userId: Nullable<string>,
    accessToken: Nullable<string>
  ) {
    if (!baseUrl) return;
    let matrixClient = sdk.createClient({
      baseUrl: baseUrl,
      userId: userId || undefined,
      accessToken: accessToken || undefined,
    });
    matrixClient.startClient();
    matrixClient.on(sdk.ClientEvent.Sync, (state: sdk.SyncState) => {
      if (state === "PREPARED") {
        const rooms = matrixClient.getRooms().map((room) => {
          return {
            name: room.normalizedName,
            unreadNotificationCount: room.getUnreadNotificationCount() ?? 0,
            lastMessage: getLastMessage(room),
            avatarUrl: room.getAvatarUrl(matrixClient.baseUrl, 52, 52, "crop", true),
          };
        });
        roomList.value = rooms;
        loading.value = false;
      }
    });
  }

  function getLastMessage(room: sdk.Room): Nullable<{ text: string; date: Date }> {
    let lastMessage = null;
    if (room) {
      const timeline = room.getLiveTimeline().getEvents();
      const lastMessageEvent = timeline[timeline.length - 1];

      if (lastMessageEvent && lastMessageEvent.getType() === "m.room.message") {
        lastMessage = {
          text: lastMessageEvent.getContent().body as string,
          date: lastMessageEvent.getDate() as Date,
        };
      }
    }
    return lastMessage;
  }
  return {
    roomList,
    loading,
    createMatrixClient,
  };
}
