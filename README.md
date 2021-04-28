# Gist-monitor

## Runing locally

### Requirements

- npm version 12 or above
- docker
- docker-compose

#### Populate .env file

Create a new file based on the example.
```shell
cp .env.example .env
```

#### Start local redis and gist-monitor in docker containers

Run docker-compose

```shell
docker-compose up -d
```

#### Start only redis and run gist-monitor with hot-reloading

Install dependencies

```shell
npm install
```

Set `REDIS_HOST=localhost` in `.env` 

Start only redis container

```shell
docker-compose up -d redis
```

Start gist-monitor with nodemon

```shell
npm run start
```

#### Stop redis and gist-monitor containers and delete volumes

```shell
docker-compose down -v
```

#### Rebuild docker images

```shell
docker-compose up --build
```

---

## Endpoints

#### /gist

`GET /gist` - Start gist update for all users.

`GET /gist/:user` - Get recent gists for `:user`.

#### /users

`GET /users` - List all users currently in the system that are being monitored.

`PUT /users/:user` - Add new user into the system for monitoring.

`DELETE /users/:user` - Remove user from system.


## Provisioning a kubernetes cluster and deploying to Google Cloud

Refere to [the deployment README](./deployment/README.md)


