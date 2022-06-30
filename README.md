# Requirements
- [node.js](https://nodejs.org/en/download/)
- npm
- mysql
- create `demo_db` in mysql and import `demo_db.sql` file which present in root directory

# How to run project

- First need to install required module which can be done by entering following command.
```sh
npm i 
```
- Enter following command to run the project:
```sh
npm start
```
- If all goes well, it will print 'Connected to MySQL.' in console, else it will print error message.

# Troubleshooting
- If program printing error message please do following:
1. Make sure that `node.js` and `mysql` are installed in system.
2. Make sure database created in mysql and tables imported inside database.

# How to execute test cases
- First need to install required module i.e.`chai` and `mocha` which can be done by entering following command.
```sh
npm i 
```
- The project server should be running.
- Enter following command to execute test cases:
```sh
npm test
```
- If all goes well it'll show 7 passing test cases, else it will print error message.
