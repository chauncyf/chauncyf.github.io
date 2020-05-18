---
layout: note
title: Behavior Questions
date: 2020-03-16 18:29 -0400
author: Chauncy
category: private
tags: 
published: true
excerpt_separator: <!--more-->
---

<!--more-->

# Behavior Questions

- **S**ituation  
- **T**ask  
- **A**ction  
- **R**esult  


## Leadership Principles
> We use our Leadership Principles every day, whether we're discussing ideas for new projects or deciding on the best approach to solving a problem. It is just one of the things that makes Amazon peculiar.

1. **Customer Obsession**  
Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust. Although leaders pay attention to competitors, they obsess over customers.
2. **Ownership**  
Leaders are owners. They think long term and don’t sacrifice long-term value for short-term results. They act on behalf of the entire company, beyond just their own team. They never say “that’s not my job."
3. **Invent and Simplify**  
Leaders expect and require innovation and invention from their teams and always find ways to simplify. They are externally aware, look for new ideas from everywhere, and are not limited by “not invented here." As we do new things, we accept that we may be misunderstood for long periods of time.
4. **Are Right, A Lot**  
Leaders are right a lot. They have strong judgment and good instincts. They seek diverse perspectives and work to disconfirm their beliefs.
5. **Learn and Be Curious**  
Leaders are never done learning and always seek to improve themselves. They are curious about new possibilities and act to explore them.
6. **Hire and Develop the Best**  
Leaders raise the performance bar with every hire and promotion. They recognize exceptional talent, and willingly move them throughout the organization. Leaders develop leaders and take seriously their role in coaching others. We work on behalf of our people to invent mechanisms for development like Career Choice.
7. **Insist on the Highest Standards**  
Leaders have relentlessly high standards — many people may think these standards are unreasonably high. Leaders are continually raising the bar and drive their teams to deliver high quality products, services, and processes. Leaders ensure that defects do not get sent down the line and that problems are fixed so they stay fixed.
8. **Think Big**  
Thinking small is a self-fulfilling prophecy. Leaders create and communicate a bold direction that inspires results. They think differently and look around corners for ways to serve customers.
9. **Bias for Action**  
Speed matters in business. Many decisions and actions are reversible and do not need extensive study. We value calculated risk taking. 
10. **Frugality**  
Accomplish more with less. Constraints breed resourcefulness, self-sufficiency, and invention. There are no extra points for growing headcount, budget size, or fixed expense.
11. **Earn Trust**  
Leaders listen attentively, speak candidly, and treat others respectfully. They are vocally self-critical, even when doing so is awkward or embarrassing. Leaders do not believe their or their team’s body odor smells of perfume. They benchmark themselves and their teams against the best.
12. **Dive Deep**  
Leaders operate at all levels, stay connected to the details, audit frequently, and are skeptical when metrics and anecdote differ. No task is beneath them.
13. **Have Backbone; Disagree and Commit**  
Leaders are obligated to respectfully challenge decisions when they disagree, even when doing so is uncomfortable or exhausting. Leaders have conviction and are tenacious. They do not compromise for the sake of social cohesion. Once a decision is determined, they commit wholly.
14. **Deliver Results**  
Leaders focus on the key inputs for their business and deliver them with the right quality and in a timely fashion. Despite setbacks, they rise to the occasion and never settle.



## Self Introduction
### Tell me about yourself
I’m currently a Master’s student in Computer Science at Brandeis University, where I am focusing on Software Engineering, and I've took several related courses. 

For example, *Capstone Project for Software Engineering*, which told me how to build a complete product from stratch, like database schema design, backend server implement, and frontend design, etc. By the way, I'm the Teaching Assistant for this coures right now.

Of course this is not enough for a good software engineer, so I've taken another course called *Software Engineering for Scalability*. This course focuses on the scalability problem in software engineering, and tought me how to improve a product to make it able to support millions of users. I learned a lot from this course, like database partitioning, like using Redis to cache frequently queried data and avoid unnecessary database access, also like using RabbitMQ to implement an asynchronized work queue to do some resourse intensive job.

Before that, I worked for MatrixCare as a Software Engineer Intern and I worked on a major release of an Electronic Health Record software. During the internship, I helped refactored the application architecture from Java EE model to Spring model, which inculdes code change, JDK update, and bugs fix.

Now that I’m finishing my Master’s degree, I’d love to focus on software engineering and discover the opportunity to work for Amazom AWS. 

### MatrixCare
> America is heading toward a senior-care crisis, with an aging population that greatly outnumbers potential caregivers. But innovations in technology are helping organizations scale their services to provide better care with fewer staff. And MatrixCare is at the forefront of this innovation.  
> 
> Much more than just an electronic health record (EHR), the MatrixCare platform enables active care management across the entire out-of-hospital spectrum. Our **integrated clinical, revenue cycle, operational and financial solutions** help organizations improve quality of care, simplify documentation and streamline business operations.
> 
> MatrixCare employees are passionate about creating ways to provide better care for our nation’s aging population, because that includes our parents, grandparents and other loved ones.

Last summer, I had an internship at MatrixCare, which is a full subsidiary by ResMed, and MatrixCare provides one stop healthcare solution. 

The product I worked on is called Skilled Nursing, basically it's an Electronic Health Record (EHR). For this product, there are two modals running at the same time: the legacy part is running on the Java EE modal, and the other part is running on the Spring modal.

As a Software Engineer Intern, I workd in a 5 person team that consists of our architect (he is also my manager), a senior engineer, a scrum master (because we are doing agile development) and two interns. The goal of our team was to update the legacy part and get rid of it.

#### Challenge
I have to be a fast learner. I'm not familiar with the stack at all, not to mention the legacy stack that were developed more than 10 years ago. It's really important for me to figure out how they worked, a 3 month internship is not a long time, right?

Ask my manager for help, what documents should I read, my past experience helped a lot.

Because the most important task was to refactor the old stack to a new stack, and the old stack was used like more than 10 years ago, so of course I dont really understand them.

In order to do the work, I have to be a fast learner, because it's important that I understand how they works. 

I have to read a lot of documents of the old stack first, and when I dont understant or I cannot find a doc, I will go to my manager to collegues for help.

The refactor went pretty well, I helped updated several important stuff like database management service as well.

`TODO`

#### Transaction Mnagement
It's a little bit hard to describe, but I'll try my best.

Typically, the place where we used Transaction Management is inside the DAO layer. 

We uses DAO to access the database, and do operations like read or write in there. In order to secure the process and have everyting running under transaction, we need the Transaction Management. And the Transaction Management was injected into the DAO through Spring.

In the legacy stack, we uses **JtaTransactionManager** for Transaction Management, JtaTransactionManager implements the **UserTransaction** interface.

In the legacy code, we used the programmatic way for the transaction, which is basically explicitly call begin, commit and rollback on the injected TransactionManager.

You see that we will call the commit or rollback method on the injected TransactionManager, this simply means that if we change the TransactionManager, the new TransactionManager should provides the same methods as well, so it should implement the same interface. 

Unfortunately, the PlatformTransactionManager doesn't implement that interface, and actually there's no begin method at all. So in the worst case, in my manager's expectation, we have to rewrite all those DAOs, and that's a huge amount of work.

The good news is that, after read the document and compare the JtaTransactionManager & PlatformTransactionManager, I found out that PlatformTransactionManager indeed have methods doing similar things, even though the name of the methods are quite different.

This means that I could create a new bean that extends the PlatformTransactionManager and implement the JtaTransactionManager's interface, so that the new bean will act just like the old one. For code inside the DAOs, wo don't need any modificatoin at all.



**PlatformTransactionManager**

[https://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/transaction.html](https://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/transaction.html)
```xml
<bean id="transactionManager" class="org.springframework.transaction.jta.JtaTransactionManager">
    <constructor-arg ref="userTransaction"/>
    <constructor-arg ref="jtaTransactionManager"/>
</bean>

<bean id="txManager" class="org.springframework.transaction.jta.JtaTransactionManager"/>

<bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
  <property name="dataSource" ref="dataSource"/>
</bean>
```

```java
public interface PlatformTransactionManager {
    TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}
```


legacy initialize with old bean, whilch is an interface
<!-- if I change  -->
it's not only about the bean, have to change all code
have the new stuff inmpement that interface



#### Log
J2EE stack to Spring, The Java EE interfaces incorporate JDBC for databases, JNDI for registries, JTA for exchanges, JMS for informing. https://www.educba.com/java-ee-vs-spring/

- Base 64 - Identify all places where sun.misc.Base64 encoding/decoding takes place
- JSP code no longer compiles under Tomcat
- JUnit test for xxxDAO
- Logging Framework Update and Configuration
- Review and Configure Transaction Mnagement Settings for Tomcat Profile to replace JBoss Tx Mgmt


### Nano Twitter

It’s a twitter-like application that supports features like tweet, retweet, comment and like. Since it's a scalability course, implementing cool features are not the first priority, all we want is to make the product scalable.

#### Timeline

We want a scalable timeline.

The most challenging part in this project, you might not believe, it's actually the timline feature. Basically, in the home page, we want to display the timeline of a user. Timeline is all recent tweets sent from users followed by current user, sort by date.

Imagine you only followed one user, it's simple to display the timeline, because all you need is simply display all that user's tweets. But what if you followed 1000 users? The server have to get all recent tweets sent by that 1000 users, and merge them together. If we take the naive approach, we may first go to the User table and get that 1000 users' id, and then go to the Tweet table use that 1000 id to get their recent tweets, and finally merge those tweets together. As you can imagine, this is a pretty expensive operation if the database gets too big. So how can we improve this?

Now here comes the trade off in software engineering, if we want speed, we can pay for the space. And the space we paied here is Redis. That is, for every single user, we cached the timeline for them. The form of the cache is the user's id point to an array, in that array, it's all tweets' id that need to be displayed in the timeline. So when a user wants to checkout his timeline, all we need to do is take that array and do a batch query in the database.

Sounds good, right? But that's not all. That's when a user wants to checkout his timeline, there's only read operation involved. What if a user with a million followers wants to send a new tweet? 

Well, now we have the Redis timeline cache for each single, we just insert the new tweet into that million users' Redis timeline instance. But that's a million user, we can't have this guy waiting there for the Redis to update. Why not make the update Redis process happen asynchronously? This is where RabbitMQ get introduced. We used RabbitMQ to implemented an asynchronous working queue. So after a user pressed the button to send a new tweet, that tweet will be stored in the database first, then it will be send to the RabbitMQ. When Redis service is idle, it will pop out a job from the queue and update the timeline cache.


#### MongoDB

Let's consider the most important thing in Twitter, the tweet.

Assume we already have the user's timeline stored in Redis, in the form of an sorted tweet_id array. Now we want to retrive all related data to display that a tweet.

If use SQL databse, first we will go the Tweet table and use the tweet_id to retrive that row, in that row, there may contains columns like user_id, content of the tweet, and likes. Clearly that's not all about this tweet, instead of user_id, we need the username, so we have join the User table to get the username. Also, besides content and likes, there are also comments and attachement like pictures for a tweet, those are one to many relation. So we have to join the Comment table and Picture table as well to get all comments and pictures. In this simple case, there are already Tweet table, User table, Comment table and Picture table involved. The cost to join these tables are really expensive. 

And that's the cost to get a single tweet, there are hundreds or even more tweets in a user's timeline. We don't want a user to wait for a minute to see the timeline.

Instead, if we use NoSQL databse, in the Tweet table, or say collection, we can simply store username, tweet content, likes, comments and pictures in a nested fashion, we can put all of them together, that means no join operation needed at all. It's clearly faster to retrive a Tweet.

This is only a simple scenario about the advantage to choose NoSQL. Also, if we want to horiziontally scale the database to have multiple database nodes running, it's far easier to scale with a NoSQL database.

#### React
The reason to choose React is simple, biggest reason is that we want to learn it. Also, by using React, we can separate Frontend from Backend, so for the backend we can simply make it an API server, there's no need to render and transmit the whole HTML to clients.


## Why xxx
### Amazon
Because I know Amazon is a top internet retailing company with a strong focus on customer experience. And there are a lot of talented people in amazon creating amazing products to make people’s life easier. 

Actually I have a roomate work at amazon, and he always showes a strong ownership to his projects and he always wants to make things perfect. This really touches my heart and reminds me of the time when I was working on the Workout TeampUp social networking applicaiton, I spent days and nights to polish the UI simply because I want to give a perfect user experience.

I believe I have similar spirits with Amazon, that one of the biggest reason why I want to join Amazon.

### Vecna
- I know it's a self patient health care product, can you tell a bit more about this product
- how did you came up with the idea to make this non-profit?
- future plan, you have robot, what's else

## Deadline / Time management
### What if you can’t make the deadline  
During my internship at MatrixCare, I was once given one week to update the logging framework from log4j to log4j2. I believe I could handle this because it didn’t sound that complicate, so I accepted. But it turned out that I was not that familiar with the product and underestimated the amount of work I have to do. 

When I realized that the deadline was fast approaching, I explained the situation to my manager and asked for an extension, which he granted. 

Finally I met the second deadline, and I learned that I need to be honest with myself about the workload I can handle. I also learned that when accepting assignments, I need to include extra time to ensure even there is a roadblock, I can still meet the deadline.

### Handle multiple task at same time
During my internship at Matrixcare, since we are following the agile development process, we have bi-weekly sprint to list tasks that we have to do in the following 2 weeks. So for myself, I have a TODO list to list all tasks assigned to me from most important to least important, and finish them one by one. Beside the TOOD list, I also uses a calendar app to help me be organized, because there are meetings, appointments, etc. With the help of TODO list and calendar, I will never missing any important events.


## Mistake
### Netagive feedback from teammate
- Tell me about a time when you were wrong
  
When I was working on the Workout TeamUp project with other two teammates, one of the teammates complained to me that I was always working alone and didn't paying enough attention to the team. 

This happened because it's a course project, it's new to all of us, and I have to learn how to do it. I enjoy the process to solve problems by myself, because I found it satisfying, so I rarely discuss with my teammates about any obstacles. 

After the teammate's complain, I realized that I have to make more communication with the team. so we decide to have daily short meetings to talk about any roadblocks, and share experiences with each other. 

It's only a short meeting, but we found that it clearly improved the whole team's efficiency.



`updating logging framework, go back and forth`

I'm passionate about learing new stuff, but maybe I'm too passionate and sometime this lead to trouble

### Cannot make the commitment
**Ref to deadline**


##  Ownership
> Leaders are owners. They think long term and don’t sacrifice long-term value for short-term results. They act on behalf of the entire company, beyond just their own team. They never say “that’s not my job."

### Tell me about a time when you had to leave a task unfinished.
***ref to tight deadline***

- Tell me about a time when you had to work on a project with unclear responsibilities.
  


## Insist on the Highest Standards
> Leaders have relentlessly high standards — many people may think these standards are unreasonably high. Leaders are continually raising the bar and drive their teams to deliver high quality products, services, and processes. Leaders ensure that defects do not get sent down the line and that problems are fixed so they stay fixed.

### Tell me about a time when [you, team member] couldn’t meet your expectations on a project.
***ref to tight deadline***



## Customer Obsession  
> Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust. Although leaders pay attention to competitors, they obsess over customers.

### Who was your most difficult customer?
Honestly say, I dont have a rich experience work with real "customers" yet, but since I'm doing a TA for the Capstone course, I do have a lot of experience with my student customers.

One of the most important duty for being a TA is to answer students' questions. And once I had a student having trouble with an assignment, it's a really hard one, and he didn't know how to start with it. Definitely I can't do the assignment for him, so gave him some helpful materials to look at, and suggested him with a possible approach to do it. 

I emailed him the second day to see if he was still having trouble with it, and he says that my suggestion was really helpful and he finished the assignment.


- Give me an example of a time when you did not meet a client’s expectations. What happened, and how did you attempt to rectify the situation?
- When you’re working with a large number of customers, it’s tricky to deliver excellent service to them all. How do you go about prioritizing your customers’ needs?



## Are Right, A Lot
> Leaders are right a lot. They have strong judgment and good instincts. They seek diverse perspectives and work to disconfirm their beliefs.

### Tell me about a time when you had to work with incomplete data or information.
`TODO` fix the front end 

During my internship at MatrixCare, I was given a task to fix a front-end bug caused by the update of container. 


## Hire and Develop the Best
> Leaders raise the performance bar with every hire and promotion. They recognize exceptional talent, and willingly move them throughout the organization. Leaders develop leaders and take seriously their role in coaching others. We work on behalf of our people to invent mechanisms for development like Career Choice.

### Tell me about a time when you mentored someone.
***ref to difficult customer***



## Deliver Results
> Leaders focus on the key inputs for their business and deliver them with the right quality and in a timely fashion. Despite setbacks, they rise to the occasion and never settle.

- By providing an example, tell me when you have had to handle a variety of assignments. Describe the results.
- What is the most difficult situation you have faced in your life? How did you handle it?
- Give me an example of a time when you were 75% of the way through a project, and you had to pivot strategy–how were you able to make that into a success story?

`TODO` handle multiple task at a time, tight schedule


## Bias for Action
> Speed matters in business. Many decisions and actions are reversible and do not need extensive study. We value calculated risk taking. 

- Describe a time when you saw some problems and took the initiative to correct it rather than waiting for someone else to do it.
- Tell me about a time when you took a calculated risk.
- Tell me about a time you needed to get information from someone who wasn’t very responsive. What did you do?
`TODO` 


## Dive Deep
> Leaders operate at all levels, stay connected to the details, audit frequently, and are skeptical when metrics and anecdote differ. No task is beneath them.

- Give me two examples of when you did more than what was required in any job experience.
- Tell me about something that you learned recently in your role.


## Invent and Simplify
> Leaders expect and require innovation and invention from their teams and always find ways to simplify. They are externally aware, look for new ideas from everywhere, and are not limited by “not invented here." As we do new things, we accept that we may be misunderstood for long periods of time.

- Tell me about a time when you gave a simple solution to a complex problem.
- Tell me about a time when you invented something.


## Learn and Be Curious
> Leaders are never done learning and always seek to improve themselves. They are curious about new possibilities and act to explore them.

- Tell me about a time when you influenced a change by only asking questions.
- Tell me about a time when you solved a problem through just superior knowledge or observation.
- How do you stay inspired, acquire new knowledge, or innovate in your work?


## Think Big
> Thinking small is a self-fulfilling prophecy. Leaders create and communicate a bold direction that inspires results. They think differently and look around corners for ways to serve customers.

- Tell me about your proudest professional achievement.
- Tell me about a time when you went way beyond the scope of the project and delivered.


## Frugality
> Accomplish more with less. Constraints breed resourcefulness, self-sufficiency, and invention. There are no extra points for growing headcount, budget size, or fixed expense.

- Tell me about a time when you had to work with limited time or resources.


## Earn Trust
> Leaders listen attentively, speak candidly, and treat others respectfully. They are vocally self-critical, even when doing so is awkward or embarrassing. Leaders do not believe their or their team’s body odor smells of perfume. They benchmark themselves and their teams against the best.

- What would you do if you found out that your closest friend at work was stealing?
- Tell me about a time when you had to tell someone a harsh truth.
- Tell me a time when you earned the trust of a group.


## Have Backbone; Disagree and Commit
> Leaders are obligated to respectfully challenge decisions when they disagree, even when doing so is uncomfortable or exhausting. Leaders have conviction and are tenacious. They do not compromise for the sake of social cohesion. Once a decision is determined, they commit wholly.

- Tell me about a time when you did not accept the status quo.
- Tell me about an unpopular decision of yours.
- Tell me about a time when you had to step up and disagree with a team members approach.
- If your direct manager was instructing you to do something you disagreed with, how would you handle it?
