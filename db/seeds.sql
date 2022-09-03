INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finnce"),
       ("Legal"),
       ("Sales");

INSERT INTO roles(title,salary,department_id)
VALUES("Sales Lead", "100000", 4),
("Salesperson","80000",4),
("Lead Engineer","150000",1),
("Software Engineer","120000",1),
("Account Manager","160000",3),
("Accountant","125000",3),
("Legal Team lead","250000",2),
("Lawyer","190000",2);


INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES
("John","Doe",1,null),
("Mike","Chan",1,1),
("Ashley","Rodriguez",3,null),
("Kevin","Tupic",4,3),
("Kunal","Singh",5,null),
("Malia","Brown",6,5),
("Sarah","Lourd",7,null),
("Tom","Allen",8,7)
;