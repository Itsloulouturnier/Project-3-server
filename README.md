### API Documentation

We will start our customer by first documenting all of the routes and data models for our API. Following best practices we will use _verbs_ to specify the type of operation being done and _nouns_ when naming endpoints.

#### Routes

##### Customer routes

| HTTP verb | URL                        | Request body | Action                        |
| --------- | -------------------------- | ------------ | ----------------------------- |
| GET       | `/api/customers`            | (empty)      | Returns all the customers      |
| POST      | `/api/customers`            | JSON         | Adds a new customer            |
| GET       | `/api/customers/:customerId` | (empty)      | Returns the specified customer |
| PUT       | `/api/customers/:customerId` | JSON         | Edits the specified customer   |
| DELETE    | `/api/customers/:customerId` | (empty)      | Deletes the specified customer |

##### Task routes

| HTTP verb | URL                  | Request body | Action                     |
| --------- | -------------------- | ------------ | -------------------------- |
| POST      | `/api/tasks`         | JSON         | Adds a new task            |

<hr>

#### Models

##### Customer Model

```js
{
  title: String,
  description: String,
  tasks: [ { type: Schema.Types.ObjectId, ref: 'Task' } ]
}
```

##### Task Model

```js
{
  title: String,
  description: String,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' }
}
```
