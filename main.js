#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
//Display a colourful welcome message
console.log(chalk.bold.rgb(204, 204, 204)("\n \t\t <<< ============================================================= >>> \n"));
console.log(chalk.bold.rgb(204, 204, 204)(chalk.magenta.bold("\t\t\t     Welcome To \ `Amashta Rehmani \ ` OOP MY Bank\n")));
console.log(chalk.bold.rgb(204, 204, 204)("\t\t <<< ============================================================== >>> "));
//Creating a customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
//Creating a bank class
class Bank {
    customer = [];
    account = [];
    addCutomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accobj) {
        let NewAccounts = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
        this.account = [...NewAccounts, accobj];
    }
}
let myBank = new Bank();
//Creat a customer
for (let i = 1; i <= 5; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number("3#########"));
    const cus = new Customer(fName, lName, 20 * i, "male", num, 1001 + i);
    myBank.addCutomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}
//Bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            name: "select",
            type: "list",
            message: "Please select the service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        //view balance
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                name: "num",
                type: "input",
                message: "Please enter your account number!"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green(name?.firstName)} ${chalk.green(name?.lastName)}
                 your account balance is ${chalk.blue(`$${account.balance}`)}`);
            }
        }
        //cash withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                name: "num",
                type: "input",
                message: "Please enter your account number!"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Please enter your amount!"
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red("Remaining balance is insufficient!"));
                }
                let newBalane = account.balance - ans.rupee;
                //calling transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalane });
                console.log(newBalane);
            }
        }
        //cash deposit
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                name: "num",
                type: "input",
                message: "Please enter your account number!"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Please enter your amount!"
                });
                let newBalane = account.balance + ans.rupee;
                //calling transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalane });
                console.log(newBalane);
            }
        }
        if (service.select == "Exit") {
            console.log(chalk.grey("Exiting the program......"));
            console.log(chalk.grey("\nThankyou for using our services. Have a great day!"));
            return;
        }
    } while (true);
}
bankService(myBank);
