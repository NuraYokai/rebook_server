const pool = require("../config/db");

// SQL query to check if the 'users' table exists
const checkTableQuery = `
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
  AND table_name = 'users';
`;

// Function to check if the 'users' table exists
const checkTable = () => {
  pool.query(checkTableQuery, (error, result) => {
    if (error) {
      console.error("Error checking table: ", error);
      return;
    }
    if (result[0]["COUNT(*)"] > 0) {
      console.log("Table 'users' exists server is ready");
    } else {
      console.log("Table 'users' does not exist, creating it");
      const createTableQuery = `
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          token VARCHAR(255)
        );
      `;
      pool.query(createTableQuery, (error, result) => {
        if (error) {
          console.error("Error creating table: ", error);
          return;
        }
        console.log("Table created successfully server is ready");
      });
    }
  });
};

// Call the function to check the 'users' table
checkTable();
