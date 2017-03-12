# productive generator for node js CRUD application

## install

```
npm install -g generator-tuols
```

## usage

### init project

```
yo tuols
```

### creating model curd api and admin curd page

```
yo model --name user --attributes name:string,phone:string,password_hash:string
```

only create model

```
yo model --name user --attributes name:string,phone:string,password_hash:string --only-model
```

only create api

```
yo model --name user --attributes name:string,phone:string,password_hash:string --only-api
```

only create admin

```
yo model --name user --attributes name:string,phone:string,password_hash:string --only-admin
```

### specify admin column type

```
yo model --name user --attributes name:string:input,phone:string:select,password_hash:string:hidden --only-admin 
```

not support type are:

- input
- select
- hidden
