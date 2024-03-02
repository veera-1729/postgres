const {pool} = require("../utils/db");

const getCustomers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * 20;
    try {
      const result = await pool.query(`
        SELECT * FROM customers
        ORDER BY CustomerID
        LIMIT 20 OFFSET $1
      `, [offset]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

const searchUser =  async (req, res) => {
    const searchTerm = req.query.q;
    console.log(searchTerm);
    try {
      const result = await pool.query(`
        SELECT * FROM customers
        WHERE FirstName ILIKE $1
        OR LastName ILIKE $1
        OR Location ILIKE $1
        OR PhoneNo ILIKE $1
      `, [`%${searchTerm}%`]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error searching customers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const createCustomers = async(req,res) => {
    const client = await pool.connect();
    try {
        pool.query(`
  CREATE TABLE IF NOT EXISTS customers (
    CustomerID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Location VARCHAR(100),
    PhoneNo VARCHAR(15)
  )
`).then(() => {
   // Populate customers table
}).catch(err => {
  console.error('Error creating customers table:', err);
});
      // Insert new records into the customers table
      await client.query(`
      INSERT INTO customers (FirstName, LastName, Location, PhoneNo)
      SELECT 
          'FirstName' || generate_series as FirstName,
          'LastName' || generate_series as LastName,
          'Location' || generate_series as Location,
          '123456789' || generate_series as PhoneNo
      FROM generate_series(1, 50);
      
      `);
    } catch (err) {
      console.error('Error creating customers:', err);
    } finally {
      client.release();
    }
  }
module.exports = {getCustomers,searchUser,createCustomers};