<template>
  <div id="app" class="flex justify-content-center">
    <div class="flex-grow-1 flex flex-column m-5" style="max-width: 800px">
      <p-fieldset legend="Fichier source" class="border-dashed border-2">
        <p class="text-center">
          <p-button
            label="Sélectionner un fichier CSV"
            icon="pi pi-file"
            class="p-button-lg"
            @click="$refs.fileInput.click()"
          />
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".csv"
            @change="onFileSelect"
          />
        </p>
      </p-fieldset>

      <p-fieldset legend="Options" class="mt-4">
        <div class="formgrid grid">
            <div class="field col">
              <label for="csv-headers">Colonne contenant les valeurs</label>

              <p-dropdown
                id="csv-headers"
                v-model="selectedColumn"
                :options="csvHeaders"
                :disabled="csvHeaders.length === 0"
                class="w-full"
              />
            </div>

            <div class="field col">
              <label for="kibana-field">Champ Kibana à filtrer</label>

              <p-input-text
                id="kibana-field"
                v-model="kibanaField"
                type="text"
                class="w-full"
              />
            </div>
        </div>
      </p-fieldset>

      <p-fieldset legend="Query Kibana" class="mt-4">
        <div class="text-right mb-2">
          <p-button
            icon="pi pi-question"
            class="p-button-help p-button-outlined mr-2"
            @click="showHowTo = true"
          />
          <p-button
            label="Copier"
            icon="pi pi-copy"
            class="p-button-md"
            @click="copyKibanaQuery"
            :disabled="!kibanaQuery"
          />
        </div>
        <p-textarea
          class="w-full h-full"
          :value="kibanaQuery"
          rows="20"
        />
      </p-fieldset>
    </div>

    <p-dialog
      v-model:visible="showHowTo"
      :modal="true"
      :dismissableMask="true"
      header="Guide d'utilisation"
      position="topright"
    >
      <div class="mb-5" v-for="(image, index) in howToImages" :key="image.src">
        <p-divider type="solid" align="left">
          <p-badge size="large" :value="index + 1" />
        </p-divider>
        <p class="text-lg">{{ image.title }}</p>
        <img :src="image.src" class="border-round border-solid border-1 border-300">
      </div>
    </p-dialog>

    <p-toast position="bottom-right" />
  </div>
</template>

<script>
import Papa from 'papaparse';

const toastLife = 2500;

const howto01 = require('@/assets/howto_01.jpeg');
const howto02 = require('@/assets/howto_02.jpeg');
const howto03 = require('@/assets/howto_03.jpeg');

export default {
  name: 'App',
  data() {
    return {
      csvHeaders: [],
      csvRows: [],
      selectedColumn: null,
      kibanaField: '',
      showHowTo: false,
      howToImages: [
        {
          src: howto01,
          alt: 'Imaage tuto 01',
          title: 'Cliquez sur "Add filter".',
        },
        {
          src: howto02,
          alt: 'Imaage tuto 02',
          title: 'Cliquez sur "Edit as Query DSL".',
        },
        {
          src: howto03,
          alt: 'Imaage tuto 03',
          title: 'Collez la requête dans "Elasticsearch Query DSL".',
        },
      ],
    };
  },
  computed: {
    kibanaQuery() {
      if (!this.csvRows.length === 0) { return ''; }
      if (!this.selectedColumn) { return ''; }
      if (!this.kibanaField.trim()) { return ''; }

      const should = this.csvRows
        .filter((row) => row[this.selectedColumn])
        .map((row) => ({
          match_phrase: {
            [this.kibanaField]: row[this.selectedColumn],
          },
        }));

      const kibanaQuery = {
        query: {
          bool: {
            minimum_should_match: 1,
            should,
          },
        },
      };

      return JSON.stringify(kibanaQuery, null, 2);
    },
  },
  methods: {
    onFileSelect(event) {
      const files = event?.target?.files;
      const file = files && files[0];

      if (!file) { return; }
      if (!/\.csv$/i.test(file.name)) {
        this.$toast.add({ severity: 'error', summary: 'Le fichier importé n\'est pas au format CSV', life: toastLife });
        return;
      }

      this.csvHeaders = [];
      this.csvRows = [];
      this.selectedColumn = null;

      Papa.parse(file, {
        delimiter: ';',
        header: true,
        transformHeader: (header) => {
          this.csvHeaders.push(header);
          return header;
        },
        complete: ({ data: rows, errors }) => {
          if (errors.length > 1) {
            errors.forEach((e) => console.error(e));
          }
          this.csvRows = rows;
          [this.selectedColumn] = this.csvHeaders;
        },
      });
    },

    async copyKibanaQuery() {
      if (!navigator.clipboard) {
        this.$toast.add({ severity: 'error', summary: 'Presse-papier non disponible', life: toastLife });
        return;
      }
      try {
        await navigator.clipboard.writeText(this.kibanaQuery);
      } catch (e) {
        this.$toast.add({ severity: 'error', summary: 'La copie a échoué', life: toastLife });
        return;
      }
      this.$toast.add({ severity: 'success', summary: 'Query copiée dans le presse-papier', life: toastLife });
    },
  },
};
</script>
