import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DocumentService, IDocument } from './document.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  imports: [DatePipe],
})
export class DocumentListComponent implements OnInit {
  documents: IDocument[] = [];
  selection = new SelectionModel<IDocument>(true, []); // múltipla seleção

  constructor(private docService: DocumentService) {
    this.loadDocuments(); // carrega lista na inicialização
  }

  ngOnInit(): void {
    // Exibe no console os documentos adicionados e removidos da seleção
    this.selection.changed.subscribe(change => {
      console.log('Adicionados:', change.added);
      console.log('Removidos:', change.removed);
    });
  }

  /** Carrega dados da API (simulada) */
  loadDocuments(): void {
    this.selection.clear(); // limpa seleção ao carregar nova lista
    this.docService
      .getAllDocuments()
      .subscribe((docs) => (this.documents = docs));
  }

  /** Retorna se todos os documentos estão selecionados */
  isAllSelected(): boolean {
    return this.selection.selected.length === this.documents.length;
  }

  /** Seleciona todos ou limpa seleção */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear(); // limpa todas as seleções
    } else {
      this.documents.forEach((doc) => this.selection.select(doc));
    }
  }

  /** Deleta documentos selecionados e limpa o modelo */
  bulkDelete(): void {
    const idsToDelete = this.selection.selected.map((d) => d.id);
    // TODO: chamar serviço real de delete
    this.documents = this.documents.filter((d) => !idsToDelete.includes(d.id));
    this.selection.clear();
  }
}
