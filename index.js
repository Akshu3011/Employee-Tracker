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
        db.query("select * from department", (err,res)=>{
            if(err) throw err;
           
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
                        type: 'list',
                        name:'dept',
                        
                        choices: ()=>{
                            var choiceArr=[];
                            for(let i=0;i<res.length;i++)
                            {
                                choiceArr.push(res[i].id+" "+res[i].name)
                            }
                            return choiceArr;
                        },
                        message:"Which department does the role belong to?",
                    },
                ]
            ).then(ans =>{
                const dept_id= ans.dept.split(" ");
                db.query("Insert into roles SET ?",{
                    title:ans.role,
                    salary:ans.salary,
                    department_id: dept_id[0]
                }, (err)=>{
                    if(err) throw err;
                    console.log("Employee Roles updated with "+ ans.role);
                    start();
                })
            }
        
            )
        
            
        })
    }

    function addEmp()
    {
        db.query("Select * from Employee e left join roles r On e.role_id=r.id",(err,res)=>{
            if(err) throw err
            inquirer.prompt(
                [
                    {
                        type: 'input',
                        name:'fname',
                        message:"What is the first name of employee?",
                    },
                    {
                        type: 'input',
                        name:'lname',
                        message:"What is the last name of employee?",
                    },
                    {
                        type: 'list',
                        name:'role',
                        message:"What is Employees role?",
                        choices:()=>{
                            var choiceArr=[];
                            for(let i=0;i<res.length;i++)
                            {
                                choiceArr.push(res[i].id+" "+res[i].title)
                            }
                            return choiceArr;
                        },
                    },
                    {
                        type: 'list',
                        name:'manager',
                        message:"Who is Employees's manager?",
                        choices:()=>{
                            var choiceArr=[];
                            for(let i=0;i<res.length;i++)
                            {
                                    choiceArr.push(res[i].id+" "+res[i].first_name+" "+res[i].last_name)
                            }
                            
                            return choiceArr;
                        },
    
                    },
            
            ]).then(ans =>{

                const manager_id=ans.manager.split(" ");
                const role_id=ans.role.split(" ");

                db.query("Insert into employee SET ?",{
                    first_name:ans.fname,
                    last_name: ans.lname,
                    role_id: role_id[0],
                    manager_id: manager_id[0]
                }, (err)=>{
                    if(err) throw err;
                    console.log("Employee "+ ans.fname +" added successfully");
                    start();
                })
            })
    
        })
       
    }

    function updateEmp()
    {
        db.query("Select * from Employee e left join roles r On e.role_id=r.id",(err,res)=>{
        if(err) throw err
        inquirer.prompt(
            [
                {
                    type: 'list',
                    name:'emp_id',
                    message:"Which employees role do you want to update?",
                    choices:()=>{
                        var choiceArr=[];
                        for(let i=0;i<res.length;i++)
                        {
                            choiceArr.push(res[i].id+" "+res[i].first_name+" "+res[i].last_name)
                        }
                        return choiceArr;
                    },

                },
                {
                    type: 'list',
                    name:'updated',
                    message:"Which role do you want to assign the selected employee?",
                    choices:()=>{
                        var choiceArr=[];
                        for(let i=0;i<res.length;i++)
                        {
                            choiceArr.push(res[i].id+" "+res[i].title)
                        }
                        return choiceArr;
                    },

                },
        ]).then(ans =>{

            const emp_id=ans.emp_id.split(" ");
            const updated_id=ans.updated.split(" ");

            db.query("Update employee SET ? where id=?",[{role_id: updated_id[0]},emp_id[0]])

            console.log("Updated the Employee role to ", updated_id[1]);
            start();
        }
        )
    }
)}