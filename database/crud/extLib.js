export function create(db, record){
    db.collection('extLib')
        .insertOne({...record});
}
