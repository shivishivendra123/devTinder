- AUTHROUTER
POST /signup
POST /login
POST /logout

- PROFILEROUTER
GET /profile/view
POST /profile/edit
POST /profile/password

- CONNECTIONREQUESTROUTER
POST /request/send/interested/:requestId
POST /request/review/rejected/:requestId

POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

GET /connections
GET /requests
GET /feed