# Dynaform - Dynamic Form Builder

A flexible tool for building and managing dynamic forms.

## Requirements

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [make](https://www.gnu.org/software/make/) (for build automation)
- [python](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/)
- [pipenv](https://pipenv.pypa.io/en/latest/)
- [Docker](https://www.docker.com/) (recommended)

## Installation
Clone the repository:

```sh
git clone https://github.com/zeffa/dynaforms.git 
# or
git clone git@github.com:zeffa/dynaforms.git (using SSH)

cd dynamic-form-builder
```
## Preferences
- I prefer to use docker to build and run the app.
- For design, the app supports Three (3) form creation capabilities
    - UI Interface;
        - This is most preferred. 
        - Any one can use it. 
        - No need of technical knowledge
    - JSON Form Builder:
        - is the second option. 
        - This is form user with technical skills and understands json
    - API: 
        - You can use the api as well to submit the form. 
        - You need to also have json undrstading
        - Technical understanding of APIs as well

### Why docker?
- Docker provides a consistent environment for development and production. 
- It also makes it easier to share the app with others.
- Docker also makes it easier to run the app on different operating systems.
- Docker avoids `dependency hell` where different machines have different versions of dependencies.
- Above all, docker avoids `It's runing on my machine` shenanigans.

## With Docker and make
Copy the .env* files from `server/sample_envs/` directory to the `server/` directory.

Run the following command to copy the `.env*` files to the `server/` directory.

```sh
cp server/sample_envs/.env* server/
```
Copy the .env.local.sample to .env.local in the client directory.

```sh
cp client/.env.local.sample client/.env.local
```

Run the following command to start the app:

```sh
make dev
```
The above command spins up the app (both frontend and backend) in development mode.

The server runs on port `8000` and the frontend runs on port `3000`.

#### Admin/Superuser credentials (created automatically when using docker)
- username: `admin`
- password: `12345678`

## Without Docker
#### Backend
Setup postgresql database locally. 
- Create a database named `dynaforms`
- Create a user named `dynaforms` with password `dynaforms`
- Set the database host to `localhost`
- Set the database port to `5432`
- Grant all privileges to the user on the database `dynaforms`
- In `server/.env` file, ensure the following variables are set:
    ```sh
    DB_NAME=dynaforms
    DB_USER=dynaforms
    DB_PASSWORD=dynaforms
    DB_HOST=localhost
    DB_PORT=5432
    ```
Open terminal window and run the following command to setup server
```sh
cd server
```
Install dependencies:
```sh
pipenv shell
pipenv install --dev
```
Run migrations:
```sh
python manage.py migrate
```
Start the server:
```sh
python manage.py runserver
```
Create a superuser:
```sh
python manage.py createsuperuser
```

#### Frontend
Open another terminal window and run the following command to setup server. The server should be running in the first terminal window.

```sh
cd client
```

Install dependencies:

```sh
npm install
```

### Start the App in development mode

```sh
npm run dev
```

### Accessing the app
- Open `http://localhost:3000` in your browser to view the app.
- For admin access, open `http://localhost:3000/admin` or from `Admin Panel` menu item in the app.
- Admin requires authentication so you maybe redirected to login page. 
- Use credentials created created from previous step


##
I expect the reviewer to be a technical person. 
On that basis, tests are only setup to run on docker.

### Tests
To run tests, use the following command:
```sh
make tests
```

### Linting
Using docker, there are also lint commands.
```sh
make check
```
This will run all lint commands.

To fix linting issues, use the following command:
```sh
make fix
```

However, to run these commands outside docker, see the `Makefile` for the commands.

## Celery

- Celery is used to handle background tasks.
- Emails are sent to all users registered as super users.
- In this version, we are not sending actual emails
    - I'm using console email backend since I couldn't set up atual email server.
- To see the emails, check the terminal when the docker services are running
[Email Notification](files/email-notification.png)

## Video Demos
- The video demos do not include all features of this app. 
    - I just recorded only 2 main use cases, using UI interface
        - [Form Creation](https://www.loom.com/share/dbef92a757cb4acabbf8b5f2941f4234?sid=457a797f-3b88-4f41-8e57-c0f3e0c988f2)
        - [Form Filling](https://www.loom.com/share/d8b5c5a566f54f2582ca8f7edf62df3a?sid=4499f0fa-4f0f-4aa5-bd09-01c63670a699)
        - [Unit Tests](https://www.loom.com/share/ee081df6d036449faf785a1aac215909?sid=b885ad2e-5d52-42d9-a33d-ada7a812a86d)
    - To preview more features, 
        - Setup and run the app locally.
    - I'll also be glad to do a live demo if need be.

## Contact the developer
For any queries or trouble runing this project, please contact the developer.

- Email: zeffah.elly@gmail.com
- Phone: +254 706 567 060


