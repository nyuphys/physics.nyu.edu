# New SPS website - DEVELOPMENT BRANCH

Aight. So I configured this the best I can.

## Install
You will need [Docker](https://www.docker.com/) in order to run this. It's basically a tool that makes very thin virtual machines (more or less). That way the development branch can mimic the behavior on the live server.

After that, clone this project:
```
git clone https://github.com/psanker/physics.nyu.edu.git
```

## Running
After installing Docker, run these commands in the project's directory:

```
docker pull uknetweb/php-5.4-apache
docker build -t sps .
docker run -p 8010:80 sps
```

After that, the site should be running on `localhost:8010`.

Once you initially `docker pull` the Apache server with PHP 5.4 (`uknetweb/php-5.4-apache`) you won't need to run that command again.
