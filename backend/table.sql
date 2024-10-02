create table user(
    id int primary key auto_increment,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    unique(email)
);

insert into user(name, contactNumber, email, password, status, role) values('Admin', '(77)98872-8483', 'admin@gmail.com', 'admin', 'true', 'admin');

create table category(
    id int NOT NULL auto_increment,
    name varchar(255) NOT NULL,
    primary key(id)
)

create table product(
    id int NOT NULL auto_increment,
    name varchar(255) NOT NULL,
    categoryId integer NOT NULL,
    description varchar(255),
    price integer,
    status varchar(20),
    primary key(id)
);

insert into product(id, name, categoryId, description, price, status) values(1, 'Teste', 1, 'Teste de Categoria', 20, true);

create table bill(
     id int NOT NULL auto_increment,
     uuid varchar(200) NOT NULL,
     name varchar(255) NOT NULL,
     email varchar(255) NOT NULL,
     contactNumber VARCHAR(20) NOT NULL,
     paymentMethod varchar(50) NOT NULL,
     total int NOT NULL,
     productDetails JSON DEFAULT NULL,
     createdBy varchar(255) NOT NULL,
     primary key(id)
);