import { Component, Inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-avatar-usuario',
    templateUrl: './avatar-usuario.template.html',
    styleUrls: ['./avatar-usuario.component.scss']
})

export class AvatarUsuarioComponent implements OnInit {

    public titulo: string;

    @Input('rutaImagen') rutaImagen?: string;
    @Input('rutaImagenBase64') rutaImagenBase64?: SafeResourceUrl;

    constructor(private domSanitizer: DomSanitizer) {
        this.rutaImagen = "";
        this.titulo = "";
    }

    ngOnInit() {
    }

    asignar(imagen: string) {
        this.rutaImagen = imagen;
    }

}
