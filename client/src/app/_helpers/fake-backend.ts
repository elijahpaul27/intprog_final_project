import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

// array in local storage for accounts
const accountsKey = 'angular-10-signup-verification-boilerplate-accounts';
let accounts = JSON.parse(localStorage.getItem(accountsKey)) || [];

// arrays in local storage for other entities
const departmentsKey = 'departments';
let departments = JSON.parse(localStorage.getItem(departmentsKey)) || [];

const employeesKey = 'employees';
let employees = JSON.parse(localStorage.getItem(employeesKey)) || [];

const workflowsKey = 'workflows';
let workflows = JSON.parse(localStorage.getItem(workflowsKey)) || [];

const requestsKey = 'requests';
let requests = JSON.parse(localStorage.getItem(requestsKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const alertService = this.alertService;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                // Account routes
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();

                // Department routes
                case url.endsWith('/departments') && method === 'GET':
                    return getDepartments();
                case url.match(/\/departments\/\d+$/) && method === 'GET':
                    return getDepartmentById();
                case url.endsWith('/departments') && method === 'POST':
                    return createDepartment();
                case url.match(/\/departments\/\d+$/) && method === 'PUT':
                    return updateDepartment();
                case url.match(/\/departments\/\d+$/) && method === 'DELETE':
                    return deleteDepartment();

                // Employee routes
                case url.endsWith('/employees') && method === 'GET':
                    return getEmployees();
                case url.match(/\/employees\/\d+$/) && method === 'GET':
                    return getEmployeeById();
                case url.endsWith('/employees') && method === 'POST':
                    return createEmployee();
                case url.match(/\/employees\/\d+$/) && method === 'PUT':
                    return updateEmployee();
                case url.match(/\/employees\/\d+$/) && method === 'DELETE':
                    return deleteEmployee();
                case url.match(/\/employees\/department\/\d+$/) && method === 'GET':
                    return getEmployeesByDepartment();

                // Workflow routes
                case url.endsWith('/workflows') && method === 'GET':
                    return getWorkflows();
                case url.match(/\/workflows\/\d+$/) && method === 'GET':
                    return getWorkflowById();
                case url.endsWith('/workflows') && method === 'POST':
                    return createWorkflow();
                case url.match(/\/workflows\/\d+$/) && method === 'PUT':
                    return updateWorkflow();
                case url.match(/\/workflows\/\d+$/) && method === 'DELETE':
                    return deleteWorkflow();
                case url.match(/\/workflows\/department\/\d+$/) && method === 'GET':
                    return getWorkflowsByDepartment();

                // Request routes
                case url.endsWith('/requests') && method === 'GET':
                    return getRequests();
                case url.match(/\/requests\/\d+$/) && method === 'GET':
                    return getRequestById();
                case url.endsWith('/requests') && method === 'POST':
                    return createRequest();
                case url.match(/\/requests\/\d+$/) && method === 'PUT':
                    return updateRequest();
                case url.match(/\/requests\/\d+$/) && method === 'DELETE':
                    return deleteRequest();
                case url.match(/\/requests\/employee\/\d+$/) && method === 'GET':
                    return getRequestsByEmployee();
                case url.match(/\/requests\/status\/\w+$/) && method === 'GET':
                    return getRequestsByStatus();
                case url.match(/\/requests\/\d+\/approve$/) && method === 'PUT':
                    return approveRequest();
                case url.match(/\/requests\/\d+\/reject$/) && method === 'PUT':
                    return rejectRequest();

                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }
        
        // route functions

        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email && x.password === password && x.isVerified);

            if (!account) return error('Email or password is incorrect');

            // add refresh token to account
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function refreshToken() {
            const refreshToken = getRefreshToken();
        
            if (!refreshToken) return unauthorized();
        
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
        
            if (!account) return unauthorized();
        
            // replace old refresh token with a new one and save
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }
        
        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();
        
            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
        
            // revoke token and save
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok();
        }
        
        function register() {
            const account = body;
        
            if (accounts.find(x => x.email === account.email)) {
                // display email already registered "email" in alert
                setTimeout(() => {
                    alertService.info(`
                        <h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an API. A real backend would send a real email.</div>
                    `, { autoClose: false });
                }, 1000);
        
                // always return ok() response to prevent email enumeration
                return ok();
            }
        
            // assign account ID and a few other properties then save
            account.id = newAccountId();
            if (account.id === 1) {
                // first registered account is an admin
                account.role = Role.Admin;
            } else {
                account.role = Role.User;
            }
        
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            setTimeout(() => {
                const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                alertService.info(
                    `<h4>Verification Email</h4>
                    <p>Thanks for registering!</p>
                    <p>Please click the below link to verify your email address:</p>
                    <p><a href=\"${verifyUrl}\">${verifyUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an API. A real backend would send a real email.</div>`,
                    { autoClose: false }
                );
            }, 1000);
            
            return ok();
        }
            
        function verifyEmail() {
            const { token } = body;
            const account = accounts.find(x => !x.verificationToken && x.verificationToken === token);
        
            if (!account) return error('Verification failed');
        
            // set isVerified flag to true if token is valid
            account.isVerified = true;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok();
        }
        
        function forgotPassword() {
            const { email } = body;
            const account = accounts.find(x => x.email === email);
        
            // always return ok() response to prevent email enumeration
            if (!account) return ok();
        
            // create reset token that expires after 24 hours
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // display password reset email in alert
            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                alertService.info(`
                    <h4>Reset Password Email</h4>
                    <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                    <p><a href=\"${resetUrl}\">${resetUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an API. A real backend would send a real email.</div>
                `, { autoClose: false });
            }, 1000);
        
            return ok();
        }
        
        function validateResetToken() {
            const { token } = body;
            const account = accounts.find(x =>
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
        
            if (!account) return error('Invalid token');
        
            return ok();
        }

        function resetPassword() {
            const { token, password } = body;
            const account = accounts.find(x =>
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
        
            if (!account) return error('Invalid token');
        
            // update password and remove reset token
            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok();
        }
        
        function getAccounts() {
            if (!isAuthenticated()) return unauthorized();
            return ok(accounts.map(x => basicDetails(x)));
        }
        
        function getAccountById() {
            if (!isAuthenticated()) return unauthorized();
        
            let account = accounts.find(x => x.id === idFromUrl(url));
        
            // allow admins to get any account, but only allow users to get their own
            if (account.id !== currentAccount().id && currentAccount().role !== Role.Admin) {
                return unauthorized();
            }
        
            return ok(basicDetails(account));
        }
        
        function createAccount() {
            if (!isAuthorized(Role.Admin)) return unauthorized();
        
            const account = body;
            if (accounts.find(x => x.email === account.email)) {
                return error(`Email ${account.email} is already registered`);
            }
        
            // assign account ID and a few other properties then save
            account.id = newAccountId();
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok();
        }
        
        function updateAccount() {
            if (!isAuthenticated()) return unauthorized();
        
            let params = body;
            let account = accounts.find(x => x.id === idFromUrl(url));
        
            // user accounts can update own profile and admin accounts can update all profiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
        
            // only update password if included
            if (!params.password) {
                delete params.password;
            }
        
            // don't save confirm password
            delete params.confirmPassword;
        
            // update and save account
            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok(basicDetails(account));
        }
        
        function deleteAccount() {
            if (!isAuthenticated()) return unauthorized();
        
            let account = accounts.find(x => x.id === idFromUrl(url));
        
            // user accounts can delete own account and admin accounts can delete any account
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
        
            // delete account then save
            accounts = accounts.filter(x => x.id !== idFromUrl(url));
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }
        
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }
        
        function error(message) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize());
                // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }
        
        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }
        
        function basicDetails(account) {
            const { id, title, firstName, lastName, email, role, dateCreated, isVerified } = account;
            return { id, title, firstName, lastName, email, role, dateCreated, isVerified };
        }
        
        function isAuthenticated() {
            return !!currentAccount();
        }
        
        function isAuthorized(role) {
            const account = currentAccount();
            if (!account) return false;
            return account.role === role;
        }
        
        function idFromUrl(url) {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
        
        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
        }
        
        function currentAccount() {
            // check if jwt token is in auth header
            const authHeader = headers.get('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer fake-jwt-token')) return;
        
            // check if token is expired
            const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
            const tokenExpired = Date.now() > (jwtToken.exp * 1000);
            if (tokenExpired) return;
        
            const account = accounts.find(x => x.id === jwtToken.id);
            return account;
        }
        
        function generateJwtToken(account) {
            // create token that expires in 15 minutes
            const tokenPayload = {
                exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
                id: account.id
            }
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }
        
        function generateRefreshToken() {
            const token = new Date().getTime().toString();
        
            // add token cookie that expires in 7 days
            const expires = new Date(Date.now() + 7*24*60*60*1000).toUTCString();
            document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;
        
            return token;
        }
        
        function getRefreshToken() {
            // get refresh token from cookie
            return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
        }

        // Department route functions
        function getDepartments() {
            return ok(departments);
        }

        function getDepartmentById() {
            const department = departments.find(x => x.id === idFromUrl(url));
            return ok(department);
        }

        function createDepartment() {
            const department = body;
            department.id = departments.length ? Math.max(...departments.map(x => x.id)) + 1 : 1;
            department.createdAt = new Date().toISOString();
            department.updatedAt = new Date().toISOString();
            departments.push(department);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            return ok(department);
        }

        function updateDepartment() {
            const department = body;
            const index = departments.findIndex(x => x.id === idFromUrl(url));
            if (index === -1) return error('Department not found');
            department.updatedAt = new Date().toISOString();
            departments[index] = { ...departments[index], ...department };
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            return ok(departments[index]);
        }

        function deleteDepartment() {
            const id = idFromUrl(url);
            departments = departments.filter(x => x.id !== id);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            return ok();
        }

        // Employee route functions
        function getEmployees() {
            return ok(employees);
        }

        function getEmployeeById() {
            const employee = employees.find(x => x.id === idFromUrl(url));
            return ok(employee);
        }

        function createEmployee() {
            const employee = body;
            employee.id = employees.length ? Math.max(...employees.map(x => x.id)) + 1 : 1;
            employee.createdAt = new Date().toISOString();
            employee.updatedAt = new Date().toISOString();
            employees.push(employee);
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            return ok(employee);
        }

        function updateEmployee() {
            const employee = body;
            const index = employees.findIndex(x => x.id === idFromUrl(url));
            if (index === -1) return error('Employee not found');
            employee.updatedAt = new Date().toISOString();
            employees[index] = { ...employees[index], ...employee };
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            return ok(employees[index]);
        }

        function deleteEmployee() {
            const id = idFromUrl(url);
            employees = employees.filter(x => x.id !== id);
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            return ok();
        }

        function getEmployeesByDepartment() {
            const departmentId = idFromUrl(url);
            const departmentEmployees = employees.filter(x => x.departmentId === departmentId);
            return ok(departmentEmployees);
        }

        // Workflow route functions
        function getWorkflows() {
            return ok(workflows);
        }

        function getWorkflowById() {
            const workflow = workflows.find(x => x.id === idFromUrl(url));
            return ok(workflow);
        }

        function createWorkflow() {
            const workflow = body;
            workflow.id = workflows.length ? Math.max(...workflows.map(x => x.id)) + 1 : 1;
            workflow.createdAt = new Date().toISOString();
            workflow.updatedAt = new Date().toISOString();
            workflows.push(workflow);
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            return ok(workflow);
        }

        function updateWorkflow() {
            const workflow = body;
            const index = workflows.findIndex(x => x.id === idFromUrl(url));
            if (index === -1) return error('Workflow not found');
            workflow.updatedAt = new Date().toISOString();
            workflows[index] = { ...workflows[index], ...workflow };
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            return ok(workflows[index]);
        }

        function deleteWorkflow() {
            const id = idFromUrl(url);
            workflows = workflows.filter(x => x.id !== id);
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            return ok();
        }

        function getWorkflowsByDepartment() {
            const departmentId = idFromUrl(url);
            const departmentWorkflows = workflows.filter(x => x.departmentId === departmentId);
            return ok(departmentWorkflows);
        }

        // Request route functions
        function getRequests() {
            return ok(requests);
        }

        function getRequestById() {
            const request = requests.find(x => x.id === idFromUrl(url));
            return ok(request);
        }

        function createRequest() {
            const request = body;
            request.id = requests.length ? Math.max(...requests.map(x => x.id)) + 1 : 1;
            request.createdAt = new Date().toISOString();
            request.updatedAt = new Date().toISOString();
            requests.push(request);
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(request);
        }

        function updateRequest() {
            const request = body;
            const index = requests.findIndex(x => x.id === idFromUrl(url));
            if (index === -1) return error('Request not found');
            request.updatedAt = new Date().toISOString();
            requests[index] = { ...requests[index], ...request };
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(requests[index]);
        }

        function deleteRequest() {
            const id = idFromUrl(url);
            requests = requests.filter(x => x.id !== id);
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok();
        }

        function getRequestsByEmployee() {
            const employeeId = idFromUrl(url);
            const employeeRequests = requests.filter(x => x.employeeId === employeeId);
            return ok(employeeRequests);
        }

        function getRequestsByStatus() {
            const status = url.split('/').pop();
            const statusRequests = requests.filter(x => x.status === status);
            return ok(statusRequests);
        }

        function approveRequest() {
            const id = idFromUrl(url);
            const index = requests.findIndex(x => x.id === id);
            if (index === -1) return error('Request not found');
            requests[index].status = 'APPROVED';
            requests[index].updatedAt = new Date().toISOString();
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(requests[index]);
        }

        function rejectRequest() {
            const id = idFromUrl(url);
            const index = requests.findIndex(x => x.id === id);
            if (index === -1) return error('Request not found');
            requests[index].status = 'REJECTED';
            requests[index].updatedAt = new Date().toISOString();
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(requests[index]);
        }
    }
}
            
export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
            
// Initialize test data
function initializeTestData() {
    // Test accounts
    if (!localStorage.getItem(accountsKey)) {
        const testAccounts = [
            {
                id: 1,
                email: 'jollyally28@gmail.com',
                password: 'Admin123!',
                role: Role.Admin,
                isVerified: true,
                dateCreated: new Date().toISOString(),
                refreshTokens: []
            }
        ];
        localStorage.setItem(accountsKey, JSON.stringify(testAccounts));
    }

    // Test departments
    if (!localStorage.getItem(departmentsKey)) {
        const testDepartments = [
            {
                id: 1,
                name: 'Human Resources',
                description: 'Manages employee relations, recruitment, and benefits',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Information Technology',
                description: 'Handles software development, infrastructure, and support',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Finance',
                description: 'Manages financial operations and accounting',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(departmentsKey, JSON.stringify(testDepartments));
    }

    // Test employees
    if (!localStorage.getItem(employeesKey)) {
        const testEmployees = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@company.com',
                departmentId: 1,
                position: 'HR Manager',
                hireDate: new Date('2020-01-15').toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@company.com',
                departmentId: 2,
                position: 'Senior Developer',
                hireDate: new Date('2019-06-01').toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike.johnson@company.com',
                departmentId: 3,
                position: 'Financial Analyst',
                hireDate: new Date('2021-03-10').toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(employeesKey, JSON.stringify(testEmployees));
    }

    // Test workflows
    if (!localStorage.getItem(workflowsKey)) {
        const testWorkflows = [
            {
                id: 1,
                name: 'Leave Request',
                description: 'Process for requesting time off',
                departmentId: 1,
                steps: [
                    {
                        id: 1,
                        name: 'Submit Request',
                        order: 1,
                        approverRole: 'Employee',
                        isActive: true
                    },
                    {
                        id: 2,
                        name: 'Manager Approval',
                        order: 2,
                        approverRole: 'Manager',
                        isActive: true
                    },
                    {
                        id: 3,
                        name: 'HR Review',
                        order: 3,
                        approverRole: 'HR',
                        isActive: true
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Expense Reimbursement',
                description: 'Process for claiming business expenses',
                departmentId: 3,
                steps: [
                    {
                        id: 1,
                        name: 'Submit Receipts',
                        order: 1,
                        approverRole: 'Employee',
                        isActive: true
                    },
                    {
                        id: 2,
                        name: 'Manager Approval',
                        order: 2,
                        approverRole: 'Manager',
                        isActive: true
                    },
                    {
                        id: 3,
                        name: 'Finance Review',
                        order: 3,
                        approverRole: 'Finance',
                        isActive: true
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(workflowsKey, JSON.stringify(testWorkflows));
    }

    // Test requests
    if (!localStorage.getItem(requestsKey)) {
        const testRequests = [
            {
                id: 1,
                employeeId: 1,
                workflowId: 1,
                status: 'PENDING',
                currentStep: 2,
                data: 'Requesting 3 days of annual leave from 2024-03-15 to 2024-03-17',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                employeeId: 2,
                workflowId: 2,
                status: 'APPROVED',
                currentStep: 3,
                data: 'Expense claim for business trip: $500 for accommodation and $200 for meals',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                employeeId: 3,
                workflowId: 1,
                status: 'REJECTED',
                currentStep: 2,
                data: 'Requesting 5 days of sick leave from 2024-03-10',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(requestsKey, JSON.stringify(testRequests));
    }
}

// Call initializeTestData when the application starts
initializeTestData();
            
