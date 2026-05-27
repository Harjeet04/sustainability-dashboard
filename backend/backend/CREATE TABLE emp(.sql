CREATE TABLE emp(
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK(age>18),
    department VARCHAR(50),
    salary DECIMAL(10,2)
);