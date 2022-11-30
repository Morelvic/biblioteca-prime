import { Component, EventEmitter, OnInit, Output, TRANSLATIONS } from '@angular/core';
import { Message } from 'primeng/api';
import { Autor } from 'src/app/interfaces/autor.interface';
import { Libro } from 'src/app/interfaces/libro.interface';
import { AutoresService } from 'src/app/servicios/autores.service';

import { LibrosService } from 'src/app/servicios/libros.service';

@Component({
  selector: 'app-formulario-libro',
  templateUrl: './formulario-libro.component.html',
  styleUrls: ['./formulario-libro.component.css']
})
export class FormularioLibroComponent implements OnInit {
  
  codigo: number | null = null;
  titulo: string | null = null;
  idautor: number | null = null;
  paginas:  number | null = null;

  codigoValido: boolean = true;
  tituloValido: boolean = true;
  autorValido: boolean = true;
  paginasValido: boolean = true;

  guardando: boolean = false;
  mensajes: Message[] = [];

  modo:'Registrar' | 'Editar' = 'Registrar';

  listaAutores: Autor[] = [];
  
  @Output()
  recargarLibros: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private servicioLibros: LibrosService,
    private servicioAutores: AutoresService
    ) {}

  ngOnInit(): void {
    this.cargarAutores();
  }

  cargarAutores(){
    this.servicioAutores.get().subscribe({
      next: (autores) => {
        this.listaAutores = autores;
      },
      error: (e) => {
        console.log('Error al cargar autores');
        console.log(e);
        this.mensajes = [{severity: 'error', summary: 'Error al cargar autores', detail: e.error}];
      }
    });
  }
    guardar(){
      if(this.validar()){
        //construimos el objeto libro para enviar al servidor
        const libro: Libro = {
          id: this.codigo,
          titulo: this.titulo,
          idautor: this.idautor,
          autor: null,

          paginas: this.paginas
        }
        if(this.modo === 'Registrar'){
          this.registrar(libro);
        }else{
          this.editar(libro);
        }
      }
    }

    private registrar(libro : Libro){
      this.guardando = true;
        //enviamos el objeto al servidor mediante el metodo POST del servicio
        this.servicioLibros.post(libro).subscribe({
          next: () =>{
              this.guardando = false;
              this.mensajes=[{severity: 'success', summary: 'Exito', detail: 'Se registro el libro'}];
              this.recargarLibros.emit(true);
          },
          error: (e) =>{
              this.guardando = false;
              console.log(e);
              this.mensajes=[{severity: 'error', summary: 'Error al registrar', detail: e.error}];
          }
        });
    }
    private editar(libro : Libro){
      this.guardando = true;
      this.servicioLibros.put(libro).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajes = [{severity: 'success', summary: 'Exito', detail: 'Se edito el libro'}];
          this.recargarLibros.emit(true);
        },
        error: (e) => {
          this.guardando = false;
          console.log(e);
          this.mensajes = [{severity: 'error', summary: 'Error al editar', detail: e.error}];
        }
      });
    }
    validar(): boolean{
    this.codigoValido = this.codigo !== null
    this.tituloValido = this.titulo !== null && this.titulo?.length > 0;
    this.autorValido = this.idautor  !== null;
    this.paginasValido = this.paginas !== null;
    return this.codigoValido && this.tituloValido && this.autorValido && this.paginasValido;
    }
    
    limpiarFormulario(){
      this.codigo = null;
      this.titulo = null;
      this.idautor = null;
      this.paginas = null;

      this.codigoValido = true;
      this.tituloValido = true;
      this.autorValido = true;
      this.paginasValido = true;

      this.mensajes = [];
    }
}
