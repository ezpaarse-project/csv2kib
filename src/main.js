import 'primeflex/primeflex.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Fieldset from 'primevue/fieldset';
import FileUpload from 'primevue/fileupload';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Badge from 'primevue/badge';
import ToastService from 'primevue/toastservice';

import App from './App.vue';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);

app.component('p-button', Button);
app.component('p-textarea', Textarea);
app.component('p-fieldset', Fieldset);
app.component('p-file-upload', FileUpload);
app.component('p-dropdown', Dropdown);
app.component('p-input-text', InputText);
app.component('p-toast', Toast);
app.component('p-dialog', Dialog);
app.component('p-divider', Divider);
app.component('p-badge', Badge);

app.mount('#app');
