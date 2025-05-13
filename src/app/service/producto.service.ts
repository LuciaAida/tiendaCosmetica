import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, getDownloadURL, uploadBytes } from '@angular/fire/storage';
import { collection } from 'firebase/firestore';
import { productoModelo } from '../components/main/producto/modelo/producto.modelo';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

subirProductoCompleto(productoData: any, archivo: File): Promise<void> {
    const filePath = `productos/${Date.now()}_${archivo.name}`;
    const fileRef = ref(this.storage, filePath);// subir imagen a Storage

    return uploadBytes(fileRef, archivo)
      .then(() => {
      // cuando se sube la imagen, obtener su URL
        return getDownloadURL(fileRef);
      })
      .then(urlImagen => {
        if (!urlImagen) throw new Error('No se pudo obtener la URL de la imagen');
        // combinar todos los datos del producto + URL de la imagen
        const productoCompleto = {
          ...productoData,
          urlImagen: urlImagen
        };
        return this.guardarProducto(productoCompleto);
        // guardar el objeto completo en Firestore
        
      }).catch(error => {
        console.error('Error en el servicio:', error);
        throw error; // Propagar el error al componente
      });
  }
  
   async obtenerIds(): Promise<string[]> {
    const productos$ = this.getProductos(); // Observable<productoModelo[]>
    const productos = await lastValueFrom(productos$); // espera al último valor :contentReference[oaicite:3]{index=3}
    return productos.map(p => p.id!);          // mapea solo los IDs :contentReference[oaicite:4]{index=4}
  }

  getProductos(): Observable<productoModelo[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<productoModelo[]>;
  }

  guardarProducto(producto: any): Promise<void> {
    const productosRef = collection(this.firestore, 'productos');
    
    return addDoc(productosRef, producto) // <- Retornar la promesa directamente
    .then(() => {})
    .catch(error => { throw error; });
  }

  eliminarProducto(id: string) {
    return deleteDoc(doc(this.firestore, 'productos', id));
  }

  actualizarProducto(id: string, productoActualizado: productoModelo) {
    const productoRef = doc(this.firestore, `productos/${id}`);
    return updateDoc(productoRef, { ...productoActualizado });
  }

  obtenerProductoPorId(id: string): Observable<productoModelo | undefined> {
    const productoDoc = doc(this.firestore, `productos/${id}`);
    return docData(productoDoc, { idField: 'id' }) as Observable<productoModelo | undefined>;
  }
  
}