import { Component, Input, AfterViewInit, OnInit, setTestabilityGetter } from '@angular/core';
import { DynamicPipe } from './dynamic.pipes';

@Component({
  selector: 'app-list',
  templateUrl: './list-full.template.html',
  providers: [DynamicPipe]
})
export class ListComponent implements OnInit {
  public searchText: any;
  public searchField: string = '';
  private lastSortField: any;

  @Input('boxTitle') boxTitle?: string;
  @Input('iconClass') iconClass: string;
  @Input('boxClass') boxClass?: string;
  @Input('modalMode') modalMode: boolean;
  @Input('searchAlways') searchAlways: boolean = true; //Para que refresque siempre que se presiona el ícono de buscar
  @Input('showSearchControl') showSearchControl: boolean = true;  
  @Input('SearchOnInit') SearchOnInit: boolean = true;

  @Input('initSortField') initSortField?: any;
  
  @Input('fields') fields: Array<any>;
  @Input('searchValueInit') searchValueInit: string;
  @Input('searchFieldInit') searchFieldInit?: string;
  @Input('data') data?: Array<any>;
  @Input('paginador') paginador: any;

  @Input('addMethod') addMethod: Function;
  @Input('controlClickMethod') controlClickMethod: Function;

  @Input('editMethod') editMethod: Function;
  @Input('deleteMethod') deleteMethod: Function;
  @Input('queryMethod') queryMethod: Function;
  @Input('viewMethod') viewMethod: Function;
  @Input('exportMethod') exportMethod: Function;
  @Input('externParams') externParams: Function;

  @Input('showAdd') showAdd: boolean = true;

  private defaultTemplates = {
    /*full: './list.component.html',
    column: './column-base.tpl.html',
    columnSort: './column-sort-base.tpl.html',
    cellLink: './cell-link-base.tpl.html',
    cellLinkFormat: './cell-link-format-base.tpl.html',
    cell: './cell-base.tpl.html',
    cellFormat: './cell-format-base.tpl.html'*/
  };

  /*
  name: 'Nombre',
  display: 'Nombre',
  link: true,
  sortType: this.tipoOrden, //Indica la columna de ordenamiento por defecto, y debe ser la misma que this.campoOrden;
  align: 1,
  allowSorting: true,
  formatter: 'yyyy-MM-dd HH:mm:ss',  
  pipe:new DatePipe("es")   
  image: {source:"source",height:'30px'} //Excluyendo con link: true. En la columna (name) se debe indicar si se muestra (1).
  
  */

  constructor() {
    this.searchText = { value: '', last: '' };

    this.fields = [];
    this.iconClass = String.toString();
    this.modalMode = false;
    this.searchValueInit = String.toString();
    this.addMethod = Function;
    this.editMethod = Function;

    this.deleteMethod = Function;
    this.queryMethod = Function;
    this.viewMethod = Function;
    this.exportMethod = Function;
    this.externParams = Function;
  }

  ngOnInit() {
    this.lastSortField = this.initSortField;
    //this.searchField = this.initSortField.campoOrden;

    if (this.searchValueInit)
      this.searchText.value = this.searchValueInit;

    if (this.searchFieldInit)
      this.searchField = this.searchFieldInit;
    else if (this.initSortField)
      this.searchField = this.initSortField.campoOrden

  }

  ngAfterViewInit(): void {
    if (this.SearchOnInit)
    {
      setTimeout(() => { //Dar tiempo al login backgroud, en caso de refrescamiento de página
        this.query();  
      }, 200);      
    }      
  }

  public query() {
    //Filter


    //paginador
    if (!this.paginador) this.paginador = {};
    var paginador = {
      registrosPagina: this.paginador.registrosPagina || 10,
      paginaActual: this.paginador.paginaActual || 1
    };

    var req = {
      Filtros: [],
      Orden: this.lastSortField,
      Paginador: paginador
    };

    //Set last search
    this.searchText.last = this.searchText.value;
    if (this.queryMethod) {
      if (this.searchText.value && this.searchText.value.length > 0) {
        this.queryMethod(req, this.searchText.value, this.searchField);
      } else {
        this.queryMethod(req);
      }
    } else {
      //alert("query method not implemented");
    }
  }

  add() {
    if (this.addMethod) {
      var retParams = {
        Paginador: this.paginador,
        Orden: this.lastSortField,
        searchValue: this.searchText.value
      }

      this.addMethod(retParams);
    } else {
      alert("add method not implemented");
    }
  }

  edit(reg: any) {
    if (this.editMethod) {
      let retParams = {
        Paginador: this.paginador,
        Orden: this.lastSortField,
        searchValue: this.searchText.value
      }

      this.editMethod(reg, retParams);
    } else {
      alert("edit method not implemented");
    }
  }

  //cuando el contenido de la fila es un control
  controlClick(reg: any) {
    if (this.controlClick) {
      let retParams = {
        Paginador: this.paginador,
        Orden: this.lastSortField,
        searchValue: this.searchText.value
      }

      this.controlClickMethod(reg, retParams);
    } else {
      alert("controlClick method not implemented");
    }
  }

  delete(reg: any) {
    if (this.deleteMethod) {
      let retParams = {
        Paginador: this.paginador,
        Orden: this.lastSortField,
        searchValue: this.searchText.value
      }

      this.deleteMethod(reg, retParams);
    } else {
      alert("delete method not implemented");
    }
  }

  view(reg: any) {
    if (this.viewMethod) {
      var retParams = {
        Paginador: this.paginador,
        Orden: this.lastSortField,
        searchValue: this.searchText.value
      }

      this.viewMethod(reg, retParams);
    } else {
      alert("view method not implemented");
    }
  }

  export() {
    if (this.exportMethod) {
      this.exportMethod();
    }
  }

  sort(f: any) {
    if (this.lastSortField.campoOrden.indexOf(f.name) === -1) {
      this.paginador.paginaActual = 1;
    }

    this.fields.forEach((field: any) => {
      if (field === f) {
        var sort = f.sortType || null;
        if (sort === null || sort === 'DESC') {
          field.sortType = 'ASC';
        } else {
          field.sortType = 'DESC';
        }
      } else {
        field.sortType = null;
      }
    });

    this.lastSortField = { campoOrden: f.name, tipoOrden: f.sortType };

    this.query();
  }

  search() {
    if (!this.searchAlways && this.searchText.last === this.searchText.value)
      return;

    this.paginador.paginaActual = 1;

    this.query();
  }

  clearSearch() {
    this.searchText.value = '';

    this.query();
  }

  headTemplate(f: any) {
    /*var allowSorting = f.allowSorting || false;
    if (allowSorting) {
      return this.defaultTemplates.columnSort;
    } else {
      return this.defaultTemplates.column;
    }*/
  }

  cellTemplate(f: any) {
    /*if (f.link) {
      if (f.formatter && f.formatter.length > 0) {
        return this.defaultTemplates.cellLinkFormat;
      } else {
        return this.defaultTemplates.cellLink;
      }
    } else {
      if (f.formatter && f.formatter.length > 0) {
        return this.defaultTemplates.cellFormat;
      } else {
        return this.defaultTemplates.cell;
      }
    }*/
  };

  alignCss(f: any) {
    var align = f.align || 1;
    if (align === 1) {
      return 'text-left';
    } else if (align === 2) {
      return 'text-center';
    } else {
      return 'text-right';
    }
  }

  sortClass(f: any) {
    var sort;
    
    //Por si viene de Edición
    if (f.name == this.lastSortField.campoOrden)
      sort = this.lastSortField.tipoOrden;

    if (sort === 'ASC') {
      //return 'fa fa-sort-alpha-asc fa-fw text-navy';
      //return 'fa fa-long-arrow-up';
      return 'fa fa-sort-asc';
    } else if (sort === 'DESC') {
      //return 'fa fa-sort-alpha-desc fa-fw text-navy';
      //return 'fa fa-long-arrow-down';
      return 'fa fa-sort-desc';
    } else {
      //return 'fa fa-sort';
      //return 'fa fa-exchange fa-rotate-90 fa-fw text-muted';
      return 'fa fa-unsorted';
    }
  };

  pageChanged(page: number) {
    this.paginador.paginaActual = page;
    this.query();
  }

  searchOnKeyPress(keyEvent: KeyboardEvent) {
    if (keyEvent.which === 13) {
      this.search();
    }
  }
}