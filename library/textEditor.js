class MyUploadAdapter {
    constructor( loader ) {
        this.loader = loader;
    }
    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {

                gilace.filemanager.openDialog().onSelect((files)=>{
                    let file = files[0];
                    resolve( {
                        default:ASSETSPATH+ file.url
                    } );
                    gilace.filemanager.closeDialog();
                });

                gilace.filemanager.upload(file);

            } ) );
    }
    abort() {
        /** abort handler **/
    }
}

function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new MyUploadAdapter( loader );
    };
}

class TextEditor {
    constructor(selector) {
        console.log(selector);
        if (typeof BalloonBlockEditor == 'undefined') {
            new loader().load([APPPATH+'assets/js/ckeditor.js']).then(()=>{
                this.load(selector);
            }).catch(err=>{
               throw new Error(err.message);
            });
        } else {
            this.load(selector);
        }
    }

    load(selector) {
        console.log('load text editor');
        BalloonBlockEditor.create(document.querySelector(selector), {

            placeholder: 'متن خود را اینجا بنویسید',
            toolbar: {
                items: [
                    'bold',
                    'underline',
                    'italic',
                    'link',
                    'removeFormat',
                    'numberedList',
                    'bulletedList',
                    'fontBackgroundColor',
                    'fontColor',
                    'fontSize',
                    'indent',
                    'outdent',
                    'alignment',
                    'undo',
                    'redo'
                ]
            },
            language: 'fa',
            blockToolbar: [
                'heading',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'imageUpload',
                'horizontalLine',
                'specialCharacters'
            ],
            image: {
                toolbar: [
                    'imageTextAlternative',
                    'imageStyle:full',
                    'imageStyle:side'
                ]
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableCellProperties',
                    'tableProperties'
                ]
            },
            licenseKey: '',
            extraPlugins: [ MyCustomUploadAdapterPlugin ],
        })
            .then(editor => {
                window.editor = editor;
            })
            .catch(error => {
                console.error('Oops, something gone wrong!');
                console.error('Please, report the following error in the https://github.com/ckeditor/ckeditor5 with the build id and the error stack trace:');
                console.warn('Build id: cj2zbzp0xhtc-6v79c6to08vc');
                console.error(error);
            });
    }
}

export default TextEditor;