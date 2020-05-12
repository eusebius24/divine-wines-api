const DivineWinesService = {
    getAllRecords(knex) {
        return knex.select('*').from('wines')
    },
    insertRecord(knex, newRecord) {
        return knex
            .insert(newRecord)
            .into('wines')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('wines').select('*').where('id', id).first()
    },
    deleteRecord(knex, id) {
        return knex('wines')
            .where({ id })
            .delete()
    },
    updateRecord(knex, id, newRecordFields) {
        return knex('wines')
            .where({ id })
            .update(newRecordFields)
    },
}

module.exports = DivineWinesService;