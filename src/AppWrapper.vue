<template>
  <n-config-provider
    :locale="frFR"
    :date-locale="dateFrFR"
    :hljs="hljs"
  >
    <n-message-provider placement="bottom-right">
      <App />
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent } from 'vue';
import {
  frFR,
  dateFrFR,
  NConfigProvider,
  NMessageProvider,
} from 'naive-ui';

import hljs from 'highlight.js/lib/core';
import jsonLang from 'highlight.js/lib/languages/json';

import App from './App.vue';

hljs.registerLanguage('json', jsonLang);

export default defineComponent({
  name: 'AppWrapper',
  components: {
    App,
    NConfigProvider,
    NMessageProvider,
  },
  data() {
    return {
      hljs,
      frFR,
      dateFrFR,
    };
  },
});
</script>
