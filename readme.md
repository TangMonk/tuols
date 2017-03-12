# Productive generator for Node.js CRUD application, make CRUD happy and fun!

## install

```
npm install -g tuols
```

## pre-requirement

node > 7.6 & PostgreSQL

and you should know about `hapi` and `react`

## usage

### init project

```
tuols init
```

run react application
```
$ cd api/
$ npm run dev
```

run api server

```
$ cd api/
$ node server
```

### creating model curd api

```
tuols g model user name:string,phone:string,password_hash:string
```

### creating model admin page with specify ui type

```
tuols g view user name:string,phone:string,password_hash:string
```

now support type are:

- input
- select
- hidden


## todos

1. optional edit page
2. file upload
3. search component should support multiple file search

