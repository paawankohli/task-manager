# task-manager

Deployed on [heroku](https://getthisdone.herokuapp.com/).

## Environment
Sample .env file:
```
sgAPIKey=	
JWT_SECRET=	
MONGODB_URL=
```

## Run App
```npm i```
</br>

```npm run dev```
</br>


## USER ROUTES

### POST /user
Route used to register a new user to the app.
```
Authentication Bearer Token Required: NO
```
```JSON
body: {
    "name": "example",
    "email": "example@example.com",
    "password": "example123",
    "age": 20
} 
```

### POST /user/login
Route used to login a user to the app.
```
Authentication Bearer Token Required: NO
```
```JSON
body: {
    "email": "example@example.com",
    "password": "example123",
} 
```

### POST /user/logout
Route used to logout of the current session.
```
Authentication Bearer Token Required: YES
```

### POST /user/logoutAll
Route used to logout of all sessions.
```
Authentication Bearer Token Required: YES
```

### GET /user/me
Route used to fetch data about logged in users profile.
```
Authentication Bearer Token Required: YES
```

### PATCH /user/me
Route used to patch(update) data of logged in users profile.
```
Authentication Bearer Token Required: YES
```
```JSON
body: {
    "name": "example",
    "password": "example123",
    "age": 20
} 
```

### DELETE /user/me
Route used to delete data of logged in users profile. 
Cascade delete of all notes made by user enabled.
```
Authentication Bearer Token Required: YES
```




## TASK ROUTES

### POST /task
Route make a new task and author automatically added as current user. 
```
Authentication Bearer Token Required: YES
```
```JSON
body: {
    "description": "this an example",
    "completed": true
} 
```

### GET /task
Route used get all tasks by authored by the user. 
```
Authentication Bearer Token Required: YES
```
```
Options: completed, limit(default is 4), page(default is 1)

Example: GET /task?completed=true&limit=5&page=2
```

### GET /task/:id
Route used to get a task by its _id. 
```
Authentication Bearer Token Required: YES
```

### PATCH /task/:id
Route used to patch(update) a task by its _id. 
```
Authentication Bearer Token Required: YES
```
```JSON
body: {
    "description": "this an example",
    "completed": true
} 
```

### DELETE /task/:id
Route used to delete a task by its _id. 
```
Authentication Bearer Token Required: YES
```
