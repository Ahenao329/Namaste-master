import { ModuleWithProviders, NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralControlsModule } from '../../layout/generalControls/generalControls.module';
import { BusinessControlsModule } from 'app/layout/businessControls/businessControls.module';
import { PublicModule } from 'app/public/public.module';
import { PublicControlsModule } from 'app/public/public-controls/public-controls.module';
import { reportControlsModule } from 'app/layout/reportControls/reportControls.module';


@NgModule({
  imports: [
    MaterialModule,
    TranslateModule,
    GeneralControlsModule,
    BusinessControlsModule,
    PublicControlsModule,
    reportControlsModule,
    
    
  ],
  exports: [
    MaterialModule,
    TranslateModule,
    GeneralControlsModule,
    BusinessControlsModule,
    PublicControlsModule,   
    reportControlsModule,
    
  ],
  declarations: []

})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [

      ]
    };
  }
}
