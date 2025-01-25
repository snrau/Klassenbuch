<script>
  import { klassenbuch } from "./stores/klassenbuch.js";

  let newStudent = "";
  let message = "";

  const addStudent = () => {
    klassenbuch.update((students) => {
      if (newStudent.trim() && !students.find((s) => s.name === newStudent)) {
        return [
          ...students,
          {
            name: newStudent.trim(),
            status: 0,
            lastUpdated: null,
            previousStatus: null,
          },
        ];
      } else {
        message = "Schüler ist bereits im Buch oder Eingabe ist leer.";
        return students;
      }
    });
    newStudent = "";
  };

  const removeStudent = (student) => {
    klassenbuch.update((students) =>
      students.filter((s) => s.name !== student.name),
    );
  };

  const wasUpdatedToday = (lastUpdated) => {
    if (!lastUpdated) return false;
    const today = new Date().toDateString();
    return new Date(lastUpdated).toDateString() === today;
  };

  const markPresent = (student) => {
    klassenbuch.update((students) =>
      students.map((s) => {
        if (s.name === student.name && !wasUpdatedToday(s.lastUpdated)) {
          return {
            ...s,
            previousStatus: s.status,
            status: s.status + 1,
            lastUpdated: new Date().toISOString(),
          };
        }
        return s;
      }),
    );
  };

  const markAbsent = (student) => {
    klassenbuch.update((students) =>
      students.map((s) => {
        if (s.name === student.name && !wasUpdatedToday(s.lastUpdated)) {
          return {
            ...s,
            previousStatus: s.status,
            status: s.status - 1,
            lastUpdated: new Date().toISOString(),
          };
        }
        return s;
      }),
    );
  };

  const resetStatus = (student) => {
    klassenbuch.update((students) =>
      students.map((s) => {
        if (s.name === student.name) {
          return {
            ...s,
            status: s.previousStatus,
            lastUpdated: null,
          };
        }
        return s;
      }),
    );
  };
</script>

<main
  class="p-6 bg-gray-100 shadow-lg rounded-lg"
  style="font-family: 'Patrick Hand', cursive; background-image: url('https://www.transparenttextures.com/patterns/paper.png'); background-size: cover; background-position: center; height: 100vh; width: 100%; margin: auto; display: flex; flex-direction: column; justify-content: space-between; overflow:hidden"
>
  <!-- Fixed Header Content -->
  <div class="flex-1 overflow-hidden">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">
      📘 Klassenbuch
    </h1>

    <div class="my-6 text-center">
      <input
        type="text"
        bind:value={newStudent}
        placeholder="Neuer Schüler"
        class="border rounded p-3 shadow-inner w-2/3 text-center text-gray-700"
      />
      <button
        on:click={addStudent}
        class="bg-blue-600 text-white font-bold rounded-full px-6 py-3 ml-4 shadow-md hover:bg-blue-700"
      >
        ➕ Hinzufügen
      </button>
    </div>

    {#if message}
      <p class="text-red-600 text-center font-semibold">{message}</p>
    {/if}
  </div>

  <!-- Scrollable Table Content -->
  <div class="overflow-hidden" style="flex: 1;">
    <div class="overflow-x-auto w-full">
      <table
        class="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg mx-auto"
      >
        <!-- Table Header -->
        <thead class="bg-blue-200">
          <tr class="grid grid-cols-16 gap-4">
            <th class="col-span-2 text-left p-2 font-semibold text-sm">Name</th>
            <th class="col-span-1 text-left p-2 font-semibold text-sm"
              >Special</th
            >
            <th class="col-span-1 text-left p-2 font-semibold text-sm"
              >Status</th
            >
            <th class="col-span-5 text-left p-2 font-semibold text-sm"
              >Aktionen</th
            >
          </tr>
        </thead>

        <!-- Table Body with fixed height and scroll -->
        <tbody
          class="overflow-y-auto"
          style="max-height: 500px; display: block; overflow-x:hidden"
        >
          {#each $klassenbuch as student, i (student.name)}
            <tr class="grid grid-cols-16 gap-4 border-b border-gray-300 p-2">
              <!-- Name Column -->
              <td class="col-span-2 text-left text-lg font-bold"
                >{student.name}</td
              >
              <!-- Special Column -->
              <td class="col-span-1 text-center">
                {#if student.status >= 3}
                  <span class="text-yellow-500 text-2xl">⭐</span>
                {/if}
                {#if student.status < 0}
                  <span class="text-red-500 text-2xl">❌</span>
                {/if}
              </td>
              <!-- Status Column -->
              <td class="col-span-1 text-center">{student.status}</td>
              <!-- Actions Column -->
              <td
                class="col-span-5 text-center flex flex-wrap gap-2 justify-center"
              >
                <button
                  on:click={() => markPresent(student)}
                  class="bg-green-500 text-white font-bold rounded-full px-4 py-2 shadow hover:bg-green-600"
                >
                  ✔️ Anwesend
                </button>
                <button
                  on:click={() => markAbsent(student)}
                  class="bg-red-500 text-white font-bold rounded-full px-4 py-2 shadow hover:bg-red-600"
                >
                  ❌ Fehlend
                </button>
                <button
                  on:click={() => resetStatus(student)}
                  class="bg-yellow-500 text-white font-bold rounded-full px-4 py-2 shadow hover:bg-yellow-600"
                >
                  ↩️ Rückgängig
                </button>
                <button
                  on:click={() => removeStudent(student)}
                  class="bg-gray-500 text-white font-bold rounded-full px-4 py-2 shadow hover:bg-gray-600"
                >
                  🗑️ Entfernen
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap");

  main {
    max-width: 900px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: black;
  }

  .bg-gray-100 {
    background-color: #f7fafc; /* Light background for the page */
  }

  .overflow-x-auto {
    width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    gap: 15px;
  }

  .col-span-2 {
    grid-column: span 4;
  }

  .col-span-1 {
    grid-column: span 1;
  }

  .col-span-5 {
    grid-column: span 10;
  }

  .text-lg {
    font-size: 1.2rem; /* Larger font size for name */
  }

  .font-bold {
    font-weight: bold;
  }

  .text-center {
    text-align: center;
  }

  .text-sm {
    font-size: 0.9rem;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .gap-4 {
    gap: 1rem;
  }

  .p-2 {
    padding: 0.5rem;
  }

  .p-3 {
    padding: 1rem;
  }

  .gap-2 {
    gap: 0.5rem;
  }

  .font-semibold {
    font-weight: 600;
  }

  tbody {
    display: block;
    max-height: 300px;
    overflow-y: auto;
  }

  tbody tr {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    width: 100%;
    table-layout: fixed;
  }
</style>
