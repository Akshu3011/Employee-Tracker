const inquirer= require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');


const dept_data=["Engineering",
"Finance",
"Legal",
"Sales"];
// create the connection, specify bluebird as Promise
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );
  

db.connect(function(err){
    if(err) throw err;
    console.log("DB Connected");

    start();
})

function start(){
    inquirer.prompt(
    
      
        {
            type: 'list',
            name:'actions',
            message:"What would you like to do?",
            choices: ['View all Employees','Add Employee','Update Employee Role','View All Roles','Add Role','View All Departments','Add Department', 'Quit'],
           
        }
       
    
).then(opt =>{

    switch(opt.actions)
    {
        case "View all Employees":
            viewAllEmp();
            break;
        case "Add Employee":
            addEmp();
            break;
        case "Update Employee Role":
            updateEmp();
            break;
        case "View All Roles":
            viewAllRoles();
            break;
        case "Add Role":
            addRole();
            break;
        case "View All Departments":
            viewAllDept();
            break;
        case "Add Department":
            addDept();
            break;
        case "Quit":
            break;
        default:
            break;
    }

});
}


function viewAllDept()
{
    db.query("Select id AS ID, name AS Deparments from department", (err,res)=> {
        if(err) throw err;
        console.table(res);
        start();        
        })
}
function viewAllEmp()
{
    db.query("Select e.id as ID, e.first_name as First, e.last_name as Last, r.title As Role, r.salary as Salary, m.last_name as Manager, d.name as Deparment from employee e left join employee m  ON e.manager_id=m.id Left join roles r ON e.role_id=r.id Left join department d ON r.department_id = d.id", (err,res)=> {
        if(err) throw err;
        console.table(res);
        start();        
        })
}

function viewAllRoles()
{
    db.query("Select r.id as ID, r.title AS Role, d.name AS Department, r.salary AS Salary from roles r left join department  d ON r.department_id = d.id", (err,res)=> {
        if(err) throw err;
        console.table(res);
        start();        
        })
}

function addDept()
{
    inquirer.prompt(
        {
            type: 'input',
            name:'department',
            message:"What is the name of department?",
           
        }
       
    
).then(ans =>{
    db.query("Insert into department Values (Default,?)", ans.department, (err)=>{
        if(err) throw err;
        console.log("Department updated with "+ ans.department);
        dept_data.push(ans.department);
        start();
    })
}

)
}

function addRole()
{
    inquirer.prompt(
       [ {
            type: 'input',
            name:'role',
            message:"What is the name of role?",
        },
        {
            type: 'input',
            name:'salary',
            message:"What is the salary of role?",
        },
        {
            type: 'input',
            name:'dept',
            message:"Which department does the role belong to? Please select the id starting from 1 for the respective departments:  "+dept_data,
            Validate: (value)=>{
                (!isNaN(value))? true : false;
            }
        },
    ]
).then(ans =>{
    
    db.query("Insert into roles SET ?",{
        title:ans.role,
        salary:ans.salary,
        department_id: ans.dept
    }, (err)=>{
        if(err) throw err;
        console.log("Employee Roles updated with "+ ans.role);
        start();
    })
}

)
}