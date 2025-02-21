import { ref } from "vue";
import * as sdk from "matrix-js-sdk";

type Nullable<T> = T | null;
interface IRoomItem {
  name: string;
  unreadNotificationCount: number;
  lastEvent: Nullable<{
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
    const matrixClient = sdk.createClient({
      baseUrl: baseUrl,
      userId: userId || undefined,
      accessToken: accessToken || undefined,
    });
    matrixClient.startClient();
    matrixClient.on(sdk.ClientEvent.Sync, (state: sdk.SyncState) => {
      if (state === "PREPARED") {
        const rooms = matrixClient
          .getRooms()
          .map((room: sdk.Room) => {
            return {
              name: room.normalizedName,
              unreadNotificationCount: room.getUnreadNotificationCount() ?? 0,
              lastEvent: getLastEvent(room),
              avatarUrl: room.getAvatarUrl(matrixClient.baseUrl, 52, 52, "crop", true),
            };
          })
          .sort((a, b) => {
            const sortByDate = b.lastEvent && a.lastEvent ? b.lastEvent.date.getTime() - a.lastEvent.date.getTime() : 0; 
            return sortByDate || a.name.localeCompare(b.name ?? '');
          });
        roomList.value = rooms;
        loading.value = false;
      }
    });
  }

  function getLastEvent(room: sdk.Room): Nullable<{ text: string; date: Date }> {
    let result = null;
    if (room) {
      const timeline = room.getLiveTimeline().getEvents();
      const lastEvent = timeline[timeline.length - 1];

      switch (lastEvent.getType()) {
        case "m.room.message":
          result = {
            text: lastEvent.getContent().body as string,
            date: lastEvent.getDate() as Date,
          };
          break;
        case "m.room.name":
          result = {
            text: `Новое название комнаты ${lastEvent.getContent().name}`,
            date: lastEvent.getDate() as Date,
          };
          break;
        case "m.room.avatar":
          result = {
            text: "Изменился аватар комнаты",
            date: lastEvent.getDate() as Date,
          };
          break;
        default:
          break;
      }
    }

    return result;
  }
  return {
    roomList,
    loading,
    createMatrixClient,
  };
}
