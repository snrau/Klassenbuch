<script>
  import { writable } from "svelte/store";

  // Lokaler Store für das Klassenbuch mit Persistenz
  const createPersistentStore = (key, initialValue) => {
    const storedValue = localStorage.getItem(key);
    const store = writable(
      storedValue ? JSON.parse(storedValue) : initialValue,
    );

    store.subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
  };

  // Store für das Klassenbuch
  export const klassenbuch = createPersistentStore("klassenbuch", []);

  let newStudent = "";
  let message = "";

  // Funktion, um neue Schüler hinzuzufügen
  const addStudent = () => {
    if (newStudent.trim() && !klassenbuch.includes(newStudent)) {
      klassenbuch.update((students) => [...students, newStudent.trim()]);
      newStudent = "";
    } else {
      message = "Schüler ist bereits im Buch oder Eingabe ist leer.";
    }
  };

  // Funktion, um Schüler zu entfernen
  const removeStudent = (student) => {
    klassenbuch.update((students) => students.filter((s) => s !== student));
  };
</script>

<main class="p-4">
  <h1 class="text-2xl font-bold">Klassenbuch</h1>

  <div class="my-4">
    <input
      type="text"
      bind:value={newStudent}
      placeholder="Neuer Schüler"
      class="border rounded p-2"
    />
    <button
      on:click={addStudent}
      class="bg-blue-500 text-white rounded px-4 py-2 ml-2"
    >
      Hinzufügen
    </button>
  </div>

  {#if message}
    <p class="text-red-500">{message}</p>
  {/if}

  <ul class="list-disc pl-5">
    {#each $klassenbuch as student (student)}
      <li class="flex items-center my-2">
        <span class="flex-grow">{student}</span>
        <button
          on:click={() => removeStudent(student)}
          class="bg-red-500 text-white rounded px-2 py-1"
        >
          Entfernen
        </button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
  }
</style>
