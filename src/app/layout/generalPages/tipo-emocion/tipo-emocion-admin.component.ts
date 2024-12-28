import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppConfig } from 'app/config/app.config';
import { IAppConfig } from 'app/config/iapp.config';
import { SiNo } from 'app/models/generalModels/siNo.model';
import { TipoEmocion } from 'app/models/generalModels/tipoEmocion.model';
import { TipoEmocionListarRespuesta } from 'app/models/generalModels/transferObjects/tipoEmocionListarRespuesta.model';
import { TipoEmocionService } from 'app/services/generalService/tipoEmocion.service';
import { usuarioLoginService } from 'app/services/generalService/usuarioLogin.service';
import { SessionHelperService } from 'app/services/helpers/sessionHelper.service';
import { EnumRecursos } from 'app/shared/enums/commonEnums';
import { Messages } from 'app/shared/Messages/Messages';
import { errorMessages, regExps } from 'app/Util/Validaciones.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BaseEditPage } from '../BasePages/BaseEditPage';
import { NgxMatColorPickerInput, Color } from '@angular-material-components/color-picker';


@Component({
  selector: 'app-tipo-emocion-admin',
  templateUrl: './tipo-emocion-admin.component.html',

})
export class TipoEmocionAdminComponent extends BaseEditPage implements OnInit {
  public id: number = 0;
  public modelo: TipoEmocion;
  public color: Color;

  colorCtr: AbstractControl = new FormControl(null);
  @ViewChild(NgxMatColorPickerInput) pickerInput: NgxMatColorPickerInput;

// _color: Color = new Color();
// private st : string = this._color.hex;
  _appConfig: IAppConfig = AppConfig;
  emoForm: FormGroup;

  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;
 touchUi: boolean=false;


  // @Input('boxTitle') color: string;


  constructor(private route: ActivatedRoute,
    private router: Router,
    protected _sessionHelperService: SessionHelperService,
    protected _tipoEmoxionService: TipoEmocionService,
    protected _usuarioLoginService: usuarioLoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    super(_sessionHelperService, _usuarioLoginService, EnumRecursos.DiaFestivo);

    this._recurso = EnumRecursos.DiaFestivo;
    this._urlRetorno = '/' + AppConfig.routes.TipoEmocion;
    this._tituloBase = 'tipo de emoción';

    this._tipoEmoxionService.inicializar(TipoEmocion, TipoEmocionListarRespuesta, "TipoEmocion");

    this.modelo = new TipoEmocion();
    this.emoForm = this.formBuilder.group({

      idTipoEmocion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.maxLength(500)]],
      rutaImagen: ['',  Validators.compose([
                        Validators.required,
                        Validators.pattern(regExps.rutaImagen)])],
      criticidad: ['', [Validators.required,
                        Validators.min(0),
                        Validators.max(9),
                      ]],
                      colorView: [ '', ([Validators.required])],
      activo: [true, [Validators.required]],
    });
    console.log('🔴🔴',this.emoForm);

  }
  
  
  async ngOnInit() {
    await this.obtenerPermisos();
    this.blockUI.start();

    let id: string;
    this.route.params.forEach((params: Params) => {
      id = params['id'];

    });
    try {
      this.parametro = this.prepararIdNumero(id, this._urlRetorno);
      if (this.parametro != 0) {
        this.modelo = await this._tipoEmoxionService.buscar(this.parametro);
        this.emoForm.patchValue(this.modelo);

        if (this.modelo.activo != null && this.modelo.activo)
          this.emoForm.controls.activo.setValue(true);
        else if (this.modelo.activo != null)
          this.emoForm.controls.activo.setValue(false);

        this.soloLecturaControles();
      }
    }
    catch (e) {
      this.manejoExcepcion(e, this._urlRetorno);
    }
    finally {
      this.blockUI.stop();
    }
  }

  async onSubmit() {
    let resultado: boolean;
    this.marcarControlesParaValidacion(this.emoForm);
    Object.assign(this.modelo, this.emoForm.value);
    if (this.emoForm.valid) {
      try {
        this.blockUI.start();

        this.modelo.activo = this.emoForm.controls.activo.value;

        if (this.parametro == 0) {
          this.modelo = await this._tipoEmoxionService.crear(this.modelo);
        } else {
          resultado = await this._tipoEmoxionService.modificar(this.modelo);
        }
        this.router.navigate([this._urlRetorno]);
      }
      catch (e) {
        this.manejoExcepcion(e);
      }
      finally {
        this.blockUI.stop();
      }
    }
  }

  async onDelete() {

    if (!confirm(Messages.val.Eliminar)) {
      return;
    }
    try {
      this.blockUI.start();

      await this._tipoEmoxionService.eliminar(this.parametro);

      this.router.navigate([this._urlRetorno]);
    }
    catch (e) {
      this.manejoExcepcion(e);
    }
    finally {
      this.blockUI.stop();
    }
  }

  soloLecturaControles() {
    if (this._soloLectura) {
      this.emoForm.controls.nombre.disable();
      this.emoForm.controls.descripcion.disable();
      this.emoForm.controls.activo.disable();
      this.emoForm.controls.idTipoEmocion.disable();
      this.emoForm.controls.rutaImagen.disable();
      this.emoForm.controls.criticidad.disable();
      this.emoForm.controls.colorView.disable();
    }
  }

}

//   public modelo: TipoEmocion;

//   public _dataSiNo: SiNo[];

//   _appConfig: IAppConfig = AppConfig;

//   tipoEmocionForm: FormGroup;
//   errors = errorMessages;

//   @BlockUI() blockUI: NgBlockUI;


//   constructor(private route: ActivatedRoute,
//     private router: Router,
//     protected _sessionHelperService: SessionHelperService,
//     protected _TipoEmocionService: TipoEmocionService,
//     protected _usuarioLoginService: usuarioLoginService,
//     private formBuilder: FormBuilder,
//     public dialog: MatDialog,
//     protected _siNoService: SinoService,
//     public _snackBar: MatSnackBar,


//     ) {
//     super(_sessionHelperService, _usuarioLoginService, EnumRecursos.DiaFestivo);

//     this._recurso = EnumRecursos.DiaFestivo;
//     this._urlRetorno = '/' + AppConfig.routes.TipoEmocion;
//     this._tituloBase = 'Tipo Emocion';


//     this._TipoEmocionService.inicializar(TipoEmocion, TipoEmocionListarRespuesta, "TipoEmocion");

//     this.modelo = new TipoEmocion();

//       this.tipoEmocionForm = this.formBuilder.group({
//         idTipoEmocion: ['',[Validators.required]],
//         nombre: ['',[Validators.required]],
//         rutaImagen: ['',[Validators.required]],
//         criticidad: ['',[Validators.required]],
//         color: ['',[Validators.required]],
//         activo: [true, [Validators.required]],

//       });
//    }






//   async ngOnInit() {
//     await this.obtenerPermisos();
//     this.blockUI.start();


//     let id: string;
//     this.route.params.forEach((params: Params) => {
//       id = params['id'];

//     });

//   try{
//     this.parametro = this.prepararIdNumero(id, this._urlRetorno);
//     if (this.parametro != 0) {
//       this.modelo = await this._TipoEmocionService.buscar(this.parametro);

//       this.tipoEmocionForm.patchValue(this.modelo);

//       if (this.modelo.activo != null && this.modelo.activo)
//         this.tipoEmocionForm.controls.activo.setValue(true);
//       else if (this.modelo.activo != null)
//         this.tipoEmocionForm.controls.activo.setValue(false);

//         this.soloLecturaControles();

//     }
//     this.llenarListas();



//     }
//     catch(e) {
//     this.manejoExcepcion(e, this._urlRetorno);

//     }

//     finally{
//     this.blockUI.stop();

//     }

//   }


//     async onSubmit() {
//       let resultado: boolean;
//       this.marcarControlesParaValidacion(this.tipoEmocionForm)
//       Object.assign(this.modelo, this.tipoEmocionForm.value);

//       if(this.tipoEmocionForm.valid)
//       try{
//         this.blockUI.start();

//       }
//       catch(e){
//         this.manejoExcepcion(e);
//       }
//       finally{
//         this.blockUI.stop();
//       }
//     }


//       async onDelete() {
//         if (!confirm(Messages.val.Eliminar)) {
//             return;
//         }

//         try {
//             this.blockUI.start();

//             await this._TipoEmocionService.eliminar(this.parametro);

//             this.router.navigate([this._urlRetorno]);
//         }
//         catch (e) {
//             this.manejoExcepcion(e);
//         }
//         finally {
//             this.blockUI.stop();
//         }
//       }


//     soloLecturaControles() {
//       if (this._soloLectura) {
//         this.tipoEmocionForm.controls.nombre.disable();
//         this.tipoEmocionForm.controls.idTipoEmocion.disable();
//         this.tipoEmocionForm.controls.descripcion.disable();
//         this.tipoEmocionForm.controls.rutaImagen.disable();
//         this.tipoEmocionForm.controls.criticidad.disable();
//         this.tipoEmocionForm.controls.activo.disable();
//         this.tipoEmocionForm.controls.color.disable();
//     }
//     }

//     async llenarListas() {
//       let data = this.getDefaultParams('nombre');
//       this._dataSiNo = (await this._siNoService.listar(data)).listSiNoRespuesta;

//     }

// }

