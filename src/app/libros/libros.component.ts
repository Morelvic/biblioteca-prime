import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { Messages } from 'primeng/messages';
import { Libro } from '../interfaces/libro.interface';
import { FormularioLibroComponent } from '../formulario-libro/formulario-libro.component';
import { LibrosService } from '../servicios/libros.service';
@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit {
  @ViewChild('formulario') formLibro!:FormularioLibroComponent;
  listaLibros: Libro[] = [];//aqui se guarda la lista de libros

cargando: boolean=  false;// Esta variable mustra la animacion de carga

dialogoVisible:boolean= false;// indica que el dialogo este visible

mensajes: Message[]=[];
tituloDialogo: string = 'Registrar libro';
  constructor(private servicioLibros: LibrosService, private servicioConfirm:ConfirmationService) { }

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.servicioLibros.get().subscribe({
      next: (datos) => {
        
        this.listaLibros = datos;
        this.cargando= false;
      },
      error: (e) => {
        console.log(e);
        this.cargando= false;
        this.mensajes =[{severity:'error', summary:'Error al cargar libros',detail:e.message}]
      }
    });
  }
  
  nuevo(){
    this.tituloDialogo ='Registrar libro';
    this.formLibro.limpiarFormulario();
    this.formLibro.cargarAutores();
    this.formLibro.modo ='Registrar';
    this.dialogoVisible= true;
  }
  editar(libro:Libro){
    console.log(libro);
    this.formLibro.codigo= libro.idlibro;
    this.formLibro.titulo= libro.titulo;
    this.formLibro.idautor = libro.idautor;
    this.formLibro.cargarAutores();
    this.formLibro.paginas= libro.paginas;
    this.formLibro.modo ='Editar';
    this.dialogoVisible = true;
    this.tituloDialogo = "Editar libro";
  }
  eliminar(libro:Libro){
    this.servicioConfirm.confirm({
      message:"¿Realmente desea eliminar el libro:'"+libro.idlibro+"-"+libro.titulo+"-"+libro.autor+"'?'?",
      acceptLabel:'Eliminar',
      rejectLabel:'Canselar',
      acceptButtonStyleClass:'p-button-danger',
      acceptIcon:'pi pi-trash',
      accept:()=>{
        this.servicioLibros.delete(libro).subscribe({
          next:()=>{
            this.mensajes=[{severity:'success', summary:'Exito',detail:'Se elimino correctamente el libro'}],
            this.cargarLibros();
          },
          error:(e) =>{
            console.log(e);
            this.mensajes=[{severity:'error',summary:'Error al eliminar',detail:e.error}];
          }
        });
      }
    });
  }
}
