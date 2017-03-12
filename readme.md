# productive generator for node js CRUD application

## install

```
npm install -g tuols
```

## usage

### init project

```
tuols init
```

### creating model curd api and admin curd page

```
tuols g model user name:string,phone:string,password_hash:string
```

only create model

```
tuols model user name:string,phone:string,password_hash:string --only-model
```

only create api

```
tuols user name:string,phone:string,password_hash:string --only-api
```

only create admin

```
tuols user name:string,phone:string,password_hash:string --only-admin
```

### specify admin column type

```
tuols user name:string,phone:select,password_hash:string --only-admin
```

now support type are:

- input
- select
- hidden
