ctPhoneBook - Phone Book TASK

I Requested and implemented FUNCTIONALITIES
1. Create an account
2. Login
3. List my contacts
4. Add contact
5. Edit contact
6. Delete contact
7. Logout

II FRONTEND
Frontend is done as JSP.
It is written in Javascript, HTML and CSS

III BACKEND
Backend is done as RESTful services
written in Java

IV DATABASE SERVER
PostgreSQL-11.3
with pgcrypto modul
Note:
pgcrypto extension must be installed
because account password is encoded.

V WEB PPLICATION SERVER
TomCat-8.5.41
Note:
This application could work on other
Java web application servers as well.
For this purpose, it is needed to
rewrite xml files, as web.xml and other
xml files, in order to make this
application running on JBoss/WildFly,
GlassFish, Jetty and so on.

VI DEVELOPMENT IDE
Netbeans-11 is used to develop this
application.

V SOME LIMITATION
- Database must run on the same server
on which web application is rinning
- Database credentials must be:
user: postgres 
password: kvaka22
Note:
Some workaround is needed to overcome
these limitation, but it is not requested
by this task.

VI WHERE IS...
- Compiled application is in folder Bin
- Empty database backup is in folder Database
- Source code is in folder src

VII HOW TO START AND USE...
- After installing database on database
server and web application on web application
server, open web browser and go to:
<host_of_ctPhoneBook>/ctPhoneBook-1.0
then create account, then manage your
contacts.


2020-09-10
Goran Blagojevic
