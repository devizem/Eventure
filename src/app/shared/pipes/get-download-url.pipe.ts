import { Pipe, PipeTransform } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';

@Pipe({
  name: 'getDownloadUrl',
})
export class GetDownloadUrlPipe implements PipeTransform {
  constructor(private storage: Storage) {}

  transform(filePath: string): Promise<string> {
    const storageRef = ref(this.storage, filePath);

    return getDownloadURL(storageRef);
  }
}
