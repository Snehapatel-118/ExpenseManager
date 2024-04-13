export class appUrls {
    // masterUrl = "https://localhost:7075/" //https
    static readonly masterUrl = "http://localhost:5052/"; //http
    //  masterUrl = "https://localhost:44337/swagger"; //IIS

    static readonly loadDropdowns = "api/Expense/loadDropdowns"
    static readonly loadExpenses = "api/Expense/loadExpenses"
    static readonly loadExpenseDetailsTypeWise = "api/Expense/loadExpenseDetailsTypeWise"
    static readonly createExpense = "api/Expense/createExpense"
    static readonly getExpenseById = "api/Expense/getExpenseById"
    static readonly editExpense = "api/Expense/editExpense"
}