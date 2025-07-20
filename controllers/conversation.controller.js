const connection = require('../config/db')

exports.getAllConversations = (request, response) => {
  const userId = request.user.id

  connection.query(
    `
    SELECT c.conversation_id, c.conversation_title, c.conversation_created_at
    FROM conversations c
    JOIN users_conversations uc ON uc.conversation_id = c.conversation_id
    WHERE uc.user_id = ?
    `,
    [userId],
    (error, results) => {
      if (error) return response.sendStatus(500)
      response.json(results)
    }
  )
}

exports.createConversation = (request, response) => {
  const { title } = request.body
  const userId = request.user.id

  connection.query(
    `
    INSERT INTO conversations(conversation_title, conversation_type_id)
    VALUES (?, ?)
    `,
    [title, 1],
    (error, result) => {
      if (error) return response.sendStatus(500)

      const conversationId = result.insertId

      connection.query(
        `
        INSERT INTO users_conversations(user_id, conversation_id)
        VALUES (?, ?)
        `,
        [userId, conversationId],
        (error) => {
          if (error) return response.sendStatus(500)
          response.status(201).json({ conversation_id: conversationId, title })
        }
      )
    }
  )
}

exports.renameConversation = (request, response) => {
  const { id } = request.params
  const { title } = request.body

  connection.query(
    `UPDATE conversations SET conversation_title = ? WHERE conversation_id = ?`,
    [title, id],
    (error, result) => {
      if (error) return response.sendStatus(500)
      response.sendStatus(204)
    }
  )
}

exports.deleteConversation = (request, response) => {
  const { id } = request.params

  connection.query(`DELETE FROM users_conversations WHERE conversation_id = ?`, [id], (error) => {
    if (error) return response.sendStatus(500)

    connection.query(`DELETE FROM conversations WHERE conversation_id = ?`, [id], (error) => {
      if (error) return response.sendStatus(500)
      response.sendStatus(204)
    })
  })
}
