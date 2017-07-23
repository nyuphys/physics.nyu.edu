# New SPS website - DEVELOPMENT BRANCH

Aight. So I configured this the best I can.

## Install
You will need [Docker](https://www.docker.com/) in order to run this. It's basically a tool that makes very thin virtual machines (more or less). That way the development branch can mimic the behavior on the live server.

## Running
After installing Docker, run these commands:

```
git clone https://github.com/psanker/physics.nyu.edu.git
cd physics.nyu.edu
docker pull uknetweb/php-5.4-apache
docker build -t sps .
docker run -p 8010:80 sps
```

After that, the site should be running on `localhost:8010`.
