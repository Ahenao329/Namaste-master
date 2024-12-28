import { AngularEditorConfig } from '@kolkov/angular-editor';

export const editorDefaultConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '80px',
  maxHeight: '600px',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: '',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  //fonts: [
  // { class: 'arial', name: 'Arial' },      
  //],
  customClasses: [
    {
      name: 'Titulo 1 - color 1',
      class: 'editor-titulo1',
    },
    {
      name: 'Titulo 1 - color 2',
      class: 'editor-titulo1-color2',
    },
    {
      name: 'Titulo 2 - color 1',
      class: 'editor-titulo2',
    },
    {
      name: 'Titulo 2 - color 2',
      class: 'editor-titulo2-color2',
    }
  ],
  uploadUrl: '',
  uploadWithCredentials: false,
  sanitize: false, //Por defecto es true, pero presenta warnigns en consola, y aún no se conoce su funcionamiento
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    ['fontSize'],
    ['insertImage', 'fontName']
  ]
};