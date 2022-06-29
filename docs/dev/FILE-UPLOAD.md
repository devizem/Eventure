# Upload files to Firebase Cloud Storage

https://firebase.google.com/docs/storage/web/start

[Angular File upload: Complete Guide](https://blog.angular-university.io/angular-file-upload/)
[ion-progress-bar](https://ionicframework.com/docs/api/progress-bar)

## AppModule

```ts
import { provideStorage, getStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ...
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
  ...
})
export class AppModule {}
```

## event-form

### View

value="0.5" equiv. 50%

```html
<input type="file" (change)="onFileSelected($event)" />
<ion-progress-bar
  [value]="uploadProgress"
  *ngIf="uploadProgress"
></ion-progress-bar>
```

### Component

The [File](https://developer.mozilla.org/en-US/docs/Web/API/File) interface provides information about files and allows JavaScript in a web page to access their content.

```ts
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

public uploadProgress: number; // The value should be between [0, 1]

export class EventFormComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private storage: Storage
  ) {}

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];

    // const element = event.currentTarget as HTMLInputElement;
    // let fileList: FileList | null = element.files;

    const storageFilePath = `${this.eventDocRef.id}/${file.name}`;
    const storageFileRef = ref(this.storage, storageFilePath);

    // Upload the file and metadata
    const uploadTask = uploadBytesResumable(storageFileRef, file);

    // Pause the upload
    // uploadTask.pause();

    // Resume the upload
    // uploadTask.resume();

    // Cancel the upload
    // uploadTask.cancel();

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.uploadProgress = snapshot.bytesTransferred / snapshot.totalBytes;
        console.log('Upload is ' + this.uploadProgress * 100 + '% done');

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }
}
```

## Furthermore

- [Simon Grimm - Building an Ionic App with Firebase Authentication & File Upload using AngularFire 7](https://devdactic.com/ionic-firebase-auth-upload/)
