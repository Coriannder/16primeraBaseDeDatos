import knex from "knex";

export class ContainerDB{
    constructor(option){
        this.option = option
        this.knex = knex(option.config)
    }

    async newTable(){
		try {
			return this.knex.schema.dropTableIfExists(this.option.table).finally(() => { //Si existe la tabla la elimina
				return this.knex.schema.createTable(this.option.table, (table) => {      // Una vez eliminada la creo de nuevo

					switch(this.option.table){
						case "products":                                // Para crear tabla products
							table.increments("id").primary();
							table.string("title", 50).notNullable();
							table.float("price");
							table.string("thumbnail");
							break;
						case "messages":								// Para crear tabla messages
							table.string("author", 50).notNullable();
							table.string("date");
							table.string("text");
							break;
					}
				}).then(console.log(`Tabla ${this.option.table} Creada`));
			});
		} catch (error) {
			throw new Error(`Error al crear tabla: ${error}`);
		}
	}

	async save(obj){
		try {
			return this.knex(this.option.table).insert(obj).then('Datos guardados correctamente')    // Guarda una fila nueva en la tabla
		} catch (error) {
			throw new Error(`Error guardando obj: ${error}`);
		}
	}

	async getAll() {                      // Devuelve todas las filas de la tabla
		try {
			return this.knex.select().from(this.option.table)
		} catch (error) {
			throw new Error(`Error no se puede obtener los datos de la tabla: ${error}`);
		}
	}

	async getById(id){                   // Devuelve fila por ID
		try {
			return (await this.getAll()).find(elem => elem.id == id)
		} catch (error) {
			throw new Error(`Error no se puede obtener datos con ese id: ${error}`);
		}
	}

	async update(id, obj){              // Actualiza una fila por ID
		try {
			return this.knex(this.option.table).where('id', id).update(obj).then('Datos actualizados')
		} catch (error) {
			throw new Error(`Error no se pudo actulizar los datos: ${error}`);
		}
	}

	async deleteAll(){                 // Elimina todas las filas de la tabla
		try {
			this.knex(this.option.table).del().then(console.log('Datos borrados'))
		} catch (error) {
			throw new Error(`Error no se pudo eliminar los datos: ${error}`);
		}
	}

	async deleteById(id){             // Elimina una fila por ID
		try {
			this.knex(this.option.table).where("id",id).del().then(console.log('Datos borrados'))
		} catch (error) {
			throw new Error(`Error no se pudo eliminar los datos: ${error}`);
		}
	}
}

