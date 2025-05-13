// document.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IDocument {
  id: string;
  name: string;
  size: number;       // in bytes
  uploadDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService  {
  // Mock data
  private mockDocuments: IDocument[] = [
    { id: '1', name: 'Relatório Financeiro.pdf', size: 120_000, uploadDate: new Date('2025-04-01') },
    { id: '2', name: 'Apresentação Vendas.pptx', size: 980_000, uploadDate: new Date('2025-04-05') },
    { id: '3', name: 'Contrato_Assinatura.docx', size: 45_000, uploadDate: new Date('2025-04-10') },
    { id: '4', name: 'Manual_Usuário.pdf', size: 250_000, uploadDate: new Date('2025-04-12') },
    { id: '5', name: 'Imagem_Capa.png', size: 75_000, uploadDate: new Date('2025-04-15') },
  ];

  /**
   * Simulates an HTTP GET to fetch all documents.
   * Returns the list with a 700ms artificial delay.
   */
  getAllDocuments(): Observable<IDocument[]> {
    return of(this.mockDocuments).pipe(
      delay(700)
    );
  }

  /**
   * Simulates fetching a single document by ID.
   * If not found, returns null after delay.
   */
  getDocumentById(id: string): Observable<IDocument | null> {
    const doc = this.mockDocuments.find(d => d.id === id) ?? null;
    return of(doc).pipe(
      delay(500)
    );
  }
}
