const mysql = require("mysql2");
const express = require("express");
let app = express();
let cors = require("cors");
app.use(cors());

app.use(express.json());

//middle ware to extract information from the HTML body name attribute.
app.use(express.urlencoded({ extended: true }));

// console.log(express);

// app.get("/products/:id", function (req, res, next) {
//   res.json({ msg: "This is CORS-enabled for all origins!" });
// });

// app.listen(80, function () {
//   console.log("CORS-enabled web server listening on port 80");
// });
let mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "myDBuser",
  database: "mydbuser",
  // port: "3307",
});
mysqlConnection.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to mysql2 successfully");
});

app.get("/create-product-table", (req, res) => {
  let Display = "Table is created.";

  let createProducts = `CREATE TABLE IF NOT EXISTS products_table(
  product_Id INT(8) PRIMARY KEY AUTO_INCREMENT,
  product_url nVARCHAR(255) NOT NULL,
  product_name nVARCHAR(255) NOT NULL)`;

  let createProductDescription = `CREATE TABLE IF NOT EXISTS productDescription_table(
  description_Id INT PRIMARY KEY AUTO_INCREMENT,
  product_Id INT(8) NOT NULL,
  product_brief_description VARCHAR(255) NOT NULL,
  product_description VARCHAR(255) NOT NULL,
  product_image VARCHAR(255) NOT NULL,
  product_link VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_Id) REFERENCES products_table(product_Id))`;

  let createProductPrice = `CREATE TABLE IF NOT EXISTS ProductPrice_table(
  price_Id INT PRIMARY KEY AUTO_INCREMENT,
  product_Id INT(8) NOT NULL,
  starting_price nVARCHAR(255) NOT NULL,
  price_Range nVARCHAR(255) NOT NULL,
  FOREIGN KEY (product_Id) REFERENCES products_table(product_Id))`;

  let createUser = `CREATE TABLE IF NOT EXISTS User_table(
  user_Id INT PRIMARY KEY AUTO_INCREMENT,
  user_name nVARCHAR(255) NOT NULL,
  user_Password nVARCHAR(255) NOT NULL)`;

  let createOrders = `CREATE TABLE IF NOT EXISTS orders_table(
    order_Id INT PRIMARY KEY AUTO_INCREMENT,
    product_Id INT(8) NOT NULL,
    user_Id INT NOT NULL,
    FOREIGN KEY (product_Id) REFERENCES products_table(product_Id),
    FOREIGN KEY (user_Id) REFERENCES User_table(user_Id))`;

  mysqlConnection.query(createProducts, (err, results, fields) => {
    if (err) console.log(err);
  });

  mysqlConnection.query(createProductDescription, (err, results, fields) => {
    if (err) console.log(err);
  });

  mysqlConnection.query(createProductPrice, (err, results, fields) => {
    if (err) console.log(err);
  });

  mysqlConnection.query(createUser, (err, results, fields) => {
    if (err) console.log(err);
  });

  mysqlConnection.query(createOrders, (err, results, fields) => {
    if (err) console.log(err);
  });

  res.end(Display);
  console.log("Tables Created");
});

// insert Data
app.post("/addiphones", (req, res) => {
  console.log(req.body);
  const {
    product_url,
    product_name,
    product_description,
    product_image,
    product_link,
    starting_price,
    price_Range,
    briefDescription,
    user_name,
    user_Password,
  } = req.body;

  let insertProduct = `INSERT INTO products_table(product_url,product_name) VALUES(?, ?)`;

  let insertDescription = `INSERT INTO productDescription_table(product_Id, product_brief_description, product_description, product_image, product_link) VALUES(?, ?, ?, ?, ? )`;

  let insertPrice = `INSERT INTO ProductPrice_table (product_Id, starting_price, price_Range) VALUES(?, ?, ?)`;

  let insertuser =
    "INSERT INTO User_table(user_name, user_password) VALUES(?, ?)";

  let insertOrders = `INSERT INTO orders_table(product_Id, user_Id) VALUES(? ,?)`;

  mysqlConnection.query(
    insertProduct,
    [product_url, product_name],
    (err, results) => {
      console.table(results);
      if (err) throw err;
      console.log("product table inserted succesfully.");
      let pid = results.insertId;
      mysqlConnection.query(
        insertDescription,
        [
          pid,
          briefDescription,
          product_description,
          product_image,
          product_link,
        ],
        (err, results) => {
          if (err) throw err;
          console.log("description  inserted succesfully.");
        }
      );

      mysqlConnection.query(
        insertPrice,
        [pid, starting_price, price_Range],
        (err, results) => {
          if (err) throw err;
          console.log("price inserted succesfully.");
        }
      );
      mysqlConnection.query(
        insertuser,
        [user_name, user_Password],
        (err, results, fields) => {
          if (err) console.log(err);
          let UID = results.insertId;
          mysqlConnection.query(
            insertOrders,
            [pid, UID],
            (err, results, fields) => {
              if (err) console.log(err);
            }
          );
        }
      );
    }
  );

  console.log("Data inserted succesfully.");
  res.end("Data inserted succesfully.");
});

app.listen(5000, () =>
  console.log("Listening to: 5000 and running on http://localhost:5000")
);

//Get all iphone's
app.get("/iphones", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM products_table INNER JOIN productDescription_table INNER JOIN ProductPrice_table ON products_table.product_id = productDescription_table.product_id AND products_table.product_id = ProductPrice_table.product_id",
    (err, rows) => {
      let iphones = {products : [] };
      iphones.products = rows;
      var stringIphones = JSON.stringify(iphones);
      if (!err) res.json({ products: rows });
      else console.log(err);
    }
  );
});

app.listen(3001, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening to : 3001");
  }
});
