import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as fromPipes from './pipes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [...fromPipes.pipes],
  imports: [CommonModule],
  exports: [TranslateModule, ...fromPipes.pipes],
})
export class SharedModule {}
