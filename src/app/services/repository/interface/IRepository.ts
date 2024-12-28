import { UsuarioListarRespuesta } from 'app/models/generalModels/transferObjects/usuarioListarRespuesta.model';
import { Usuario } from 'app/models/generalModels/usuario.model';
import { BaseRespuestaListado } from 'app/models/BaseModels/BaseRespuestaListado';

export interface IRepository<T,T1> {
   
    listar(datos: any): Promise<T1>;

    crear(datos: T): Promise<T>;
    
    modificar(datos: T): Promise<boolean>

    buscar(id: number): Promise<T>

    eliminar(id: number): Promise<boolean>


  }