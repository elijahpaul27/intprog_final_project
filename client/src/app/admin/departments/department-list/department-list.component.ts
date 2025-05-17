import { Component } from '@angular/core';

@Component({
    selector: 'app-department-list',
    template: `
        <div class="container">
            <h2>Departments Management</h2>
            <p>This is the departments management page.</p>
        </div>
    `,
    styles: [`
        .container {
            padding: 20px;
        }
        h2 {
            margin-bottom: 20px;
            color: #333;
        }
        p {
            color: #666;
        }
    `]
})
export class DepartmentListComponent {
    constructor() { }
} 