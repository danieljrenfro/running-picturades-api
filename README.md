# Running Picturades API


## API Summary

This is an API for the Running Picturades React app.

## API Documentation
##### Base URL 
`https://guarded-castle-13310.herokuapp.com/api`

This API uses the JWT library to return authenication tokens back to the client to authentication certain routes. At this point only the POST /api/lists and POST /api/list/:list_id/words routes are authenticated.

### Auth

##### `POST /auth/login`
Request:

```
fetch(`baseURL/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: {
        "user_name": "testUser",
        "password": "password"
      }
})
```

Response:

``` 
status: 201,
body: {
  "authToken": "jwt-auth-token"
}
```

### Users

##### `GET /users`

Request:

``` 
fetch(`BaseURL/users`, {
  method: 'GET',
  headers: {
    'content-type': 'application/json'
    'authorization': 'bearer jwt-token'
  },
  body: {}
})
```

Response:

``` 
status: 200,
body: {
  "id": "1",
  "user_name": "testUser",
  "full_name": "Test User"
}
```

##### `POST /users`

Request:

Requirements: 
* "user_name" must be unique.
* "password" must be between 8-72 characters, include one upper case letter, lower case letter, number and special character.

``` 
fetch(`baseURL/users`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: {
        "user_name": "testUser",
        "full_name": "Test User",
        "password": "password"
      }
)}
```

Response:

```
status: 201,
body: {
  "id": "1",
  "user_name": "testUser",
  "full_name": "Test User"
}
```

### Lists Routes

##### `GET /lists`
Request:

```
fetch(`baseURL/lists`, {
  method: 'GET',
  headers: {},
  body: {}
})
```

Response:

```
status: 200,
body: [
  {
    "id": "1",
    "title": "List 1",
    "game_type": "Pictionary",
    "creator_name": "Test User",
    "creator_id": "1"
  },
  {
    "id": "2",
    "title": "List 2",
    "game_type": "Charades",
    "creator_name": "Test User",
    "creator_id": "1"
  }
]
```

##### `GET /lists/:list_id`
Request:

```
fetch(`baseURL/lists/1`, {
  method: 'GET'
  headers: {},
  body: {}
})
```

Response:

``` 
status: 200,
body: {
  "id": "1",
  "title": "List 1",
  "game_type": "Pictionary",
  "creator_name": "Test User",
  "creator_id": "1"
}
```

##### `GET /lists/:list_id/words`
Request:

```
fetch(`baseURL/lists/1/words`, {
  methods: 'GET',
  headers: {},
  body: {}
})
```

Response:

```
status: 200, 
body: [
  {
    "id": "1",
    "word": "First Word",
    "list_id": "1"
  },
  {
    "id": "2",
    "word": "Second Word",
    "list_id": "1"
  },
  {
    "id": "3",
    "word": "Third Word",
    "list_id": "1"
  }
];
```

##### `POST /lists`
Request:

Requirements: 
* "title" cannot be empty.
* "game_type" must either be "Pictionary" or "Charades".
```
fetch(`baseURL/lists`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'authorization': `bearer jwt-auth-token`
  },
  body: {
    "title": "First List",
    "game_type": "Pictionary"
  },
})
```

Response:

``` 
status: 201,
location: "/api/lists/1"
body: {
  "id": "1",
  "title": "First List",
  "game_type": "Pictionary",
  "creator_name": "Test User",
  "creator_id": "1"
}
```


##### `PATCH /lists/:list_id`
Request:
Requirements: 
* Must either have "title" or "game_type" to update.

``` 
fetch(`baseURL/lists/1`, {
  method: 'PATCH',
  headers: {
    'content-type': 'application/json'
  },
  body: {
    "title": "Updated Title",
    "game_type": "Charades"
  }
})
```

Response:

```
status: 204,
body: {}
```

##### `DELETE /lists/:list_id`
Request:

``` 
fetch(`baseURL/lists/1`, {
  method: 'DELETE',
  headers: {},
  body: {}
})
```

Response:

``` 
status: 204,
body: {}
```

#### Words Route

##### `GET /words/:word_id`
Request:

``` 
fetch(`baseURL/words/1`, {
  method: 'GET',
  headers: {},
  body: {}
})
```

Response:

``` 
status: 200,
body: {
  "id": "1",
  "word": "First Word",
  "list_id": "1"
}
```

##### `PATCH /words/:word_id`
Request:

``` 
fetch(`${config.API_ENDPOINT}/words/${wordId}`, {
  method: 'PATCH',
  headers: {
    'content-type': 'application/json'
  },
  body: {
    "word": "Updated Word"
  }
})
```

Response:

``` 
status: 204,
body: {}
```

##### `POST /words`
Request: 

``` 
fetch(`baseURL/words`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer jwt-auth-token`
      },
      body: {
        "words": [
          {
            "id": "1",
            "word": "First Word",
            "list_id": "1"
          },
          {
            "id": "2",
            "word": "Second Word",
            "list_id": "1"
          },
          {
            "id": "3",
            "word": "Third Word",
            "list_id": "1"
          }
        ]
      }
    })
```

Response:

```
status: 201,
location: '/api/lists/1/words',
body: {
  "words": [
    {
      "id": "1",
      "word": "First Word",
      "list_id": "1"
    },
    {
      "id": "2",
      "word": "Second Word",
      "list_id": "1"
    },
    {
      "id": "3",
      "word": "Third Word",
      "list_id": "1"
    }
  ]
}
```

#### Errors

Errors coming back from the API will be formatted in a JSON object:

` { error: 'Some error message here' } `

## Technology Used
* Node.js
* Javascript
* Express
* PostgreSQL