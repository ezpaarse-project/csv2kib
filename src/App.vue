<template>
  <div id="app">
    <textarea
      v-model="csv"
      cols="50"
      rows="20"
    />
    <textarea
      :value="kibanaQuery"
      cols="50"
      rows="20"
    />
    <button @click="updateKibanaFilter">Pool!</button>
  </div>
</template>

<script>
import Papa from 'papaparse';

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      csv: '',
      column: 'umr',
      kibanaQuery: '',
      kibanaField: 'unit',
    };
  },
  methods: {
    updateKibanaFilter() {
      if (!this.csv.trim() || !this.kibanaField.trim()) {
        this.kibanaQuery = '';
        return;
      }

      Papa.parse(this.csv, {
        delimiter: ';',
        header: true,
        complete: ({ data: rows, errors }) => {
          if (errors.length > 1) {
            errors.forEach((e) => console.error(e));
          }

          const should = rows
            .filter((row) => row[this.column])
            .map((row) => ({
              match_phrase: {
                [this.kibanaField]: row[this.column],
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

          this.kibanaQuery = JSON.stringify(kibanaQuery, null, 2);
        },
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
