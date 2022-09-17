import 'vfonts/FiraCode.css';

import { createApp } from 'vue';

import {
  NSpace,
  NCard,
  NCode,
  NButton,
  NDrawer,
  NDrawerContent,
  NDivider,
  NEmpty,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NP,
} from 'naive-ui';

import {
  CodeFilled,
  FileDownloadOutlined,
  QuestionMarkFilled,
} from '@vicons/material';

import App from './AppWrapper.vue';

const app = createApp(App);

app.component('n-space', NSpace);
app.component('n-card', NCard);
app.component('n-code', NCode);
app.component('n-button', NButton);
app.component('n-drawer', NDrawer);
app.component('n-drawer-content', NDrawerContent);
app.component('n-divider', NDivider);
app.component('n-empty', NEmpty);
app.component('n-form', NForm);
app.component('n-form-item', NFormItem);
app.component('n-input', NInput);
app.component('n-select', NSelect);
app.component('n-upload', NUpload);
app.component('n-upload-dragger', NUploadDragger);
app.component('n-icon', NIcon);
app.component('n-text', NText);
app.component('n-p', NP);

app.component('file-download-icon', FileDownloadOutlined);
app.component('code-icon', CodeFilled);
app.component('question-mark-icon', QuestionMarkFilled);

app.mount('#app');
