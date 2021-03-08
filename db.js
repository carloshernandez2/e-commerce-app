const { db } = require('./config')

const getInsults = (request, response) => {
  const {q} = request.query || '';
  db.query(`SELECT * FROM trump WHERE insult LIKE '${q}%' ORDER BY id LIMIT 20;`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getInsults
}