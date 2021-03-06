import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Eventure } from '../event.model';
import { EventService } from '../shared/services';
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  @Input() event?: Eventure;

  isCreateMode = true;
  isLoading = false;
  uploadProgress: number; // The value should be between [0, 1]
  eventDocRef: DocumentReference<DocumentData>;

  eventForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    picture: [''],
  });

  constructor(
    private modalCtrl: ModalController,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<any> {
    this.isCreateMode = this.event === undefined;

    if (!this.isCreateMode) {
      this.eventForm.patchValue({
        ...this.event,
      });
      this.eventDocRef = doc(this.firestore, `events/${this.event.id}`);
    } else {
      // Add a new document with a generated id
      this.eventDocRef = doc(collection(this.firestore, 'events'));
    }
  }

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    console.log(file.name);

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
    uploadTask.on(
      'state_changed',
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
          this.eventForm.patchValue(
            { picture: storageFilePath },
            { emitEvent: true }
          );
          // this.eventForm.controls['picture'].setValue(filePath);
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      if (!this.isCreateMode) {
        await this.eventService.update(this.event.id, this.eventForm.value);
      } else {
        await this.eventService.set(
          { ...new Eventure(this.eventForm.value) },
          this.eventDocRef
        );
      }
      this.dismissModal();
    } catch (err) {
      console.log(err);
    }
    this.isLoading = false;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
