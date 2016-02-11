// add a "created" property to documents
module.exports = function (schema) {
    schema.add({ created: { type: Date, default: Date.now }})
}