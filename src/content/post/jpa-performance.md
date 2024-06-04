---
title: JPA Performance Overview
description: This post is purely for testing the table of content, which should not be rendered
publishDate: 06 Jul 2024
tags:
  - spring
  - java
  - api
draft: true
---
Performance is vital for any application, especially in data access. Spring Data JPA offers a convenient and efficient way to manage database access and data manipulation. However, it also has performance pitfalls that developers need to recognize. This article will cover common performance issues in Spring Data JPA and provide solutions to avoid them. 
## JPA

First of all, **Java Persistence API (JPA)** is a specification for managing relational data in Java applications. It provides a standard way to map Java objects to database tables and to handle database operations through object-relational mapping (ORM). JPA simplifies data access and manipulation by allowing developers to work with Java objects rather than SQL statements, thus promoting cleaner and more maintainable code. It is widely used in enterprise applications for seamless interaction with various relational databases.

## Performance Issues

### Too Many Eagerly Loaded Relationships

Eager loading is a technique where related entities are loaded into memory simultaneously when their parent entities are loaded. This can enhance performance by reducing the number of queries needed to retrieve related data. However, it can also cause performance issues if too many relationships are eagerly loaded, leading to excessive memory consumption and potentially slowdowns due to the loading of unnecessary data.

Suppose we have an `Author` entity that has a one-to-many relationship with a `Book` entity:

```java
@Entity 
class Author { 
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name; 
	
	@OneToMany(mappedBy = "author", fetch = FetchType.EAGER) // FetchType.LAZY
	private List<Book> books;
} 

@Entity class Book { 

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
	private Long id;
	
	private String title; 
	
	@ManyToOne @JoinColumn(name = "author_id") 
	private Author author;
}
```

If we fetch an author with his all posts, all the posts will be eagerly loaded into memory, even if we only need to fetch an author.

To avoid this problem, we should only eagerly load the relationships that are essential. We can also use lazy loading to defer the loading of related entities until they are actually needed.

### N+1 Queries

The N+1 queries occurs when we execute a query that retrieves a list of entities, and then for each entity, we execute an additional query to retrieve more entities. This results in multiple queries being executed against the database, which can slow down our application and the database.

```java
@Entity  
public class Author {  
    @Id  
    private Long id;  
    private String name;  
      
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)  
    private List<Book> books;  
      
   // other fields  
}  
  
@Entity  
public class Book {  
    @Id  
    private Long id;  
    private String title;  
    private String content;  
      
    @ManyToOne(fetch = FetchType.LAZY)  
    private Author author;  
    // other fields  
}
```

We can get books in multiple ways. Let's start from the worst one where we got N+1 problem:

```java
List<Author> authors = authorRepository.findAll();  
   
for (Author author : authors) {  
    List<Book> books = author.getBooks();  
}
```

So, how to solve that?
You can do customized queries for gathering specific data:

```java
@Query("SELECT a FROM Author a JOIN FETCH a.books")  
List<Author> findAuthorsWithAllBooks();
```

Or even creating an EntityGraph just for that:

```java
@Entity  
@NamedEntityGraph(  
        name = "Author.books",  
        attributeNodes = {  
                @NamedAttributeNode("books")  
        }  
  )  
public class Author {  
    @Id  
    private Long id;  
    private String name;  
      
    @OneToMany(mappedBy = "author", fetch = FetchType.Lazy)  
    private List<Book> books;  
    // other fields  
}
```
```java
@EntityGraph(type=EntityGraph.EntityGraphType.FETCH, value = "Author.books")  
List<Author> findAll();
```
### Unnecessary Transactions

All repository and service methods are executed within a transaction. This can be a performance problem if we have long-running transactions that lock database resources and block other transactions.It can be a performance problem if the transaction locks database resources and blocks other transactions.

To avoid this problem, just only use transactions when necessary and keep them as short as possible.

>[!INFO]  We can also use read-only transactions for read-only operations to improve performance.

```java
@Service  
public class AuthorService {  
    @Autowired  
    private AuthorRepository authorRepository;  
      
    @Transactional  // readOnly = true
    public List<Author> findAllAuthors {  
        return authorRepository.findAll();  
    }  
}
```

>[!HELP] By the way, here is how to see transaction logs:
>
*logging.level.org.springframework.transaction.interceptor = TRACE*
*logging.levelorg.springframework.transaction.support = DEBUG*  
*logging.level.org.springframework.orm.jpa.JpaTransactionManager = TRACE*

### Massive SQL generation

Suppose we have a `Book` entity and a `Review` entity, where each `Book` can have multiple reviews.

```java
@Entity 
public class Book { 
	@Id private Long id; 
	private String title; 
	private String content; 

	@ManyToOne(fetch = FetchType.EAGER) 
	private Author author; 
	
	@OneToMany(mappedBy = "book", fetch = FetchType.LAZY) 
	private List<Review> reviews; 
}

@Entity 
public class Review { 
	@Id 
	private Long id; 
	
	private Double rating; 
	private String comment; 
	
	@ManyToOne(fetch = FetchType.LAZY) 
	private Book book; // other fields 
}
```

To find the books with the most reviews, you might write a query like this:

```java
@Query("SELECT b FROM Book b WHERE b.id IN (SELECT r.book.id FROM Review r GROUP BY r.book.id ORDER BY COUNT(r.book.id) DESC)") 
List<Book> findTopBooksWithHighestReview();
```

You don't wanna do that. This query generates a subquery for each book, which can be a performance issue with many books. To avoid this, use a join to fetch the reviews and group by the book:

```java
@Query("SELECT b FROM Book b JOIN b.reviews r GROUP BY b ORDER BY COUNT(r) DESC") 
List<Book> findTopBooksWithHighestReview();
```

This query fetches the reviews along with the books in a single query, avoiding subqueries.
### Excessive data gathering


