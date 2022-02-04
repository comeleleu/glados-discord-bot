module.exports = {
    name: 'db',

    findOne(db, table, filters) {
        let feeds = this.findAll(db, table, filters);

        return feeds[0];
    },

    findAll(db, table, filters) {
        return db.get(table)
            .filter(filters)
            .value();
    },

    insert(db, table, push) {
        db.get(table)
            .push(push)
            .write();
    },

    update(db, table, find, assign) {
        db.get(table)
            .find(find)
            .assign(assign)
            .write();
    },

    delete(db, table, find) {
        this.update(db, table, find, { active: false });
    },

};