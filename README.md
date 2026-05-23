# Cloud Computing
This is a project of the course of Cloud Computing for the University of West Attica. The project is a simple report managing tool and viewer. Is features a ASP.NET backend and a React frontend.
The reports themselfs are in markdown format.

The frontend part is been served from the wwwroot of the backend so only one running instance is required. The authentication system is build using JWT tokens that are stored in HTTP only cookies. 
Finally the project supports Role based authentication.

The project uses the Postgre database.

## Sample user
This is the credentials for a user in the sample website

**Username:** User \
**Password:** User

## Settigns 
The application provides some config options in the `appsettings.json` file in the Server project. This config files are been loaded by enviromental variables on Azure deployment 
or from UserSecrets in local development.

Connection string to database.
```json
  "ConnectionStrings": {
    "DefaultConnection": ""
  },
```

JWT token key and configuration.
```json
  "Jwt": {
    "Key": "",
    "Issuer": "CloudComputing",
    "Audience": "CloudComputingUsers",
    "ExpiryMinutes": 480
  },
```

Request the application to try create an admin account on startup if it dosn't exist.
```json
  "Admin": {
    "ShouldCreate": false,
    "Username": "",
    "Password": ""
  }
```

### How to add user secrets
Insted of filling the json file you can add user secrets with the 
`dotnet user-secrets set ExambleJsonObject:ExambleJsonKey ExambleValue --project ./CloudComputing.Server`.

In Azure deployment create an enviromental variable with the format
`ExambleJsonObject__ExambleJsonKey`
and assign your value.

## Run the project
.NET 10 and the Postgre database are required for this project.

**Step 1:** Restore the dotnet tools, in this case ef core. `dotnet tool restore`

**Step 2:** Run migrations to build database `dotnet ef database update --project ./CloudComputing.Server`

**Step 3:** Build the project `dotnet build`

**Step 4:** Run the project `dotnet run --project ./CloudComputing.Server`

A VITE server will be created in the developer enviroment, however in deploy the compiled react app will be placed on wwwroot
