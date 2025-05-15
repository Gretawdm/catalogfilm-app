import { openDB } from 'idb';

const DATABASE_NAME = 'catalog film';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'favorites';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function getAll() {
  return (await dbPromise).getAll(OBJECT_STORE_NAME);
}

export async function get(id) {
  return (await dbPromise).get(OBJECT_STORE_NAME, id);
}

export async function put(story) {
  if (!story.id) throw new Error('ID diperlukan untuk menyimpan.');
  return (await dbPromise).put(OBJECT_STORE_NAME, story);
}

export async function deleteFavorite(id) {
  return (await dbPromise).delete(OBJECT_STORE_NAME, id);
}
