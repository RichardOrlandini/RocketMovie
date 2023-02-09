/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments("id");
    table.text("tagname");
    table.integer("user_id").references("id").inTable("users")
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }   
 */


exports.down = knex =>  knex.schema.dropTable("tags");
