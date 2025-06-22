import { Component } from "@angular/core";
import { DatasheetListComponent } from "./components/datasheet-list/datasheet-list.component";

@Component({
    selector: 'app-datasheet-page',
    standalone: true,
    imports: [DatasheetListComponent],
    templateUrl: './datasheet.page.html'
})
export class DatasheetPageComponent {
    
}
