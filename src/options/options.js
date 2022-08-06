
export const optionMySQL = {

	table: "products",
	config: {
		client: "mysql",
		connection: {
			host: "127.0.0.1",
			user: "root",
			password: "",
			database: "ecommerce",
		},
	}
};

export const optionSQLite = {

	table: "messages",
	config: {
		client: "sqlite3",
		connection: { filename: "./src/DB/db.sqlite" },
		useNullAsDefault: true,
	},
};
