<template>
    <n-space vertical size="large" style="max-width: 800px; margin: auto; margin-top: 20px;">
        <n-card title="Fichier source">
          <n-upload
            :file-list="[]"
            accept=".csv"
            @before-upload="onFileSelect"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <file-download-icon />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                Cliquez ou glissez votre fichier ici
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                Le fichier doit être au format CSV
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </n-card>

        <n-card title="Options">
          <n-form
            label-placement="left"
            label-width="auto"
          >
            <n-form-item label="Colonne contenant les valeurs" path="formValue.selectedColumn">
              <n-select
                v-model:value="formValue.selectedColumn"
                :options="csvHeaderOptions"
                :disabled="csvHeaderOptions.length === 0"
              />
            </n-form-item>

            <n-form-item label="Champ Kibana à filtrer" path="formValue.kibanaField">
              <n-input v-model:value="formValue.kibanaField"  />
            </n-form-item>
          </n-form>
        </n-card>

        <n-card title="Query Kibana">
          <template #header-extra>
            <n-space>
              <n-button @click="showHowTo = true">
                <template #icon>
                  <n-icon><question-mark-icon /></n-icon>
                </template>
              </n-button>

              <n-button :disabled="!queryPreview" @click="copyKibanaQuery">
                Copier
              </n-button>
            </n-space>
          </template>

          <n-code
            v-if="queryPreview"
            language="json"
            :code="queryPreview"
          />

          <n-empty v-else description="Aperçu indisponible">
            <template #icon>
              <n-icon>
                <code-icon />
              </n-icon>
            </template>
            <template #extra>
              <n-text depth="3">
                Sélectionnez un fichier et saisissez vos paramètres.
              </n-text>
            </template>
          </n-empty>
        </n-card>
    </n-space>

    <n-drawer v-model:show="showHowTo" :width="502" placement="right">
      <n-drawer-content title="Guide d'utilisation">
        <template v-for="(image, index) in howToImages" :key="image.src">
          <n-divider title-placement="center">
            Étape {{ index + 1 }}
          </n-divider>

          <n-p>{{ image.title }}</n-p>

          <img
            :src="image.src"
            :alt="image.alt"
            style="border: 1px solid #e0e0e0; border-radius: 3px;"
          >
        </template>
      </n-drawer-content>
    </n-drawer>
</template>

<script>
import { defineComponent } from 'vue';
import Papa from 'papaparse';
import hljs from 'highlight.js/lib/core';
import jsonLang from 'highlight.js/lib/languages/json';

import {
  useMessage,
} from 'naive-ui';

hljs.registerLanguage('json', jsonLang);

const howto01 = require('@/assets/howto_01.jpeg');
const howto02 = require('@/assets/howto_02.jpeg');
const howto03 = require('@/assets/howto_03.jpeg');

export default defineComponent({
  name: 'App',
  setup() {
    window.$message = useMessage();
  },
  data() {
    return {
      formValue: {
        selectedColumn: null,
        kibanaField: '',
      },
      csvHeaders: [],
      csvRows: [],
      selectedColumn: null,
      kibanaField: '',
      showHowTo: false,
      howToImages: [
        {
          src: howto01,
          alt: 'Image tuto 01',
          title: 'Cliquez sur "Add filter".',
        },
        {
          src: howto02,
          alt: 'Image tuto 02',
          title: 'Cliquez sur "Edit as Query DSL".',
        },
        {
          src: howto03,
          alt: 'Image tuto 03',
          title: 'Collez la requête dans "Elasticsearch Query DSL".',
        },
      ],
    };
  },
  computed: {
    csvHeaderOptions() {
      return this.csvHeaders.map((label) => ({ label, value: label }));
    },
    configIsReady() {
      if (!this.csvRows.length === 0) { return false; }
      if (!this.formValue.selectedColumn) { return false; }
      if (!this.formValue.kibanaField.trim()) { return false; }
      return true;
    },
    queryPreview() {
      return this.getKibanaQuery({ limit: 1 });
    },
  },
  methods: {
    getKibanaQuery(opts = {}) {
      if (!this.configIsReady) { return ''; }

      const should = this.csvRows
        .slice(0, opts?.limit)
        .filter((row) => row[this.formValue.selectedColumn])
        .map((row) => ({
          match_phrase: {
            [this.formValue.kibanaField]: row[this.formValue.selectedColumn],
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
    onFileSelect(data) {
      const file = data?.file?.file;

      if (!file) { return; }
      if (!/\.csv$/i.test(file.name)) {
        window.$message.error('Le fichier importé n\'est pas au format CSV');
        return;
      }

      this.csvHeaders = [];
      this.csvRows = [];
      this.formValue.selectedColumn = null;

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
          [this.formValue.selectedColumn] = this.csvHeaders;
        },
      });
    },

    async copyKibanaQuery() {
      if (!navigator.clipboard) {
        window.$message.error('Presse-papier non disponible');
        return;
      }
      try {
        await navigator.clipboard.writeText(this.getKibanaQuery());
      } catch (e) {
        window.$message.error('La copie a échoué');
        return;
      }
      window.$message.success('Query copiée dans le presse-papier');
    },
  },
});
</script>
