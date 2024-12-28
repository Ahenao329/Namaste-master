import { Usuario } from '../../models/generalModels/usuario.model';
import { Base } from '../baseClass/Base';
import { SSException } from '../../shared/exceptions/ssexception';
import { IRepository } from './interface/IRepository';
import { Injectable } from "@angular/core";

@Injectable()
export abstract class BaseRepositoryService<T, T1> extends Base implements IRepository<T, T1>  {

  public _creatorT: { new(): T };
  public _creatorT1: { new(): T1 };
  public _nombreController: string;

  public inicializar(tipoT: { new(): T }, tipoT1: { new(): T1 }, nombreController: string) {
    this._creatorT = tipoT;
    this._creatorT1 = tipoT1;
    this._nombreController = nombreController;
  }

  async listar(datos: any): Promise<T1> {
    await this.verificarSesion();

    let retorno: T1 = new this._creatorT1();
    await this._http.post<T1>(this.url.format(this._nombreController, "ListFiltered"), datos, this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);
      })
      .catch(error => {
        this.handleError(error)
      });

    return retorno;
  }


  async crear(datos: T): Promise<T> {
    await this.verificarSesion();

    let retorno: T = new this._creatorT();
    await this._http.post<T>(this.url.format(this._nombreController, ""), datos, this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }

  async modificar(datos: T): Promise<boolean> {
    await this.verificarSesion();

    let retorno: boolean;
    await this._http.put<boolean>(this.url.format(this._nombreController, ""), datos, this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Boolean(res);
      })
      .catch(error => {
        this.handleError(error)
      });
    return retorno;
  }

  async buscar(id: number): Promise<T> {
    await this.verificarSesion();

    let retorno: T = new this._creatorT();
    await this._http.get<Usuario>(this.url.format(this._nombreController, "") + "" + id.toString(), this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Object.assign(retorno, res);

        if (!res)
          this.lanzarExceptionNoExistencia();

      })
      .catch(error => {
        if (error instanceof SSException)
          throw error;
        else
          this.handleError(error)
      });
    return retorno;
  }

  async eliminar(id: number): Promise<boolean> {
    await this.verificarSesion();

    let retorno: boolean = false;
    await this._http.delete<Usuario>(this.url.format(this._nombreController, "") + "" + id.toString(), this.getConfigHeaders())
      .toPromise()
      .then(res => {
        retorno = Boolean(res);
      })
      .catch(error => {
        if (error instanceof SSException)
          throw error;
        else
          this.handleError(error)
      });
    return retorno;
  }


}