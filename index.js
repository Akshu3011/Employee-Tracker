const inquirer= require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');


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
    db.query("Select * from department", (err,res)=> {
        if(err) throw err;
        console.table(res);
        start();        
        })
}
function viewAllEmp()
{
    db.query("Select * from employee", (err,res)=> {
        if(err) throw err;
        console.table(res);
        start();        
        })
}

