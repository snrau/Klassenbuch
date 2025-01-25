import { writable } from 'svelte/store';

// Create a persistent store
const createPersistentStore = (key, initialValue) => {
    const storedValue = localStorage.getItem(key);
    const store = writable(storedValue ? JSON.parse(storedValue) : initialValue);

    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
};

// Export the klassenbuch store
export const klassenbuch = createPersistentStore('klassenbuch', []);
