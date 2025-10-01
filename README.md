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

### With Docker and make
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

### Without Docker
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

#### Using the app
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

## Contact the developer
For any queries or trouble runing this project, please contact the developer.

- Email: zeffah.elly@gmail.com
- Phone: +254 706 567 060


