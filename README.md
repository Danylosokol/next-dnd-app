# Next DND App

## Summary

1. [Project Overview](#project-overview)
2. [Installation Instructions](#installation-instructions)
3. [User Guide](#user-guide)
4. [Project Structure](#project-structure)

## Project Overview

This project is a take-home coding challenge, the aim of which is to create a web application for planning tyre sets for a race weekend. The application meets the following requirements:

- The application allows the user to create / edit / delete race weekends.
- When creating / editing a race weekend, the user can set: number of tyre sets of each type, weekend sessions, number of tyre sets to be returned after each session.
- When creating a new race weekend, the user can copy the settings from an existing race weekend.
- The application has three types of tyre sets: Soft (red), Medium (yellow) or Hard (white).
- The application has two states for each set: New (not used in any session), Used (used at least once in any session).
- The application allows you to create two types of session for a weekend: Free Practice, Qualifying session. The Race session is automatically added as the last session of each race weekend.
- When creating a race weekend, the application validates the number of tyre sets entered and the number of tyre sets returned in the sessions. Once all the tyre sets required by the sessions have been returned, at least one must remain for the Race session.
- The application allows you to plan the use of tyre sets between sessions in the dashboard for each race weekend.
- The application allows you to select the tyre sets to be returned in the dashboard for each session. The application also checks that the user does not return more tyre sets than specified for a given session.
- The application does not allow the user to use the returned set of tyres in sessions following the one in which the set was returned.
- The app allows user to save the dashboard status for a particular week.
- The application on the left side of the dashboard displays the remaining tyre sets for the Race session.
- The application notifies the user when there are no new tyre sets left for a race session.

**The following technologies were used to build the application:**
- [NextJS 13](https://nextjs.org/)
- [React.js](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- HTML / CSS / JavaScript
- [TailwindCSS](https://tailwindcss.com/)
- [MUI](https://mui.com/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [React DND](https://react-dnd.github.io/react-dnd/about)
- [MongoDB](https://www.mongodb.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Mongoose / Typegoose](https://mongoosejs.com/)
- [Axios](https://axios-http.com/)

The application has a responsive design and has been tested in the following browsers:
- Google Chrome 
- Safari
- Firefox
- Microsoft Edge

## Installation Instructions
1. First make sure you have Node.js and NPM installed (run `node -v` command in your terminal and you should get a Node.js version). You can install Node.js [here](https://nodejs.org/en/download).
2. Clone the repository of the project with the following command: `git clone https://github.com/mbgp-raceeng/danylo-sokol.git`
3. Open the project (`cd danylo-sokol/`)
4. Create an .env file and put the environment variable MONGODB_URI="uri to your mongodb database" in it.
5. Install the project dependencies: `npm i`
6. Run the following command to build the  application: `npm run build`
7. To start the application locally, run the following command: `npm run start`
8. To run the application in development mode, use the following command: `npm run dev`
9. To run automated tests, use the following command: `npm test`

**Note:** the MongoDB database that was used during development will be available during evaluation of the project, so the repository has an .env file with a URI to connect to it, although credentials should not normally be uploaded to GitHub in this form.

## User Guide

The following pages can be found in the application:

- **Home** - on the main page the user can see the list of created race weekends, also the user can delete or open the page to edit a particular weekend by clicking on the corresponding button on the card of this weekend. The user can also create a new race weekend by clicking on the button with the text "+ WEEKEND" at the bottom right corner of the screen.

- **Create Weekend** - after clicking on the "+ WEEKEND" button on the main page, the user will be taken to this page. On this page the user can manually set the data of the new race weekend as: weekend name, number of soft tyres, number of medium tyres, number of hard tyres and create sessions for this weekend (here the user can set the session name, the session type and the number of tyre sets to be returned for each session). The user can also copy all these data, except the name of the weekend, from any race weekend already created in the application by selecting it in the select element in the "Copy existing weekend" section and clicking on the "COPY" button. By clicking on the "SAVE WEEKEND" button the application will create this weekend in the database and return the user to the main page. If the user tries to close the page without saving the weekend, the application will inform the user that the data will not be saved and may therefore be lost.

- **Edit Weekend** - by clicking on the pencil icon on the card of a particular race weekend on the main page the form for editing this race weekend can be opened. In this form we can edit the following data of the race weekend: the name of the weekend, the number of soft tyres, the number of medium tyres, the number of hard tyres and the sessions for this weekend (here the user can edit the name of the session, the type of session and the number of sets of tyres to be returned for each session). When changes are saved, the application resets the dashboard to its original state.

- **Dashboard** - by clicking on a specific weekend on the main page the user can open the dashboard for that weekend. In the dashboard the user can see on the left side a list of available tyre sets, which are divided by colour (Soft (red), Medium (yellow) or Hard (white)) and columns for sessions that were created in the given weekend. Each tyre set has a unique ID. The user can add tyre sets to sessions from the main list by dragging and dropping a tyre set card. A tyre set that has not been used in any session has a green frame, a tyre set that has been used in at least one session has a red frame. In a session, you can select which tyre sets are returned by clicking on the check box next to the tyre set. Tyre sets marked as being returned in a particular session will disappear from the main list of available tyre sets and cannot be used in sessions following the one in which they were returned. To remove a set of tyres from a session, click on the "Delete" icon next to the set of tyres. To save the status of the dashboard, click on the "SAVE CHANGES" button at the bottom of the page. The application will remind you to save your changes each time you close the dashboard.

## Project Structure Description

- **/app** - the source code of the application:
  - **/api** - directory is used to define serverless API routes that handle backend requests and work with the database.
  - **/components** - React components used in the application.
  - **/utils** - functions, constants and database models that are reused in the project.
  - **/create-weekend** - route for the Create Weekend page.
  - **/dashboard** - dynamic route for the Dashboard page.
  - **/edit-weekend** - route for the Edit Weekend page.
  - layout.tsx - file serves as the root layout component in a Next.js 13 application, where it sets global styles, configurations for the app.
  - page.tsx - file serves as the main entry point for the Next.js 13 application's home page.
- **/public** - folder is used to serve static assets such as logo.png, making them directly accessible in the Next.js 13 application.
- **/types** - is used to define and export TypeScript types, which helps to maintain a consistent structure for notes throughout the application.
- **/\_\_tests\_\_** - stores tests for the application page components. 

You can find a database schema at [this link](https://drive.google.com/file/d/1RzELHZfseRk6U8rnvF6_FrExK5rSYP6G/view?usp=sharing).

