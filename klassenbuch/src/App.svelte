<script>
  import { klassenbuch } from "./stores/klassenbuch.js";

  // Local variables
  let newStudent = "";
  let message = "";

  // Add a new student
  const addStudent = () => {
    klassenbuch.update((students) => {
      if (newStudent.trim() && !students.find((s) => s.name === newStudent)) {
        return [
          ...students,
          { name: newStudent.trim(), status: 0, lastUpdated: null },
        ];
      } else {
        message = "Schüler ist bereits im Buch oder Eingabe ist leer.";
        return students;
      }
    });
    newStudent = "";
  };

  // Remove a student
  const removeStudent = (student) => {
    klassenbuch.update((students) =>
      students.filter((s) => s.name !== student.name),
    );
  };

  // Helper function to check if a student was updated today
  const wasUpdatedToday = (lastUpdated) => {
    if (!lastUpdated) return false;
    const today = new Date().toDateString();
    return new Date(lastUpdated).toDateString() === today;
  };

  // Mark a student as present
  const markPresent = (student) => {
    klassenbuch.update((students) =>
      students.map((s) => {
        if (s.name === student.name && !wasUpdatedToday(s.lastUpdated)) {
          return {
            ...s,
            status: s.status + 1,
            lastUpdated: new Date().toISOString(),
          };
        }
        return s;
      }),
    );
  };

  // Mark a student as absent
  const markAbsent = (student) => {
    klassenbuch.update((students) =>
      students.map((s) => {
        if (s.name === student.name && !wasUpdatedToday(s.lastUpdated)) {
          return {
            ...s,
            status: s.status - 1,
            lastUpdated: new Date().toISOString(),
          };
        }
        return s;
      }),
    );
  };
</script>

<main class="p-4">
  <h1 class="text-2xl font-bold">Klassenbuch</h1>

  <!-- Input to add new students -->
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

  <!-- Visual representation (table) -->
  <table class="table-auto w-full border-collapse border border-gray-200">
    <thead>
      <tr>
        <th class="border border-gray-300 px-4 py-2 text-left">#</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Name</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Status</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Aktionen</th>
      </tr>
    </thead>
    <tbody>
      {#each $klassenbuch as student, i (student.name)}
        <tr>
          <td class="border border-gray-300 px-4 py-2">{i + 1}</td>
          <td class="border border-gray-300 px-4 py-2 flex items-center">
            {student.name}
            {#if student.status >= 3}
              <span class="ml-2 text-yellow-500">⭐</span>
            {/if}
            {#if student.status < 0}
              <span class="ml-2 text-red-500">❌</span>
            {/if}
          </td>
          <td class="border border-gray-300 px-4 py-2">{student.status}</td>
          <td class="border border-gray-300 px-4 py-2">
            <button
              on:click={() => markPresent(student)}
              class="bg-green-500 text-white rounded px-2 py-1"
            >
              Anwesend
            </button>
            <button
              on:click={() => markAbsent(student)}
              class="bg-red-500 text-white rounded px-2 py-1 ml-2"
            >
              Fehlend
            </button>
            <button
              on:click={() => removeStudent(student)}
              class="bg-gray-500 text-white rounded px-2 py-1 ml-2"
            >
              Entfernen
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: auto;
  }
  table {
    margin-top: 20px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
</style>
