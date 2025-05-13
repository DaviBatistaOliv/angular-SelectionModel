Em muitas aplicações, precisamos permitir que o usuário selecione um ou vários itens (linhas, cards, arquivos) para executar ações em lote - como excluir, editar ou exportar alguma coisa. Implementar essa lógica “na mão” pode gerar código verboso e propenso a bugs.

O **`SelectionModel`** do `@angular/cdk/collections` simplifica esse cenário, oferecendo métodos prontos e observáveis para:

- ✅ **Selecionar** e **desselecionar** itens
- 🔄 **Alternar** o estado de seleção (`toggle`)
- ✔️ **Verificar** se um item (ou todos) estão selecionados
- 🗑️ **Limpar** toda a seleção

## 💿 Instalação do CDK

Antes de usar o **`SelectionModel`**, instale o Angular CDK no seu projeto:

Em seguida, importe o módulo necessário (se for usar componentes de tabela, tree ou drag-drop, por exemplo):

```bash
npm install @angular/cdk --save
```

## **🤔 Conceitos Básicos**

```tsx
selection = new SelectionModel<MyItem>(true, []);
```

- **`multiple`** (`boolean`): `true` permite seleção múltipla; `false` apenas uma.
- **`initiallySelected`** (`T[]`): itens que já vêm marcados.

### Principais Membros

| Membro | Descrição |
| --- | --- |
| `select(item...)` | Marca um ou mais itens |
| `deselect(item...)` | Desmarca itens |
| `toggle(item)` | Alterna seleção de um item |
| `clear()` | Remove todas as seleções |
| `selected: T[]` | Array com itens selecionados |
| `hasValue(): boolean` | Retorna `true` se houver pelo menos um item selecionado |
| `isSelected(item)` | `true` se o item está entre os selecionados |

## 🗂️ Exemplo Completo: Gestão de Documentos

A seguir, um fluxo integrado TypeScript + HTML para demonstrar a criação de um componente que usa `SelectionModel`.

**📄 document-list.component.ts**

```tsx
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
```

**📑 document-list.component.html**

```html
<div class="container">
  <div class="toolbar">
    <button class="btn" (click)="loadDocuments()">🔄 Recarregar</button>
    <button
      class="btn"
      (click)="bulkDelete()"
      [disabled]="!selection.hasValue()"
    >
      🗑️ Excluir ({{ selection.selected.length }})
    </button>
  </div>

  <table class="document-table">
    <thead>
      <tr>
        <th>
          <input
            type="checkbox"
            [checked]="isAllSelected()"
            [indeterminate]="selection.hasValue() && !isAllSelected()"
            (change)="masterToggle()"
          />
        </th>
        <th>Nome do Documento</th>
        <th>Data de Upload</th>
        <th>Tamanho</th>
      </tr>
    </thead>
    <tbody>
      @for(doc of documents; track doc.id) {
      <tr>
        <td>
          <input
            type="checkbox"
            [checked]="selection.isSelected(doc)"
            (change)="selection.toggle(doc)"
          />
        </td>
        <td>{{ doc.name }}</td>
        <td>{{ doc.uploadDate | date : "dd/MM/yyyy" }}</td>
        <td>{{ doc.size }} bytes</td>
      </tr>
      }
      <!--  -->
      @empty {
      <tr>
        <td colspan="4" class="no-data">Nenhum documento encontrado.</td>
      </tr>
      }
    </tbody>
  </table>
</div>

```

> Dica: Não se esqueça de usar “`trackBy`” em loops (como `*ngFor` ou `@for`) traz ganhos de **performance** e **estabilidade** à sua aplicação Angular. Veja por quê:
> 
> 
> ```html
> @for(doc of documents; track doc.id) {
> 	<tr>
> 		<td>{{ doc.name }}</td>
> 	</tr>
> }
> ```
> 
- **Minimiza operações no DOM**
    
    Sem `trackBy`, o Angular recria todos os elementos quando o array muda. Com ele, apenas atualiza os itens modificados usando uma **chave única**.
    
- **Evita recriações desnecessárias**
    
    Mantém referências de componentes inalterados, economizando recursos de renderização.
    
- **Melhora a experiência do usuário**
    
    Reduz "piscadas" na interface e oferece melhor performance em listas longas.
    
- **Otimiza dados imutáveis**
    
    Em arquiteturas como NgRx/Redux, atualiza apenas os itens necessários usando `trackBy: item => item.id`.
    

---

## 📣 Eventos e Observabilidade

O `SelectionModel` expõe um **`Observable`** (`changed`) que notifica sempre que itens são adicionados ou removidos da seleção. Se você ainda não está familiarizado com RxJS, veja a documentação oficial.

```tsx
selection.changed.subscribe(change => {
  console.log('Adicionados:', change.added);
  console.log('Removidos:', change.removed);
});
```

Use essa reatividade para:

- Atualizar botões de ação em tempo real
- Exibir contadores de seleção
- Enviar eventos de analytics

## 🔒 Itens Desabilitados

Você pode renderizar checkboxes desabilitados para itens que não devem ser selecionados:

```html
<input
  type="checkbox"
  [checked]="selection.isSelected(doc)"
  [disabled]="doc.locked"
  (change)="selection.toggle(doc)"
/>
```

Isso comunica ao usuário quais opções estão indisponíveis.

## 🏁 Conclusão

O **`SelectionModel`** do Angular CDK oferece:

1. **API enxuta** para seleção de itens
2. **Observabilidade** via `changed` para reatividade
3. **Flexibilidade** para cenários como tabelas, tree's e formulários dinâmicos

Experimente essas práticas no seu próximo projeto e comente abaixo como o `SelectionModel` facilitou sua vida de desenvolvedor! 🚀
