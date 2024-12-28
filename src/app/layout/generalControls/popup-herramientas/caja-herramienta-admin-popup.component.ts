import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AppConfig } from "app/config/app.config";
import { IAppConfig } from "app/config/iapp.config";
import { BaseEditPage } from "app/layout/generalPages/BasePages/BaseEditPage";
import { CategoriaHerramientaCaja } from "app/models/generalModels/categoriaHerramientaCaja.model";
import { HerramientaCaja } from "app/models/generalModels/herramientaCaja.model";
import { SiNo } from "app/models/generalModels/siNo.model";
import { TipoHerramientaCaja } from "app/models/generalModels/tipoHerramientaCaja.model";
import { CategoriaHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/categoriaHerramientaCajaListarRespuesta.model";
import { HerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/herramientaCajaListarRespuesta";
import { SiNoListarRespuesta } from "app/models/generalModels/transferObjects/siNoListarRespuesta";
import { TipoHerramientaCajaListarRespuesta } from "app/models/generalModels/transferObjects/tipoHerramientaCajaListarRespuesta";
import { CategoriaHerramientaCajaService } from "app/services/generalService/categoriaHerramientaCaja.service";
import { HerramientaCajaService } from "app/services/generalService/herramientaCaja.service";
import { SinoService } from "app/services/generalService/siNo.service";
import { tipoHerramientaCajaService } from "app/services/generalService/tipoHerramientaCaja.service";
import { usuarioLoginService } from "app/services/generalService/usuarioLogin.service";
import { FunctionsHelperService } from "app/services/helpers/functionsHelper.service";
import { SessionHelperService } from "app/services/helpers/sessionHelper.service";
import { EnumParametros, EnumRecursos, EnumTipoHerramientaCaja } from "app/shared/enums/commonEnums";
import { Messages } from "app/shared/Messages/Messages";
import { errorMessages } from "app/Util/Validaciones.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { herramientaParams } from "app/models/generalModels/transferObjects/herramientaParams.model";
import { CajaHerramientaParamService } from "app/services/generalService/caja-herramienta-param.service";


@Component({
  selector: 'app-caja-herramienta-admin-popup',
  templateUrl: './caja-herramienta-admin-popup.component.html',
  styleUrls: ['./caja-herramienta-admin-popup.component.scss']
})
export class CajaHerramientaAdminPopupComponent extends BaseEditPage implements OnInit {
  public datas: herramientaParams;
  public id: number = 0;
  public modelo: HerramientaCaja;
  public modelo2: herramientaParams;
  public tamanoMaximoArchivos: string = '';
  public extensionesArchivosCaja: string = '';
  public _dataSiNo: SiNo[];
  public _dataTipoHerramientaCaja: TipoHerramientaCaja[];
  public _dataCategoriaHerramientaCaja: CategoriaHerramientaCaja[];
  public nombreIcono: string;
  public mostrarRuta: boolean;
  public mostrarAgregarArchivo: boolean;
  public RefrescarPagina:  boolean = false;
  public selected: number ;

  _appConfig: IAppConfig = AppConfig;
  herramientaCajaForm: FormGroup;
  errors = errorMessages;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private _CajaHerramientaParamService:CajaHerramientaParamService,
    public dialogRef: MatDialogRef<CajaHerramientaAdminPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public _CategoriaHerramientaCajaParams: herramientaParams,
      private route: ActivatedRoute,
      private router: Router,
      protected _sessionHelperService: SessionHelperService,
      protected _herramientaCajaService: HerramientaCajaService,
      protected _usuarioLoginService: usuarioLoginService,
      protected _siNoService: SinoService,
      protected _tipoHerramientaCajaService: tipoHerramientaCajaService,
      protected _categoriaHerramientaCajaService: CategoriaHerramientaCajaService,
      protected _functionsHelperService: FunctionsHelperService,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      public _snackBar: MatSnackBar,
  ) {
      super(_sessionHelperService, _usuarioLoginService, EnumRecursos.HerramientaCaja);

      this._recurso = EnumRecursos.HerramientaCaja;
      this._urlRetorno = '/' + AppConfig.routes.CategoriaHerramientaAdminPopupComponent;
      this._tituloBase = 'caja de herramientas popup';

      this._herramientaCajaService.inicializar(HerramientaCaja, HerramientaCajaListarRespuesta, "HerramientaCaja");
      this._siNoService.inicializar(SiNo, SiNoListarRespuesta, 'SiNo');
      this._tipoHerramientaCajaService.inicializar(TipoHerramientaCaja, TipoHerramientaCajaListarRespuesta, 'TipoHerramientaCaja')
      this._categoriaHerramientaCajaService.inicializar(CategoriaHerramientaCaja, CategoriaHerramientaCajaListarRespuesta, 'CategoriaHerramientaCaja')

      this.modelo = new HerramientaCaja();

      this.herramientaCajaForm = this.formBuilder.group({
          idTipoHerramientaCaja: ['', [Validators.required] ],
          idCategoriaHerramientaCaja: ['', [Validators.required]],
          titulo: ['', [Validators.required]],
          descripcion: ['', [Validators.required]],
          ruta: ['', [Validators.required]],
          activo: [true, [Validators.required]],
      });
      console.log('🆗🆗', this.herramientaCajaForm)
  }

  async ngOnInit() {
    this.modelo2 = this._CategoriaHerramientaCajaParams;
    console.log(this.modelo2.idCategoriaHerramientaCaja)
      await this.obtenerPermisos();

      this.blockUI.start();

      let id: string;

      this.tamanoMaximoArchivos = '2'

      this.extensionesArchivosCaja = this._sessionHelperService.getParametroValor(EnumParametros.ExtensionesArchivosCaja)+',rar'

      try {

        this.parametro = this.prepararIdNumero(String(this.modelo2.idTipoHerramientaCaja), this._urlRetorno);

            if (this.parametro != 0) {

              this.modelo = await this._herramientaCajaService.buscar(this.parametro);
              this.herramientaCajaForm.patchValue(this.modelo);
              this.onTipoSeleccionado(this.modelo.idTipoHerramientaCaja);
              if (this.modelo.activo != null && this.modelo.activo)
                  this.herramientaCajaForm.controls.activo.setValue(true);
              else if (this.modelo.activo != null)
                  this.herramientaCajaForm.controls.activo.setValue(false);

              this.soloLecturaControles();

          }
          this.llenarListas();

      }
      catch (e) {
          this.manejoExcepcion(e, this._urlRetorno);
      }
      finally {
          this.blockUI.stop();

      }

  }

  async onSubmit() {

    this.RefrescarPagina = true

      let resultado: boolean;
      this.marcarControlesParaValidacion(this.herramientaCajaForm);

      Object.assign(this.modelo, this.herramientaCajaForm.value);
      if (this.herramientaCajaForm.valid) {

          try {

              this.blockUI.start();
              if (this.modelo.idTipoHerramientaCaja == EnumTipoHerramientaCaja.Link && this.validarEntradas() ||
                  this.modelo.idTipoHerramientaCaja == EnumTipoHerramientaCaja.Documento && this.validarArchivo()) {

                  if (this.parametro == 0) {
                    this.onSubmitClicks(this.RefrescarPagina)
                    this.RefrescarPagina = true
                      this.modelo = await this._herramientaCajaService.crear(this.modelo);

                  } else {
                    this.RefrescarPagina = true
                      resultado = await this._herramientaCajaService.modificar(this.modelo);
                      this.onSubmitClicks(this.RefrescarPagina)

                  }
              }

          }
          catch (e) {
            this.manejoExcepcionLocal(e);
            
        }
          finally {
              this.blockUI.stop();

          }
      }
  }

  async onExportar() {
      try {
          this.blockUI.start();

          let blobResponse: Blob = await this._herramientaCajaService.obtenerArchivo(this.parametro);

          if (blobResponse) {

              var contentType = this._functionsHelperService.getContentTypeArchivo(this.modelo.ruta.split(".")[1]);
              this._functionsHelperService.showFileFromBlob(blobResponse, this.modelo.titulo, contentType);
          }
          else
            //   alert('No fue posible realizar la exportación');
            this.mostrarErrorSnackBar('No fue posible realizar la exportación');

      }
      catch (e) {
          this.manejoExcepcion(e, '/' + AppConfig.routes.HerramientaCajaAdmin + '/' + this.modelo.idHerramientaCaja.toString());
      }
      finally {
          this.blockUI.stop();
      }
  }

  async onDelete() {

      if (!confirm(Messages.val.Eliminar)) {
          return;
      }

      try {
        this.RefrescarPagina = true

          this.blockUI.start();

          await this._herramientaCajaService.eliminar(this.parametro);

      }
      catch (e) {
          this.manejoExcepcionLocal(e);
      }
      finally {

          this.blockUI.stop();
      }
  }
  onTipoSeleccionado(tipo: number) {
      if (tipo == EnumTipoHerramientaCaja.Link) {
          this.mostrarAgregarArchivo = false;
          this.mostrarRuta = true;
           this.herramientaCajaForm.controls.ruta.enable();
      }
      if (tipo == EnumTipoHerramientaCaja.Documento) {
          this.mostrarRuta = false;
          this.herramientaCajaForm.controls.ruta.disable();
          this.mostrarAgregarArchivo = true;


      }
  }

  async llenarListas() {
      this.blockUI.start();
      let data = this.getDefaultParams('nombre');
      this._dataCategoriaHerramientaCaja = (await this._categoriaHerramientaCajaService.listar(data)).listCategoriaHerramientaCajaRespuesta;
      data.Filtros = [];
      this._dataTipoHerramientaCaja = (await this._tipoHerramientaCajaService.listar(data)).listTipoHerramientaCajaRespuesta;

      this._dataSiNo = (await this._siNoService.listar(data)).listSiNoRespuesta;

      const toSelect = this._CategoriaHerramientaCajaParams.idCategoriaHerramientaCaja
      this.herramientaCajaForm.get('idCategoriaHerramientaCaja').setValue(toSelect)
        this.blockUI.stop();
   }

   
  validarEntradas(): boolean {
      let retorno = true;
      if (this.herramientaCajaForm.valid) {
          let ruta: string = this.herramientaCajaForm.controls.ruta.value.trim().toLowerCase();


          if (!this.mostrarAgregarArchivo && !(ruta.startsWith('http://') || ruta.startsWith('https://'))) {
              this.mostrarErrorSnackBar("La ruta debe iniciar con 'http://' o 'https://'");
           retorno = false;

        }
      }
      return retorno;
  }

  validarArchivo() {
      if (this.modelo.archivoBase64) {
          return true;
      }
      this.mostrarErrorSnackBar("No se ha cargado ningún archivo");
      return false;
  }

  estadoDelArchivo() {
      return this.modelo.archivoBase64 ? true : false;
  }

  async compress(event: any) {
      if (event.target.files && event.target.files[0]) {

          let fileName: string = event.target.files[0].name;
          var temp = fileName.split(".");
          let extension: string = temp[temp.length - 1];

          extension = extension.toLowerCase();
          var extensionesArchivosCaja = this.extensionesArchivosCaja.split(",")
          let valido: boolean = false;
          extensionesArchivosCaja.forEach(element => {
              if (extension == element) {
                  valido = true;
              }
          });
          if (!valido) {
              this.mostrarErrorSnackBar('Extensión no permitida. Solo se permite ' + this.extensionesArchivosCaja);
              return;
          }

          let fileBase64;

          let tamanoEnKB: number = Number(2 * 1024);
          if (event.target.files[0].size > 1024 * tamanoEnKB) //el parámetro llega en KB
          {
              let tamanoEnMB: string = Math.round(tamanoEnKB / 1024).toString();
              let tamanoEnMBArchivo: string = (event.target.files[0].size / (1024 * 1024)).toFixed(1);
              this.mostrarErrorSnackBar('El archivo debe pesar ' + tamanoEnMB + ' MB como máximo, y pesa ' + tamanoEnMBArchivo + ' MB.');
              return;
          }

          this.blockUI.start();

          var reader = new FileReader();
          reader.onload = (eventInt: ProgressEvent) => {

              fileBase64 = (<FileReader>eventInt.target).result;

              this.modelo.archivoBase64 = fileBase64;//fileBase64.split(",")[1];

              this.blockUI.stop();
          }

          reader.onerror = error => {
              this.blockUI.stop();
              this.manejoExcepcionLocal(error);
          }

          this.modelo.archivoNombreFrontTemp = event.target.files[0].name;
          this.extensionesArchivosCaja = event.target.files[0].name;
          reader.readAsDataURL(event.target.files[0]);
          this.nombreIcono = "done"

      }
  }

    onCancelClicks(): void {
        this.dialogRef.close(false);
        }

        onDeleteClicks(): void {
            // if( !this.errors){
            if( this.herramientaCajaForm.valid && this.RefrescarPagina){
            this.dialogRef.close(false);
            this.dialogRef.close({ data: this.RefrescarPagina
            })}
        // }
        }

        onSubmitClicks(refresh: boolean): void {
            if( this.herramientaCajaForm.valid && this.herramientaCajaForm.valid){
                if(  this.validarEntradas() || this.estadoDelArchivo()  ){
            if(refresh){
            this.dialogRef.close(false);
            this.dialogRef.close({ data: refresh
            })
         }
       }
     }

    }


   soloLecturaControles() {
    console.log('🔴🔴🔴🔴🔴🔴🔴',this._CategoriaHerramientaCajaParams.idTipoHerramientaCaja)

      if (this._soloLectura) {
          this.herramientaCajaForm.controls.idTipoHerramientaCaja.disable();
          this.herramientaCajaForm.controls.idCategoriaHerramientaCaja.disable();
          this.herramientaCajaForm.controls.titulo.disable();
          this.herramientaCajaForm.controls.descripcion.disable();
          this.herramientaCajaForm.controls.ruta.disable();
          this.herramientaCajaForm.controls.activo.disable();
      }
      if (this.parametro != 0) {
          this.herramientaCajaForm.controls.idTipoHerramientaCaja.disable();
          this.herramientaCajaForm.controls.idCategoriaHerramientaCaja.disable();

      }

  }


}

