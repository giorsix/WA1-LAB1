'use strict';

// import dayjs and sqlite3
const dayjs = require('dayjs');
const sqlite = require('sqlite3');

// i18n and locale
// LocalizedFormat extends dayjs().format API to supply localized format options.
// to use shortcut 'LLL' for date and time format
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

/*
DB structure
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY, 
    description TEXT NOT NULL, 
    urgent BOOLEAN DEFAULT (0) NOT NULL, 
    private BOOLEAN DEFAULT 1 NOT NULL, 
    deadline DATETIME
);

DATETIME format is as ISO 8601 : 2021-03-16T09:00:00.000Z
*/

/**
 * Create a Task object
 * @param {number} id a unique numerical id (required)
 * @param {string} description a textual description (required)
 * @param {boolean} isUrgent whether it is urgent (default: false)
 * @param {boolean} isPrivate whether it is private (default: true)
 * @param {Date} deadline a date with or without a time (optional)
 */
 function Task(id, description, isUrgent = false, isPrivate = true, deadline = '') {
    this.id = id;
    this.description = description;
    this.isUrgent = isUrgent;
    this.isPrivate = isPrivate;
    // saved as dayjs object
    this.deadline = deadline && dayjs(deadline);

    // this.toString = () => (`Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${this.deadline}`);
    this.toString = () => {
        return `Id: ${this.id}, ` +
            `Description: ${this.description}, ` +
            `Urgent: ${this.isUrgent}, ` +
            `Private: ${this.isPrivate}, ` +
            `Deadline: ${this._formatDeadline('LLL')}`;
    };

    // https://day.js.org/docs/en/display/format
    // Format: LLL  English Locale: MMMM D, YYYY h:mm A     Sample Output: August 16, 2018 8:02 PM
    this._formatDeadline = (format) => {
        return this.deadline ? this.deadline.format(format) : '<not defined>';
    }

};

function TaskList() {

    // this.list = [];
    const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

    // load all the tasks included in the database
    this.getAll = () => {
        return new Promise( (resolve, reject) => {
            const sql = 'SELECT * FROM tasks';
            db.all(sql, [], (err, rows) => {
                // if err is true, some error occurred. Otherwise, rows (an array) contains the result.
                if (err) {
                    reject(err);
                } else {
                    const tasks = rows.map( row => new Task(row.id, row.description, row.urgent == 1, row.private == 1, row.deadline));
                    // this.list = [...tasks];
                    resolve(tasks);
                }
            });
        });
    };

    // load, through a parametric query, only the list of tasks whose deadline is after a given date
    this.getAfterDeadline = (deadline) => {
        return new Promise( (resolve, reject) => {
            const sql = 'SELECT * FROM tasks WHERE deadline > ?';
            db.all(sql, [deadline.format()], (err, rows) => {
                // if err is true, some error occurred. Otherwise, rows (an array) contains the result.
                if (err) {
                    reject(err);
                } else {
                    const tasks = rows.map( row => new Task(row.id, row.description, row.urgent == 1, row.private == 1, row.deadline));
                    // this.list = [...tasks];
                    resolve(tasks);
                }
            });
        });
    };

    // load, through a parametric query, only the list of tasks that contain a given word
    this.getWithWord = (word) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM tasks WHERE description LIKE ?';
            db.all(sql, ['%' + word + '%'], (err, rows) => {
                // if err is true, some error occurred. Otherwise, rows (an array) contains the result.
                if (err) {
                    reject(err);
                } else {
                    const tasks = rows.map(row => new Task(row.id, row.description, row.urgent == 1, row.private == 1, row.deadline));
                    // this.list = [...tasks];
                    resolve(tasks);
                }
            });
        });
    };

};

async function main(data) {
    try {
        const taskList = new TaskList();

        // load all the tasks included in the database
        console.log("****** All the tasks in the database: ******");
        const tasks = await taskList.getAll();
        tasks.forEach( (task) => console.log(task.toString()) );

        // get tasks after a given deadline
        const deadline = dayjs('2021-03-13T09:00:00.000Z');
        console.log("****** Tasks after " + deadline.format() + ": ******");
        const futureTasks = await taskList.getAfterDeadline(deadline);
        futureTasks.forEach( (task) => console.log(task.toString()) );

        // get tasks with a given word in the description
        const word = 'phone';
        console.log("****** Tasks containing '" + word + "' in the description: ******");
        const filteredTasks = await taskList.getWithWord(word);
        filteredTasks.forEach( (task) => console.log(task.toString()) );

        debugger;

    } catch (error) {
        console.log(error);
        return;
    }
}

main();
