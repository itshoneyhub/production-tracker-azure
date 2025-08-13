import sql from 'mssql';

const connectionString = 'Server=192.168.1.240,1433;Database=production_track_db;User Id=productionTracker;Password=2025;TrustServerCertificate=True;';

async function connectAndQuery() {
  try {
    await sql.connect(connectionString);
    const result = await sql.query`SELECT 1 AS test`;
    if (result.recordset[0].test === 1) {
      console.log('Database connected successfully');
    }
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    await sql.close();
  }
}

connectAndQuery();
