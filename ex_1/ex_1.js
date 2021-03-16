'use strict';

const dayjs = require('dayjs');

/*
A program to manage a series of tasks
*/

/**
 * Create a Task object
 * @param {number} id a unique numerical id (required)
 * @param {string} description a textual description (required) 
 * @param {boolean} isUrgent whether it is urgent (default: false) 
 * @param {private} isPrivate whether it is private (default: true) 
 * @param {Date} deadline a date with or without a time (optional) 
 */
function Task(id, description, isUrgent = false, isPrivate = true, deadline) {
    this.id = id;
    this.description = description;
    this.isUrgent = isUrgent;
    this.isPrivate = isPrivate;
    this.deadline = deadline;

    // this.toString = () => (`Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${this.deadline}`); 
    this.toString = () => {
        return `Id: ${this.id}, ` +
            `Description: ${this.description}, ` +
            `Urgent: ${this.isUrgent}, ` +
            `Private: ${this.isPrivate}, ` +
            `Deadline: ${typeof this.deadline !== 'undefined' ? this.deadline : '<not defined>'}`;
    }
}

/**
 * Create a TaskList object to store a list of tasks
*/
function TaskList() {
    this.list = [];

    this.add = (task) => {
        this.list.push(task);
    };

    this.listAll = () => {
        return this.list;
    };

    this.compareTasks = (a, b) => {
        // if the function returns a vlue greater than 0, sort b before a
        return a.deadline.isAfter(b.deadline) ? 1 : -1;
    };

    /**
     * sort the content of the TaskList by deadline, in ascending order
     * (the tasks without a deadline should be listed at the end)
     */
    this.sortAndPrint = () => {
        // The sort() method sorts the elements of an array in place and returns the sorted array.
        // return [...this.list].sort( (a, b) => (a.deadline.isAfter(b.deadline) ? 1 : -1));
        // return [...this.list].sort( this.compareTasks );
        const sortedTasks = [...this.list].sort( this.compareTasks );
        console.log('\nTasks sorted by deadline (most recent first): ');
        for (const task of sortedTasks) {
            console.log(task.toString());
        }
        return sortedTasks;
    };

    /**
     * filter out the tasks that are not urgent.
     */
    this.filterAndPrint = () => {
        // The filter() method creates a new array with all elements 
        // that pass the test implemented by the provided function
        const urgentTasks = this.list.filter( task => task.isUrgent == true );
        console.log('\nTasks filtered, only (urgent == true): ');
        for (const task of urgentTasks) {
            console.log(task.toString());
        }
        return urgentTasks;
    };

}

const tasks = new TaskList();

tasks.add(new Task(1, 'laundry'));
tasks.add(new Task(2, 'monday lab', false, false, dayjs('2021-03-16')));
tasks.add(new Task(3, 'phone call', true, false, dayjs('2021-03-08')));

// console.log(tasks.listAll().toString());
const allTasks = tasks.listAll();
for (const task of allTasks) {
    console.log(task.toString());
}

/*
console.log('\nTasks sorted by deadline (most recent first): ');
const sortedTasks = tasks.sortAndPrint();
for (const task of sortedTasks) {
    console.log(task.toString());
}
*/
tasks.sortAndPrint();
tasks.filterAndPrint();

debugger;
