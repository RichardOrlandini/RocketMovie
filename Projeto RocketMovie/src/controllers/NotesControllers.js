const knex = require("../database/knex");

class NotesControllers {


    async create(request, response){
        const {title, description, tags, rating} = request.body;
        const user_id = request.user.id;

        const note_id = await knex("notes").insert({
            title,
            description,
            rating,
        user_id
        });// pegando o id da nota na variavel note_id

        const tagsInsert = tags.map(tagname => {
            return {
                note_id,
                tagname,
                user_id
            }
        });
       await knex("tags").insert(tagsInsert);

        return response.status(201).json();
    }

    async index(request, response){
        const { title, tags  } = request.query;
        const user_id = request.user.id;

        let notes;

        if(tags){
            const filterTags = tags.split(',').map(tag => tag.trim()); // trim?
            
            notes = await knex("tags")
            .select([ 
                "notes.id",
                "notes.title",
                "notes.user_id",
            ])
            .where("notes.user_id", user_id)
            .whereLike("notes.title", `%${title}%`)
            .whereIn("tagname", filterTags)
            .innerJoin("notes", "notes.id", "tags.note_id")
            .orderBy("notes.title")
        } else{
            notes = await knex("notes")
            .where({user_id})
            .whereLike("title", `%${title}%`)
            .orderBy("title");
        }

        const userTags = await knex("tags").where({ user_id});

        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);
            return{
                ...note,
                tags: noteTags
            }
        });

        return response.json(notesWithTags);
    }

    async show(request, response){
        const {note_id} = request.params;

        const note = await knex("notes").where({id: note_id}).first();
        const tags = await knex("tags").where({note_id}).orderBy("tagname");

        return response.json({
            ...note,
            tags, 
        });
    }

    async delete(request, response){
        const {note_id} = request.query;
        const user_id = request.user.id;

        await knex("notes").where("id", note_id).whereAnd("user_id", user_id).first().delete();

        return response.json();
    } 
}

module.exports = NotesControllers;
